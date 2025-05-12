"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import MessageInput from "@/components/messeage-input";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";

type Message = {
  messageId: string;
  userId: string;
  nickName: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
};

type MessageGroup = {
  userId: string;
  nickName: string;
  avatarUrl?: string;
  timeLabel: string;
  messages: { messageId: string; content: string; createdAt: string }[];
  lastTime: Date;
};

type GroupedDay = {
  dateLabel: string;
  messageGroups: MessageGroup[];
};

export default function DmChat({ dmId }: { dmId: string | undefined }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ messageId: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { userId } = useAuth();

  useEffect(() => {
    if (!token || !dmId) return;

    axios
      .get(`http://localhost:8080/dm/${dmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.response || []))
      .catch((err) => console.error("❌ 메시지 불러오기 실패:", err));

    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${token}`);
    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stomp.subscribe(`/topic/dm/${dmId}`, (msg) => {
          const data = JSON.parse(msg.body);
          console.log(data);
          if (data.type === "SEND") {
            setMessages((prev) => [...prev, data.message]);
          } else if (data.type === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.messageId === data.message.messageId ? { ...m, content: data.message.content } : m)),
            );
          } else if (data.type === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.messageId !== data.message.messageId));
          }
        });
        setClient(stomp);
      },
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [token, dmId]);

  const sendMessage = (content: string) => {
    if (!client || !content.trim()) return;
    client.publish({
      destination: `/app/dm/${dmId}`,
      body: JSON.stringify({ content }),
    });
  };

  const updateMessage = async (messageId: string, content: string) => {
    if (!client || !content.trim()) {
      console.log("메시지가 빔");
      alert("✅ 메시지를 작성해주세요");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/dm/${dmId}/message/${messageId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("✅ 메시지 수정 완료");
      setMessages((prev) => prev.map((msg) => (msg.messageId === messageId ? { ...msg, content } : msg)));
      setEditingMessage(null);
    } catch (err) {
      console.error("❌ 메시지 수정 실패:", err);
      alert("❌ 수정 실패");
    }
  };

  const groupMessages = (messages: Message[]): GroupedDay[] => {
    const grouped: GroupedDay[] = [];
    let currentDate = "";
    let currentGroup: MessageGroup | null = null;
    let currentDay: GroupedDay | null = null;

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt);
      const dateKey = date.toDateString();
      const timeLabel = new Intl.DateTimeFormat("ko-KR", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);

      if (dateKey !== currentDate) {
        currentDate = dateKey;
        currentDay = {
          dateLabel: new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(date),
          messageGroups: [],
        };
        grouped.push(currentDay);
        currentGroup = null;
      }

      const lastMessage = currentGroup?.messages.at(-1);
      const lastTime = lastMessage ? new Date(lastMessage.createdAt) : null;
      const isSameGroup =
        currentGroup &&
        currentGroup.userId === msg.userId &&
        lastTime &&
        date.getTime() - lastTime.getTime() <= 60 * 1000;

      if (isSameGroup) {
        currentGroup.messages.push({
          messageId: msg.messageId,
          content: msg.content,
          createdAt: msg.createdAt,
        });
      } else {
        currentGroup = {
          userId: msg.userId,
          nickName: msg.nickName,
          avatarUrl: msg.avatarUrl,
          timeLabel,
          lastTime: date,
          messages: [
            {
              messageId: msg.messageId,
              content: msg.content,
              createdAt: msg.createdAt,
            },
          ],
        };
        currentDay?.messageGroups.push(currentGroup);
      }
    });

    return grouped;
  };

  let groupedMessages = groupMessages(messages);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    groupedMessages = groupMessages(messages);
  }, [messages]);

  return (
    <SectionFour>
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-6 w-full pb-[90px]">
        {groupedMessages.map((group, groupIdx) => (
          <div key={groupIdx}>
            <div className="text-center text-gray-400 text-sm my-6 w-full">{group.dateLabel}</div>
            {group.messageGroups.map((g, i) => {
              const isMine = g.userId === userId;
              return (
                <div key={i} className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-4`}>
                  <Image
                    src={g.avatarUrl || "/assets/discord_blue.png"}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2 mt-1"
                  />
                  <div className="w-full">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-300 font-bold mb-1 mt-2">{g.nickName}</div>
                      <div className="text-xs text-gray-400 mt-1 ml-2">{g.timeLabel}</div>
                    </div>
                    {g.messages.map((msg) => (
                      <div key={msg.messageId} className="w-full my-[2px] flex group relative">
                        {editingMessage?.messageId === msg.messageId ? (
                          <div className="w-full flex items-center gap-2">
                            <input
                              type="text"
                              value={editingMessage.content}
                              onChange={(e) => setEditingMessage({ ...editingMessage, content: e.target.value })}
                              className="flex-1 p-2 rounded bg-[#2f3136] text-white"
                              autoFocus
                            />
                            <button
                              onClick={() => updateMessage(editingMessage.messageId, editingMessage.content)}
                              className="px-3 py-1 bg-[#5865f2] text-white rounded hover:bg-[#4752c4]"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => setEditingMessage(null)}
                              className="px-3 py-1 bg-[#2f3136] text-white rounded hover:bg-[#202225]"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`p-3 rounded-lg break-words w-full ${isMine ? "bg-[#5865f2] text-white ml-auto" : "bg-[#5865f2] text-white"}`}
                          >
                            {msg.content}
                          </div>
                        )}
                        {isMine && !editingMessage && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 right-2 group-hover:block hidden cursor-pointer"
                            onClick={() => setEditingMessage({ messageId: msg.messageId, content: msg.content })}
                          >
                            ✏️
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 z-20 w-full bg-discord1and4">
        <MessageInput onSend={sendMessage} />
      </div>
    </SectionFour>
  );
}

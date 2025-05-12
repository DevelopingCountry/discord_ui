"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import MessageInput from "@/components/messeage-input";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
type MessageGroup = {
  userId: string;
  nickName: string;
  avatarUrl?: string;
  timeLabel: string;
  messages: string[];
  lastTime: Date;
};

type GroupedDay = {
  dateLabel: string;
  messageGroups: MessageGroup[];
};
type Message = {
  messageId: string;
  userId: string;
  nickName: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
};

export default function DmChat({ dmId }: { dmId: string | undefined }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [editingMessage, setEditingMessage] = useState<{ messageId: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { userId } = useAuth();
  console.log("userId = ", userId);
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
    if (!client || !content.trim()) return;
    try {
      await axios.patch(
        `http://localhost:8080/dm/${dmId}/message/${messageId}`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("✅ 메시지 수정 완료");
      setMessages((prev) => prev.map((msg) => (msg.messageId === messageId ? { ...msg, content: content } : msg)));
      setEditingMessage(null);
    } catch (err) {
      console.error("❌ 메시지 수정 실패:", err);
      alert("❌ 수정 실패");
    }
  };

  // 그룹핑 로직: 날짜 + 같은 유저 + 5분 이내
  const groupMessagesByDateAndUser = (messages: Message[]) => {
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

      const prevTime = currentGroup?.lastTime || null;
      const isSameMinute =
        prevTime && date.getHours() === prevTime.getHours() && date.getMinutes() === prevTime.getMinutes();
      if (currentGroup && currentGroup.userId === msg.userId && isSameMinute) {
        currentGroup.messages.push(msg.content);
        currentGroup.lastTime = date;
      } else {
        currentGroup = {
          userId: msg.userId,
          nickName: msg.nickName,
          avatarUrl: msg.avatarUrl,
          timeLabel,
          messages: [msg.content],
          lastTime: date,
        };
        if (currentDay) {
          currentDay.messageGroups.push(currentGroup);
        }
      }
    });

    return grouped;
  };

  const groupedMessages = groupMessagesByDateAndUser(messages);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // max-h-[calc(100vh-48px)]
  return (
    <SectionFour>
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-6 w-full pb-[90px]">
        {groupedMessages.map((group, index) => (
          <div key={index}>
            <div className="text-center text-gray-400 text-sm my-6 w-full">{group.dateLabel}</div>
            {group.messageGroups.map((g, i) => {
              const isMine = g.userId === userId;
              return (
                <div key={i} className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-4 `}>
                  {/*{!isMine && (*/}
                  {/*  <Image*/}
                  {/*    src={g.avatarUrl || "/assets/discord_blue.png"}*/}
                  {/*    alt={"d"}*/}
                  {/*    width={32}*/}
                  {/*    height={32}*/}
                  {/*    className="w-8 h-8 rounded-full mr-2 mt-1"*/}
                  {/*  />*/}
                  {/*)}*/}
                  <Image
                    src={g.avatarUrl || "/assets/discord_blue.png"}
                    alt={"d"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full mr-2 mt-1"
                  />
                  {/*${isMine ? "text-right" : ""}*/}
                  <div className={"w-full"}>
                    <div className={"flex items-center"}>
                      <div className="text-sm text-gray-300 font-bold mb-1 mt-2">{g.nickName}</div>
                      <div className="text-xs text-gray-400 mt-1 ml-2">{g.timeLabel}</div>
                    </div>
                    {g.messages.map((line, idx) => {
                      const message = messages.find((m) => m.content === line);
                      return (
                        <div key={idx} className="w-full my-[2px] flex group relative">
                          {editingMessage && message && editingMessage.messageId === message.messageId ? (
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
                              className={`p-3 rounded-lg break-words w-full ${
                                isMine ? "bg-[#5865f2] text-white ml-auto" : "bg-[#5865f2] text-white"
                              }`}
                            >
                              {line}
                            </div>
                          )}
                          {isMine && !editingMessage && (
                            <div
                              className="absolute top-1/2 -translate-y-1/2 right-2 group-hover:block hidden cursor-pointer"
                              onClick={() => {
                                if (message?.messageId) {
                                  setEditingMessage({ messageId: message.messageId, content: line });
                                }
                              }}
                            >
                              ✏️
                            </div>
                          )}
                        </div>
                      );
                    })}
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

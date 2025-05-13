"use client";

import SectionOne from "@/public/homeDir/ui/sectionOne";

import SectionFour from "@/public/homeDir/ui/sectionFour";

import { Bell, Hash, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChannelContext } from "@/components/context/channel-context";
import { useChannelStore } from "@/components/store/use-channel-store";
import MessageInput from "@/components/messeage-input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
type ChannelMessage = {
  channelId: string;
  messageId: string;
  userId: string;
  nickName: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
};
type MessageGroup = {
  userId: string; // 이건 ChannelMessage에서 string으로 정의돼 있음
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
export default function Home() {
  const channelId = useChannelContext()?.channelId;
  const { channels } = useChannelStore(); // 전체 채널 리스트 가져오기
  // 현재 channelId에 해당하는 채널 찾기
  const currentChannel = channels.find((channel) => channel.id === channelId);
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  // const currentUserId = "567717671374688256";
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const [editingMessage, setEditingMessage] = useState<{ messageId: string; content: string } | null>(null);

  useEffect(() => {
    if (!token || !channelId) return;
    setIsLoading(true); // API 요청 시작 시 로딩 상태로 변경
    axios
      .get(`http://localhost:8080/channel/${channelId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessages(res.data.response || []);
        setIsLoading(false); // 로딩 완료
      })
      .catch((err) => {
        console.error("❌ 메시지 불러오기 실패:", err);
        setIsLoading(false); // 에러 발생해도 로딩 상태 종료
      });

    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${token}`);
    const stomp = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stomp.subscribe(`/topic/channel/${channelId}`, (msg) => {
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
  }, [token, channelId]);
  const sendMessage = (content: string) => {
    if (!client || !content.trim()) return;
    client.publish({
      destination: `/app/channel/${channelId}`,
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
        `http://localhost:8080/channel/${channelId}/message/${messageId}`,
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
  const deleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`http://localhost:8080/channel/${channelId}/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ 메시지 삭제 완료");
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
    } catch (err) {
      console.error("❌ 메시지 삭제 실패:", err);
      alert("❌ 삭제 실패");
    }
  };
  // 그룹핑 로직: 날짜 + 같은 유저 + 5분 이내
  const groupMessagesByDateAndUser = (messages: ChannelMessage[]): GroupedDay[] => {
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
          avatarUrl: msg.imageUrl,
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
  let groupedMessages = groupMessagesByDateAndUser(messages);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    groupedMessages = groupMessagesByDateAndUser(messages);
  }, [messages]);

  return (
    <>
      <SectionOne>
        <div className="flex items-center h-12 px-2 border-b border-[#1e1f22] shadow-sm">
          <Hash className="w-5 h-5 mr-2 text-[#96989d]" />
          <h3 className="font-bold text-white">{currentChannel?.name || "채널 이름 없음"}</h3>
        </div>
        <div className="p-3 flex flex-shrink-0 absolute right-1 z-10">
          <div className={"text-[#b5bac1] pr-2 flex-shrink-0 bg-discord1and4 "}>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
              <Users className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#96989d]" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1e1f22] text-sm rounded-md py-1.5 pl-9 pr-3 text-[#dcddde] placeholder:text-[#96989d] focus:outline-none"
            />
          </div>
        </div>
      </SectionOne>
      <SectionFour>
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar relative px-4 py-6 w-full pb-[90px]">
          {isLoading ? (
            // 로딩 중일 때 보여줄 내용
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-[#36393f] h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-[#36393f] rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#36393f] rounded"></div>
                    <div className="h-4 bg-[#36393f] rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            // 메시지가 없을 때 보여줄 내용
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-[#96989d] text-lg mb-2">아직 메시지가 없습니다</div>
              <div className="text-[#72767d] text-sm">
                {currentChannel?.name
                  ? `${currentChannel.name} 채널에서 첫 메시지를 보내보세요!`
                  : "채널에서 첫 메시지를 보내보세요!"}
              </div>
            </div>
          ) : (
            // 기존 메시지 표시 코드 (변경 없음)
            groupedMessages.map((group, groupIdx) => (
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
                              <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2 group-hover:flex hidden cursor-pointer">
                                <span
                                  onClick={() => setEditingMessage({ messageId: msg.messageId, content: msg.content })}
                                >
                                  ✏️
                                </span>
                                <span
                                  onClick={() => {
                                    const confirmed = confirm("정말 이 메시지를 삭제하시겠습니까?");
                                    if (confirmed) deleteMessage(msg.messageId);
                                  }}
                                >
                                  🗑️
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 z-20 w-full bg-discord1and4">
          <MessageInput onSend={sendMessage} />
        </div>
      </SectionFour>
    </>
  );
}

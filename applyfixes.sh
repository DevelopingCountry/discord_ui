#!/bin/bash
# discord_ui 로컬 레포에서 실행하세요
# 실행 방법: cd /path/to/discord_ui && bash apply-fixes.sh

set -e

echo "=== discord_ui 수정 스크립트 ==="
echo "1. lib/config.ts 생성"
echo "2. localhost:8080 하드코딩 → API_URL 환경변수로 교체"
echo "3. voiceChannel-item.tsx userId 하드코딩 수정"
echo ""

# ── 1. lib/config.ts 생성 ────────────────────────────────────────────────────
cat > lib/config.ts << 'EOF'
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
export const WS_URL = API_URL.replace(/^http/, "ws");
EOF
echo "✅ lib/config.ts 생성 완료"

# ── 2. lib/StompChat.ts ───────────────────────────────────────────────────────
cat > lib/StompChat.ts << 'EOF'
// lib/stomp.ts
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { API_URL } from "@/lib/config";
type messages = {
  dmId: string;
  messageId: string;
  userId: string;
  nickName: string;
  imageUrl: string;
  content: string;
  createdAt: string;
};
let stompClient: Client | null = null;

type MessageHandler = (type: string, message: messages) => void;

export function connectStomp(token: string, dmId: string, onMessage: MessageHandler) {
  const socket = new SockJS(`${API_URL}/ws-chat?token=${token}`);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      stompClient?.subscribe(`/topic/dm/${dmId}`, (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        if (data?.type && data?.message) {
          onMessage(data.type, data.message);
        }
      });
    },
  });

  stompClient.activate();
}

export function sendStompMessage(dmId: string, content: string) {
  if (!stompClient || !stompClient.connected) return;
  stompClient.publish({
    destination: `/app/dm/${dmId}`,
    body: JSON.stringify({ content }),
  });
}

export function disconnectStomp() {
  stompClient?.deactivate();
}
EOF
echo "✅ lib/StompChat.ts 수정 완료"

# ── 3. lib/socket.ts ──────────────────────────────────────────────────────────
cat > lib/socket.ts << 'EOF'
import { WS_URL } from "@/lib/config";
let socket: WebSocket | null = null;
let onMessageCallback: ((msg: messages) => void) | null = null;
type messages = {
  dmId: string;
  messageId: string;
  userId: string;
  nickName: string;
  imageUrl: string;
  content: string;
  createdAt: string;
};
export function connectWebSocket(onMessage: (msg: messages) => void) {
  socket = new WebSocket(`${WS_URL}/ws`);
  onMessageCallback = onMessage;

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log("📥 Received message", message);

    if (onMessageCallback) {
      onMessageCallback(message);
    }
  };

  socket.onclose = () => {
    console.log("❌ WebSocket disconnected");
  };

  socket.onerror = (error) => {
    console.error("🔥 WebSocket error", error);
  };
}

export function sendMessage(dmId: string, content: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket is not open");
    return;
  }

  const payload = {
    content,
  };

  socket.send(
    JSON.stringify({
      destination: `/app/dm/${dmId}`,
      body: JSON.stringify(payload),
    }),
  );
}
EOF
echo "✅ lib/socket.ts 수정 완료"

# ── 4. lib/NotificationSubscribe.tsx ─────────────────────────────────────────
cat > lib/NotificationSubscribe.tsx << 'EOF'
"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Profile } from "@/components/type/response";
import { API_URL } from "@/lib/config";

export default function NotificationSubscribe({ myProfile }: { myProfile: Profile }) {
  const { accessToken } = useAuth();
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);
  useEffect(() => {
    console.log("NotificationSubscribe useEffect 실행");
    console.log("accessToken = ", accessToken);
    if (!accessToken) return;
    const socket = new SockJS(`${API_URL}/ws-chat?token=${accessToken}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      console.log("NotificationSubscribe 연결 성공");
      stomp.subscribe(`/user/queue/notifications`, (msg) => {
        const data = JSON.parse(msg.body);
        console.log("📩 data 확인:", data);
        const type = data.action;
        const payload = data.payload;
        console.log("📩 DM 알림 구조 확인:", payload.senderName, payload.message);
        console.log("📩 알림 수신:", type, payload);
        switch (type) {
          case "INVITE":
            console.log("서버 초대 알림");
            break;
          case "DM":
            console.log("DM 알림");
            break;
          case "FRIEND_REQUEST":
            console.log("친구 요청 알림");
            break;
          default:
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [accessToken, myProfile]);
  return null;
}
EOF
echo "✅ lib/NotificationSubscribe.tsx 수정 완료"

# ── 5. components/add-friend.tsx ──────────────────────────────────────────────
cat > components/add-friend.tsx << 'EOF'
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useFriendsContext } from "@/components/context/friends-context";
import { useAuth } from "@/components/context/AuthContext";
import { friendsDataType } from "@/components/type/response";
import AddFriendBar from "@/components/add-friend-bar";
import { API_URL } from "@/lib/config";
export default function AddFriend() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [searchedUser, setSearchedUser] = useState<friendsDataType | null>(null);
  const { accessToken } = useAuth();
  const friendsData = useFriendsContext()?.friendsData;
  const clickHandler = () => {
    console.log("username ", username);
    const body = {
      nickName: username,
    };
    console.log("Sending request body:", { nickName: username });
    console.log("Access Token:", accessToken);
    axios
      .post(`${API_URL}/friend/search`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("hhi");
        const newFriend: friendsDataType = res.data.response;
        console.log("newFriend", newFriend);
        console.log("friendsData", friendsData);
        console.log("user정보 가져오기 완료");
        setSearchedUser(newFriend);
      })
      .catch((err) => {
        setStatus("error");
        console.error("❌user정보 가져오기 실패:", err);
        console.error("Server Error:", err.response?.data);
      });
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">친구 추가하기</h1>
          <p className="text-[#B5BAC1]">Discord 사용자명을 사용하여 친구를 추가할 수 있어요.</p>
        </div>
        <div className="hidden md:block">
          <Image
            src="/assets/icons8-bear-48.png"
            alt="Wumpus Detective"
            width={120}
            height={120}
            className="mt-4 md:mt-0"
          />
        </div>
      </header>

      <div className="border-b border-[#3F4147] pb-8">
        <div className="relative">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Discord 사용자명을 사용하여 친구를 추가할 수 있어요."
            className="bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 pr-32"
          />
          <Button
            onClick={clickHandler}
            disabled={!username.trim()}
            className="absolute right-0 top-0 h-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-l-none"
          >
            친구 요청 보내기
          </Button>
        </div>

        {status === "success" && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-md">성공적으로 친구 요청을 보냈습니다!</div>
        )}

        {status === "error" && (
          <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-md">
            친구 요청을 보내는 데 실패했습니다. 사용자명을 확인해주세요.
          </div>
        )}
      </div>

      <div className="mt-8 text-white">
        {searchedUser === null ? (
          ""
        ) : (
          <AddFriendBar name={searchedUser.name} status={"행인1"} id={searchedUser.friendId} />
        )}
      </div>
    </div>
  );
}
EOF
echo "✅ components/add-friend.tsx 수정 완료"

# ── 6. components/dm-chat2.tsx ────────────────────────────────────────────────
cat > components/dm-chat2.tsx << 'EOF'
"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import MessageInput from "@/components/messeage-input";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import Image from "next/image";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

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
      .get(`${API_URL}/dm/${dmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.response || []))
      .catch((err) => console.error("❌ 메시지 불러오기 실패:", err));

    const socket = new SockJS(`${API_URL}/ws-chat?token=${token}`);
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
        `${API_URL}/dm/${dmId}/message/${messageId}`,
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
      await axios.delete(`${API_URL}/dm/${dmId}/message/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ 메시지 삭제 완료");
      setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
    } catch (err) {
      console.error("❌ 메시지 삭제 실패:", err);
      alert("❌ 삭제 실패");
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
                          <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2 group-hover:flex hidden cursor-pointer">
                            <span onClick={() => setEditingMessage({ messageId: msg.messageId, content: msg.content })}>
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
        ))}
      </div>
      <div className="absolute bottom-0 z-20 w-full bg-discord1and4">
        <MessageInput onSend={sendMessage} />
      </div>
    </SectionFour>
  );
}
EOF
echo "✅ components/dm-chat2.tsx 수정 완료"

# ── 7. components/ChannelSubscriber.tsx ───────────────────────────────────────
cat > components/ChannelSubscriber.tsx << 'EOF'
"use client";

import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";
import { API_URL } from "@/lib/config";

interface ChannelSubscriberProps {
  serverId: string;
  token: string;
}

export default function ChannelSubscriber({ serverId, token }: ChannelSubscriberProps) {
  const addChannel = useChannelStore((state) => state.addChannel);
  const channels = useChannelStore((state) => state.channels);
  const setChannels = useChannelStore((state) => state.setChannels);
  console.log("ChannelSubscriber 실행", channels);
  useEffect(() => {
    console.log("ChannelSubscriber useEffect 실행", channels);
    console.log("serverId", serverId);
    console.log("token", token);
    if (!token || !serverId) return;
    const socket = new SockJS(`${API_URL}/ws-chat?token=${token}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(`/topic/server/${serverId}/channels`, (msg) => {
        const data = JSON.parse(msg.body);

        console.log("📩 받은 메시지: ", data.serverId);
        console.log("📩 받은 메시지 data: ", data);
        const { serverId, action, ...rest } = data;
        const filteredData: channel = rest;
        console.log("📩 받은 메시지: serverId =", serverId);
        console.log("📩 action =", action);
        console.log("🧹 serverId 제거 후 객체:", filteredData);
        if (action === "create") {
          console.log("create 합니다");
          console.log("create 전 channel", channels);
          console.log("create 전 channel", channels.length);
          addChannel(filteredData);
        }
        if (action === "update") {
          console.log("update 전 channel", channels);
          console.log(channels.length);
          console.log("update 합니다");
          const updatedChannels = channels.map((channel) =>
            channel.id === data.id ? { ...channel, name: data.name } : channel,
          );
          console.log("update된 채널들", updatedChannels);
          setChannels(updatedChannels);
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [serverId, token, channels, addChannel, setChannels]);

  return null;
}
EOF
echo "✅ components/ChannelSubscriber.tsx 수정 완료"

# ── 8. components/voiceChannel-item.tsx ───────────────────────────────────────
cat > components/voiceChannel-item.tsx << 'EOF'
"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { clsx } from "clsx";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";

export default function VoiceChannelItem({
  name,
  channelId,
  serverId,
}: {
  name: string;
  channelId: string;
  serverId: string;
}) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const {
    connectedChannelId,
    connectToVoice,
    removeParticipant,
    disconnectFromVoice,
    addParticipant,
    channelParticipants,
  } = useVoiceStore();
  const { userId } = useAuth();
  const participants = channelParticipants[channelId] || [];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      <ul
        className={clsx(
          "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer text-[#96989d] hover:text-white hover:bg-[#35373c]",
        )}
        onContextMenu={handleContextMenu}
        onClick={() => {
          if (!userId) return;
          const isAlreadyJoined = connectedChannelId === channelId;

          if (isAlreadyJoined) {
            removeParticipant(channelId, userId);
            disconnectFromVoice();
          } else {
            addParticipant(channelId, userId);
            connectToVoice(channelId);
          }

          console.log("channelId:", channelId);
          console.log("connectedChannelId:", connectedChannelId);
        }}
      >
        <Volume2 className="w-5 h-5 text-[#96989d]" />
        {name}
        {participants.length > 0 && <span className="ml-auto text-xs text-green-400">참여: {participants.length}</span>}
      </ul>

      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          channelId={channelId}
          serverId={serverId}
          channelName={name}
        />
      )}
    </>
  );
}
EOF
echo "✅ components/voiceChannel-item.tsx 수정 완료 (userId 하드코딩 제거)"

# ── 9. components/hooks/use-create-channel.ts ────────────────────────────────
cat > components/hooks/use-create-channel.ts << 'EOF'
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useChannelStore } from "@/components/store/use-channel-store";
import { API_URL } from "@/lib/config";

export const useCreateChannel = () => {
  const channels = useChannelStore((state) => state.channels);
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { channelName: string; type: "CHAT" | "VOICE"; serverId: string }) => {
      const res = await fetch(`${API_URL}/server/${data.serverId}/channel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ channelName: data.channelName, type: data.type }),
      });
      console.log("내가 패치한 곳" + `${API_URL}/server/${data.serverId}/channel`);
      console.log("내가 요청한 바디 " + JSON.stringify({ channelName: data.channelName, type: data.type }));
      console.log("서버 응답", res);
      if (!res.ok) throw new Error("채널 생성 실패");
      return res.json();
    },
    onSuccess: (newChannelData) => {
      console.log("📦 받은 채널:", newChannelData);
      console.log(channels);
    },
  });
};
EOF
echo "✅ components/hooks/use-create-channel.ts 수정 완료"

# ── 10. components/hooks/use-create-server.ts ────────────────────────────────
cat > components/hooks/use-create-server.ts << 'EOF'
// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useServerStore } from "@/components/store/use-server-store";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

export const useCreateServer = () => {
  const addServer = useServerStore((state) => state.addServer);
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { serverName: string; imageUrl?: string | null }) => {
      const res = await fetch(`${API_URL}/server`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("서버 생성 실패");
      return res.json();
    },
    onSuccess: (newServerData) => {
      console.log("새로만든 서버 = ", newServerData);
      addServer(newServerData.response);
    },
  });
};
EOF
echo "✅ components/hooks/use-create-server.ts 수정 완료"

# ── 11. components/hooks/use-delete-channel.ts ───────────────────────────────
cat > components/hooks/use-delete-channel.ts << 'EOF'
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useChannelStore } from "@/components/store/use-channel-store";
import { API_URL } from "@/lib/config";

export const useDeleteChannel = () => {
  const removeChannel = useChannelStore((state) => state.removeChannel);
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ serverId, channelId }: { serverId: string; channelId: string }) => {
      const res = await fetch(`${API_URL}/server/${serverId}/channel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId: channelId }),
      });

      console.log("채널 삭제 요청:", `${API_URL}/server/${serverId}/channel`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "채널 삭제 실패");
      }

      return { channelId };
    },
    onSuccess: (data) => {
      console.log("🗑️ 채널 삭제 성공:", data);
      removeChannel(data.channelId);
    },
    onError: (error) => {
      console.error("채널 삭제 실패:", error);
      alert("채널 삭제에 실패했습니다.");
    },
  });
};
EOF
echo "✅ components/hooks/use-delete-channel.ts 수정 완료"

# ── 12. components/hooks/use-leave-server.tsx ────────────────────────────────
cat > components/hooks/use-leave-server.tsx << 'EOF'
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useServerStore } from "@/components/store/use-server-store";
import { API_URL } from "@/lib/config";

export const useLeaveServer = () => {
  const removeServer = useServerStore((state) => state.removeServer);
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      const res = await fetch(`${API_URL}/server/${serverId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("서버 나가기 요청:", `${API_URL}/server/${serverId}/leave`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "서버 나가기 실패");
      }

      return { serverId };
    },
    onSuccess: (data) => {
      console.log("🗑️ 서버 나가기 성공:", data);
      removeServer(data.serverId);
    },
    onError: (error) => {
      console.error("서버 나가기 실패:", error);
      alert("서버 나가기에 실패했습니다.");
    },
  });
};
EOF
echo "✅ components/hooks/use-leave-server.tsx 수정 완료"

# ── 13. components/hooks/use-update-channel.ts ───────────────────────────────
cat > components/hooks/use-update-channel.ts << 'EOF'
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

export const useUpdateChannel = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      serverId,
      channelId,
      channelname,
    }: {
      serverId: string;
      channelId: string;
      channelname: string;
    }) => {
      const res = await fetch(`${API_URL}/server/${serverId}/channel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId: channelId, channelName: channelname }),
      });

      console.log("채널 업데이트 요청:", `${API_URL}/server/${serverId}/channel`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "채널 업데이트 실패");
      }

      return { channelId, channelname };
    },
    onSuccess: (data) => {
      console.log("🗑️ 채널 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("채널 업데이트 실패:", error);
      alert("채널 업데이트에 실패했습니다.");
    },
  });
};
EOF
echo "✅ components/hooks/use-update-channel.ts 수정 완료"

# ── 14. components/hooks/use-update-server-alarm.ts ─────────────────────────
cat > components/hooks/use-update-server-alarm.ts << 'EOF'
// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

export const useUpdateServerAlarm = () => {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { alarm?: boolean; serverId?: string }) => {
      const res = await fetch(`${API_URL}/server/${data.serverId}/alarm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("서버 업데이트 실패");
      return res.json();
    },
    onSuccess: (newServerData) => {
      console.log("업데이트한 서버 = ", newServerData);
    },
  });
};
EOF
echo "✅ components/hooks/use-update-server-alarm.ts 수정 완료"

# ── 15. components/hooks/use-update-server-info.ts ───────────────────────────
cat > components/hooks/use-update-server-info.ts << 'EOF'
// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

export const useUpdateServerInfo = () => {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { serverName: string; imageUrl?: string | null; serverId: string }) => {
      const res = await fetch(`${API_URL}/server/${data.serverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("서버 업데이트 실패");
      return res.json();
    },
    onSuccess: (newServerData) => {
      console.log("업데이트한 서버 = ", newServerData);
    },
  });
};
EOF
echo "✅ components/hooks/use-update-server-info.ts 수정 완료"

# ── 16. components/hooks/use-ensure-servers.ts ───────────────────────────────
cat > components/hooks/use-ensure-servers.ts << 'EOF'
// components/hooks/use-ensure-servers.ts
"use client";

import { useEffect } from "react";
import { useServerStore } from "@/components/store/use-server-store";
import { API_URL } from "@/lib/config";

export const useEnsureServers = () => {
  const { isFetched, setServers } = useServerStore();

  useEffect(() => {
    console.log("Fetching servers...");
    if (!isFetched) {
      fetch(`${API_URL}/server`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.response)) {
            setServers(data.response);
          } else {
            console.error("response is not an array:", data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch servers:", err);
        });
    }
  }, [isFetched, setServers]);
};
EOF
echo "✅ components/hooks/use-ensure-servers.ts 수정 완료"

# ── 17. components/hooks/use-update-channel-info.ts ─────────────────────────
cat > components/hooks/use-update-channel-info.ts << 'EOF'
// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

export const useUpdateChannelInfo = () => {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { channelName: string; serverId: string }) => {
      const res = await fetch(`${API_URL}/server/${data.serverId}/channel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("채널 업데이트 실패");
      return res.json();
    },
    onSuccess: (newChannelData) => {
      console.log("업데이트한 채널 = ", newChannelData);
    },
  });
};
EOF
echo "✅ components/hooks/use-update-channel-info.ts 수정 완료"

# ── 18. app/channels/layout.tsx ──────────────────────────────────────────────
cat > app/channels/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "../globals.css";
import SideUi from "@/public/ui/sideUi";

import ServerSidebar from "@/components/server-sidebar";

import { ServerHydrator } from "@/components/hydrate/server-hydrator";
import { Profile, server } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyProfileHydrator } from "@/components/hydrate/my-profile-hydrator";
import NotificationSubscribe from "@/lib/NotificationSubscribe";
import { API_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function ChannelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    redirect("/login");
  }
  const serversss = await fetch(`${API_URL}/server`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] servers fetch");
  const profileee = await fetch(`${API_URL}/me`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] profile fetch");
  const serverss = await serversss.json();
  const servers: server[] = await serverss.response;
  const profilee = await profileee.json();
  const profile: Profile = await profilee.response;
  console.log("servers", servers);
  console.log("profile", profile);
  return (
    <>
      <ServerHydrator servers={servers} />
      <MyProfileHydrator myProfile={profile} />
      <NotificationSubscribe myProfile={profile} />
      <div className="bg-discordSidebar w-screen h-screen flex overflow-x-hidden overflow-y-hidden">
        <SideUi>
          <ServerSidebar />
        </SideUi>
        {children}
      </div>
    </>
  );
}
EOF
echo "✅ app/channels/layout.tsx 수정 완료"

# ── 19. app/channels/me/layout.tsx ───────────────────────────────────────────
cat > app/channels/me/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "../../globals.css";
import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import { SectionTwoMain } from "@/public/homeDir/components/sectionTwoMain";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import SectionThreeMain from "@/public/homeDir/components/sectionThree";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import { DmList } from "@/components/type/response";
import { FriendsProvider } from "@/components/context/friends-context";
import { DmHydrator } from "@/components/hydrate/dm-hydrator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MainScreenProvider } from "@/components/context/main-screen-context";
import { API_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function MeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    redirect("/login");
  }
  const dms = await fetch(`${API_URL}/dm`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const dm = await dms.json();
  const dmList: DmList[] = await dm.response;
  console.log(dmList);

  const friendResponse = await fetch(`${API_URL}/friend`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const friendResponseJson = await friendResponse.json();
  const friend = await friendResponseJson.response;
  console.log("friend =", friend);
  return (
    <div className={"flex flex-1"}>
      <SectionTwoAndThree>
        <SectionTwo>
          <SectionTwoMain />
        </SectionTwo>
        <SectionThree>
          <DmHydrator dmList={dmList} />
          <SectionThreeMain />
        </SectionThree>
        <UserProfileBarUi>
          <UserProfileBar
            imageUrl="/assets/discord_blue.png"
            stateIcon="/assets/status-online.svg"
            username="이원빈"
            statusMessage="온라인"
          />
        </UserProfileBarUi>
      </SectionTwoAndThree>
      <SectionOneAndFour>
        <FriendsProvider friendsData={friend}>
          <MainScreenProvider>{children}</MainScreenProvider>
        </FriendsProvider>
      </SectionOneAndFour>
    </div>
  );
}
EOF
echo "✅ app/channels/me/layout.tsx 수정 완료"

# ── 20. app/channels/[serverId]/layout.tsx ───────────────────────────────────
cat > "app/channels/[serverId]/layout.tsx" << 'EOF'
import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import ServerName from "@/components/server-name";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import { ChannelHydrator } from "@/components/hydrate/channel-hydrator";
import ChannelSidebar from "@/components/client/channel-sidebar-client";
import { channel } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChannelSubscriber from "@/components/ChannelSubscriber";
import { API_URL } from "@/lib/config";

export default async function ServerRayout({
  params,
  children,
}: {
  params: { serverId: string };
  children: React.ReactNode;
}) {
  const { serverId } = await params;
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    redirect("/login");
  }
  const channels = await fetch(`${API_URL}/server/${serverId}/channel`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/[serverId]/layout] fetch");
  const channelss = await channels.json();
  console.log("channelss = ", channelss);
  const channelsData: channel[] = await channelss.response;
  console.log("channelsData = ", channelsData);

  return (
    <div className={"flex flex-1 bg-amber-200"}>
      <ChannelHydrator channels={channelsData} />
      <ChannelSubscriber serverId={serverId} token={accessToken} />
      <SectionTwoAndThree>
        <SectionTwo>
          <ServerName />
        </SectionTwo>
        <SectionThree>
          <ChannelSidebar serverId={serverId} />
        </SectionThree>
        <UserProfileBarUi>
          <UserProfileBar
            imageUrl="/assets/discord_blue.png"
            stateIcon="/assets/status-online.svg"
            username="이원빈"
            statusMessage="온라인"
          />
        </UserProfileBarUi>
      </SectionTwoAndThree>
      {children}
    </div>
  );
}
EOF
echo "✅ app/channels/[serverId]/layout.tsx 수정 완료"

# ── 21. .env.local 샘플 생성 (없으면) ────────────────────────────────────────
if [ ! -f .env.local ]; then
  cat > .env.local << 'EOF'
# 백엔드 API URL (로컬 개발용)
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
  echo "✅ .env.local 생성 완료 (로컬 기본값: http://localhost:8080)"
else
  echo "ℹ️  .env.local 이미 존재 — 건너뜀"
  echo "   NEXT_PUBLIC_API_URL=http://localhost:8080 이 있는지 확인하세요"
fi

echo ""
echo "=== 모든 수정 완료 ==="
echo ""
echo "다음 단계:"
echo "  git checkout -b claude/incomplete-project-review-i0gmdi"
echo "  git add -A"
echo "  git commit -m 'fix: replace hardcoded localhost:8080 with API_URL env var, fix voiceChannel userId'"
echo "  git push -u origin claude/incomplete-project-review-i0gmdi"

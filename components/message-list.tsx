"use client";

import { useEffect, useState } from "react";
import { connectStomp } from "@/lib/StompChat";
import axios from "axios";
import { useParams } from "next/navigation";
type messages = {
  dmId: string;
  messageId: string;
  userId: string;
  nickName: string;
  imageUrl: string;
  content: string;
  createdAt: string;
};
export default function MessageList() {
  const [messages, setMessages] = useState<messages[]>([]);
  const params = useParams();
  const dmId = params?.dmId as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !dmId) return;

    // 초기 메시지 로딩
    axios
      .get(`http://localhost:8080/dm/${dmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.response || []));

    // WebSocket 연결
    connectStomp(token, dmId, (type, message) => {
      setMessages((prev) => {
        if (type === "SEND") return [...prev, message];
        if (type === "UPDATE")
          return prev.map((m) => (m.messageId === message.messageId ? { ...m, content: message.content } : m));
        if (type === "DELETE") return prev.filter((m) => m.messageId !== message.messageId);
        return prev;
      });
    });
  }, [dmId]);

  return (
    <ul className="p-4 space-y-3">
      {messages.map((msg) => (
        <li key={msg.messageId} className="text-white">
          <strong>{msg.nickName}</strong>: {msg.content}
        </li>
      ))}
    </ul>
  );
}

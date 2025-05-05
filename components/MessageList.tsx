"use client";

import { useEffect, useState } from "react";
import { connectWebSocket } from "@/lib/socket";
import { useParams } from "next/navigation";

type Message = {
  senderId: number;
  content: string;
  timestamp?: string;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams();
  const dmId = params?.dmId as string;

  useEffect(() => {
    if (!dmId) return;

    connectWebSocket(dmId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [dmId]);

  return (
    <ul className="p-4 space-y-3">
      {messages.map((msg, index) => (
        <li key={index} className="text-white">
          <span className="font-bold mr-2">{msg.senderId}:</span>
          {msg.content}
        </li>
      ))}
    </ul>
  );
}

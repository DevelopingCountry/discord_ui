// lib/stomp.ts
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
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
  const socket = new SockJS(`http://localhost:8080/ws-chat?token=${token}`);

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

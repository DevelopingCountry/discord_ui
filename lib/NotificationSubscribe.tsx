"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import { connectSocket } from "@/lib/socket";
import { useSocketSubscribe } from "@/components/hooks/useSocketSubscribe";
import { useOnlineFriendsStore, OnlineFriend } from "@/components/store/use-online-friends-store";
import { useNotificationInboxStore, NotificationType } from "@/components/store/use-notification-inbox-store";

type NotificationPayload = {
  fromNickname: string;
  fromImageUrl: string;
  message?: string;
  dmId?: string;
  inviteId?: string;
  serverImage?: string;
  serverName?: string;
  serverUrl?: string;
};

export default function NotificationSubscribe() {
  const { accessToken } = useAuth();
  const { addNotification } = useNotificationInboxStore();
  const { addOnlineFriend, removeOnlineFriend } = useOnlineFriendsStore();
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    connectSocket(accessToken);
  }, [accessToken]);

  useSocketSubscribe<{ action: string; payload: NotificationPayload }>(`/user/queue/notifications`, (data) => {
    const type = data.action;
    const payload = data.payload;
    console.log("📩 알림 수신:", type, payload);
    switch (type) {
      case "INVITE":
      case "DM":
      case "FRIEND_REQUEST":
        addNotification({
          id: crypto.randomUUID(),
          type: type as NotificationType,
          payload,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        break;
      case "FRIEND_ONLINE":
        addOnlineFriend(payload as unknown as OnlineFriend);
        break;
      case "FRIEND_OFFLINE":
        removeOnlineFriend((payload as unknown as { friendId: string }).friendId);
        break;
      default:
    }
  });

  return null;
}

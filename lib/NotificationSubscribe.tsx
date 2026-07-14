"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import { connectSocket } from "@/lib/socket";
import { useSocketSubscribe } from "@/components/hooks/useSocketSubscribe";
import { useInviteStore, InvitePayload } from "@/components/store/use-invite-store";
import { useNotificationToastStore } from "@/components/store/use-notification-toast-store";
import { useOnlineFriendsStore, OnlineFriend } from "@/components/store/use-online-friends-store";

type NotificationPayload = {
  fromNickname: string;
  fromImageUrl: string;
  message?: string;
  dmId?: string;
  inviteId?: number;
  serverImage?: string;
  serverName?: string;
  serverUrl?: string;
};

export default function NotificationSubscribe() {
  const { accessToken } = useAuth();
  const { addInvite } = useInviteStore();
  const { addToast } = useNotificationToastStore();
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
        addInvite(payload as InvitePayload);
        break;
      case "DM":
        addToast({
          type: "DM",
          title: `${payload.fromNickname}님의 DM`,
          message: payload.message ?? "",
          imageUrl: payload.fromImageUrl,
          href: payload.dmId ? `/channels/me/${payload.dmId}` : undefined,
        });
        break;
      case "FRIEND_REQUEST":
        addToast({
          type: "FRIEND_REQUEST",
          title: `${payload.fromNickname}님의 친구 요청`,
          message: "친구 요청이 도착했습니다",
          imageUrl: payload.fromImageUrl,
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

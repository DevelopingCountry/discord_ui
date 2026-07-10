"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Profile } from "@/components/type/response";
import { API_URL } from "@/lib/config";
import { useInviteStore, InvitePayload } from "@/components/store/use-invite-store";
import { useNotificationToastStore } from "@/components/store/use-notification-toast-store";

export default function NotificationSubscribe({ myProfile }: { myProfile: Profile }) {
  const { accessToken } = useAuth();
  const { addInvite } = useInviteStore();
  const { addToast } = useNotificationToastStore();
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
        console.log("📩 알림 수신:", type, payload);
        switch (type) {
          case "INVITE":
            addInvite(payload as InvitePayload);
            break;
          case "DM":
            addToast({
              type: "DM",
              title: `${payload.fromNickname}님의 DM`,
              message: payload.message,
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
          default:
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [accessToken, myProfile, addInvite, addToast]);
  return null;
}

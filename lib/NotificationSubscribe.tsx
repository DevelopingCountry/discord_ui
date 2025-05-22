"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Profile } from "@/components/type/response";

export default function NotificationSubscribe({ myProfile }: { myProfile: Profile }) {
  const { accessToken } = useAuth();
  useEffect(() => {
    console.log("NotificationSubscribe useEffect 실행", myProfile);
    console.log("accessToken = ", accessToken);
    if (!accessToken || !myProfile) return;
    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${accessToken}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(`/user/queue/notifications`, (msg) => {
        const data = JSON.parse(msg.body);
        console.log("📩 data 확인:", data);
        const type = data.action;
        const payload = data.payload;
        console.log("📩 DM 알림 구조 확인:", payload.senderName, payload.message);
        console.log("📩 알림 수신:", type, payload);
        switch (type) {
          case "INVITE":
            // 서버초대 알림
            break;

          case "DM":
            // DM 온거 알림
            break;

          case "FRIEND_REQUEST":
            // 친구요청 알림
            break;

          default:
          // 로직 짜야됌
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [myProfile]);
  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

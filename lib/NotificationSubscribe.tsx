"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Profile } from "@/components/type/response";

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
    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${accessToken}`);
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
            // 서버초대 알림
            break;

          case "DM":
            console.log("DM 알림");
            // DM 온거 알림
            break;

          case "FRIEND_REQUEST":
            console.log("친구 요청 알림");
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
  }, [accessToken, myProfile]);
  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

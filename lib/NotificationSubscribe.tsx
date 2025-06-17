"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Profile } from "@/components/type/response";

export default function NotificationSubscribe({ myProfile }: { myProfile: Profile }) {
  const { accessToken } = useAuth();
  useEffect(() => {
    if (Notification.permission === "default" || Notification.permission === "denied") {
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
      console.log("NotificationSubscribe 연결 성공"); //로그인이 되었을 경우
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
            console.log("Notification.permission", Notification.permission);
            if (Notification.permission === "granted") {
              new Notification("서버 초대", {
                tag: `디스코드`,
                body: `${payload.fromNickname}님이 ${payload.serverName}에 초대했어요.`,
                icon: payload.serverImage || "/default-server-icon.png",
              });
            }
            // ✅ 상태 저장도 함께 (예: Zustand 사용 시)
            //addNotificationToStore(data); // 상태에 저장하여 UI에 표시
            // 서버초대 알림
            break;

          case "DM":
            console.log("DM 알림");
            if (Notification.permission === "granted") {
              new Notification("DM 알림", {
                body: `${payload.fromNickname}님이 ${payload.message}이 보냈습니다.`,
                icon: payload.fromImageUrl || "/default-server-icon.png",
              });
            }
            // DM 온거 알림
            break;

          case "FRIEND_REQUEST":
            console.log("친구 요청 알림");
            if (Notification.permission === "granted") {
              new Notification("친구 요청 알림", {
                body: `${payload.fromNickname}님이 친구요청을 보냈습니다.`,
                icon: payload.fromImageUrl || "/default-server-icon.png",
              });
            }
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

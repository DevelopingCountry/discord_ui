"use client";

import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";

interface ChannelSubscriberProps {
  serverId: string;
  token: string;
}

export default function ChannelSubscriber({ serverId, token }: ChannelSubscriberProps) {
  const addChannel = useChannelStore((state) => state.addChannel);
  // useEffect(() => {
  //   setChannels(channels);
  // }, [channels, setChannels]);
  useEffect(() => {
    console.log("serverId", serverId);
    console.log("token", token);
    if (!token || !serverId) return;
    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${token}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(`/topic/server/${serverId}/channels`, (msg) => {
        const data = JSON.parse(msg.body);

        console.log("📩 받은 메시지: ", data.serverId); // 🔍 확인용 로그 추가
        // const { serverId, ...filteredData }: { serverId: number; filterData: channel } = data;
        const { serverId, ...rest } = data;
        const filteredData: channel = rest; // 타입 명시
        console.log("📩 받은 메시지: serverId =", serverId);
        console.log("🧹 serverId 제거 후 객체:", filteredData);
        // const { serverId, ...filteredData } = data;
        //
        // console.log("🧹 serverId 제거 후: ", filteredData);
        addChannel(filteredData);
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [serverId, token, addChannel]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

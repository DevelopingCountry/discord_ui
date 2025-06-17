"use client";

import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";
import { usePathname, useRouter } from "next/navigation";

interface ChannelSubscriberProps {
  serverId: string;
  token: string;
}

export default function ChannelSubscriber({ serverId, token }: ChannelSubscriberProps) {
  const addChannel = useChannelStore((state) => state.addChannel);
  // const setChannel = useChannelStore((state) => state.setChannels);
  // const channels = useChannelStore((state) => state.channels);
  const channels = useChannelStore((state) => state.channels);
  const setChannels = useChannelStore((state) => state.setChannels);
  const route = useRouter();
  const pathname = usePathname();
  // useEffect(() => {
  //   setChannels(channels);
  // }, [channels, setChannels]);
  console.log("ChannelSubscriber 실행", channels);
  useEffect(() => {
    console.log("ChannelSubscriber useEffect 실행", channels);
    console.log("serverId", serverId);
    console.log("token", token);
    if (!token || !serverId) return;
    const socket = new SockJS(`http://localhost:8080/ws-chat?token=${token}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(`/topic/server/${serverId}/channels`, (msg) => {
        const data = JSON.parse(msg.body);

        console.log("📩 받은 메시지: ", data.serverId); // 🔍 확인용 로그 추가
        console.log("📩 받은 메시지 data: ", data); // 🔍 확인용 로그 추가
        // const { serverId, ...filteredData }: { serverId: number; filterData: channel } = data;
        const { serverId, action, ...rest } = data;
        const filteredData: channel = rest; // 타입 명시
        console.log("📩 받은 메시지: serverId =", serverId);
        console.log("📩 action =", action);
        console.log("🧹 serverId 제거 후 객체:", filteredData);
        // const { serverId, ...filteredData } = data;
        //
        // console.log("🧹 serverId 제거 후: ", filteredData);
        /*
        만약 받은 데이터의 action이 update면 update
        create면 addChannel
         */
        // console.log("action이 들어왔을 때 channels", channels);
        if (action === "create") {
          console.log("create 합니다");
          console.log("create 전 channel", channels);
          console.log("create 전 channel", channels.length);
          addChannel(filteredData);
        }
        if (action === "update") {
          console.log("update 전 channel", channels);
          console.log(channels.length);
          console.log("update 합니다");
          const updatedChannels = channels.map((channel) =>
            channel.id === data.id ? { ...channel, name: data.name } : channel,
          );
          console.log("update된 채널들", updatedChannels);
          setChannels(updatedChannels); // 상태 업데이트
        }
        if (action === "delete") {
          console.log("delete 전 channel", channels);
          console.log("총 채널 수:", channels.length);
          console.log("delete 합니다");

          const updatedChannels = channels.filter((channel) => channel.id !== data.id);

          console.log("delete 후 채널들", updatedChannels);
          setChannels(updatedChannels); // 상태 업데이트
          const currentChannelId = pathname.split("/")[4];
          console.log("현재 채널 ID:", currentChannelId);
          if (filteredData.id === currentChannelId) {
            route.push(`/channels/${serverId}`);
            console.log("이 채널은 삭제되었어요.");
          }
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [serverId, token, channels, addChannel, setChannels]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

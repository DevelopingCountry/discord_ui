"use client";

import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";
import { API_URL } from "@/lib/config";

interface ChannelSubscriberProps {
  serverId: string;
  token: string;
}

export default function ChannelSubscriber({ serverId, token }: ChannelSubscriberProps) {
  const addChannel = useChannelStore((state) => state.addChannel);
  const channels = useChannelStore((state) => state.channels);
  const setChannels = useChannelStore((state) => state.setChannels);
  console.log("ChannelSubscriber 실행", channels);
  useEffect(() => {
    console.log("ChannelSubscriber useEffect 실행", channels);
    console.log("serverId", serverId);
    console.log("token", token);
    if (!token || !serverId) return;
    const socket = new SockJS(`${API_URL}/ws-chat?token=${token}`);
    const stomp = Stomp.over(socket);
    stomp.connect({}, () => {
      stomp.subscribe(`/topic/server/${serverId}/channels`, (msg) => {
        const data = JSON.parse(msg.body);

        console.log("📩 받은 메시지: ", data.serverId);
        console.log("📩 받은 메시지 data: ", data);
        const { serverId, action, ...rest } = data;
        const filteredData: channel = rest;
        console.log("📩 받은 메시지: serverId =", serverId);
        console.log("📩 action =", action);
        console.log("🧹 serverId 제거 후 객체:", filteredData);
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
          setChannels(updatedChannels);
        }
      });
    });
    stomp.activate();

    return () => {
      stomp.deactivate();
    };
  }, [serverId, token, channels, addChannel, setChannels]);

  return null;
}

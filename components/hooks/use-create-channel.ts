"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useChannelStore } from "@/components/store/use-channel-store";

export const useCreateChannel = () => {
  const channels = useChannelStore((state) => state.channels);
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { channelName: string; type: "CHAT" | "VOICE"; serverId: string }) => {
      const res = await fetch(`http://localhost:8080/server/${data.serverId}/channel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ channelName: data.channelName, type: data.type }),
      });
      console.log("내가 패치한 곳" + `http://localhost:8080/server/${data.serverId}/channel`);
      console.log("내가 요청한 바디 " + JSON.stringify({ channelName: data.channelName, type: data.type }));
      console.log("서버 응답", res);
      if (!res.ok) throw new Error("채널 생성 실패");
      return res.json();
    },
    onSuccess: (newChannelData) => {
      console.log("📦 받은 채널:", newChannelData);
      // addChannel(newChannelData.response);

      // 서버 응답에 맞춰서!
      console.log(channels);
    },
  });
};

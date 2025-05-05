"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useChannelStore } from "@/components/store/use-channel-store";

export const useUpdateChannel = () => {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      serverId,
      channelId,
      channelname,
    }: {
      serverId: string;
      channelId: string;
      channelname: string;
    }) => {
      const res = await fetch(`http://localhost:8080/server/${serverId}/channel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId: channelId, channelName: channelname }),
      });

      console.log("채널 업데이트 요청:", `http://localhost:8080/server/${serverId}/channel`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "채널 업데이트 실패");
      }

      return { channelId, channelname };
    },
    onSuccess: (data) => {
      console.log("🗑️ 채널 업데이트 성공:", data);
      // 기존 채널 목록을 가져오고, 해당 채널 업데이트
      const { channels, setChannels } = useChannelStore.getState();

      const updatedChannels = channels.map((channel) =>
        channel.id === data.channelId ? { ...channel, name: data.channelname } : channel,
      );

      setChannels(updatedChannels); // 상태 업데이트
    },
    onError: (error) => {
      console.error("채널 업데이트 실패:", error);
      alert("채널 업데이트에 실패했습니다.");
    },
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";

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
      const res = await fetch(`${API_URL}/server/${serverId}/channel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId: channelId, channelName: channelname }),
      });

      console.log("채널 업데이트 요청:", `${API_URL}/server/${serverId}/channel`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "채널 업데이트 실패");
      }

      return { channelId, channelname };
    },
    onSuccess: (data) => {
      console.log("🗑️ 채널 업데이트 성공:", data);
    },
    onError: (error) => {
      console.error("채널 업데이트 실패:", error);
      alert("채널 업데이트에 실패했습니다.");
    },
  });
};

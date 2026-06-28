"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useChannelStore } from "@/components/store/use-channel-store";
import { API_URL } from "@/lib/config";

export const useDeleteChannel = () => {
  const removeChannel = useChannelStore((state) => state.removeChannel);
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ serverId, channelId }: { serverId: string; channelId: string }) => {
      const res = await fetch(`${API_URL}/server/${serverId}/channel`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ channelId: channelId }),
      });

      console.log("채널 삭제 요청:", `${API_URL}/server/${serverId}/channel`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "채널 삭제 실패");
      }

      return { channelId };
    },
    onSuccess: (data) => {
      console.log("🗑️ 채널 삭제 성공:", data);
      removeChannel(data.channelId);
    },
    onError: (error) => {
      console.error("채널 삭제 실패:", error);
      alert("채널 삭제에 실패했습니다.");
    },
  });
};

// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
// private Long channelId;
// private String channelName;
export const useUpdateChannelInfo = () => {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { channelName: string; serverId: string }) => {
      const res = await fetch(`http://localhost:8080/server/${data.serverId}/channel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("채널 업데이트 실패");
      return res.json();
    },
    onSuccess: (newChannelData) => {
      console.log("업데이트한 채널 = ", newChannelData);
    },
  });
};

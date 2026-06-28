"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useServerStore } from "@/components/store/use-server-store";
import { API_URL } from "@/lib/config";

export const useLeaveServer = () => {
  const removeServer = useServerStore((state) => state.removeServer);
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      const res = await fetch(`${API_URL}/server/${serverId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("서버 나가기 요청:", `${API_URL}/server/${serverId}/leave`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "서버 나가기 실패");
      }

      return { serverId };
    },
    onSuccess: (data) => {
      console.log("🗑️ 서버 나가기 성공:", data);
      removeServer(data.serverId);
    },
    onError: (error) => {
      console.error("서버 나가기 실패:", error);
      alert("서버 나가기에 실패했습니다.");
    },
  });
};

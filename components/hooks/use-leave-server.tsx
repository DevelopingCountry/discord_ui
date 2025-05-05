"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { useServerStore } from "@/components/store/use-server-store";

export const useLeaveServer = () => {
  const removeServer = useServerStore((state) => state.removeServer);
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: async ({ serverId }: { serverId: string }) => {
      const res = await fetch(`http://localhost:8080/server/${serverId}/leave`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("서버 나가기 요청:", `http://localhost:8080/server/${serverId}/leave`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "서버 나가기 실패");
      }

      return { serverId };
    },
    onSuccess: (data) => {
      console.log("🗑️ 서버 나가기 성공:", data);
      // 스토어에서 채널 제거
      removeServer(data.serverId);
    },
    onError: (error) => {
      console.error("서버 나가기 실패:", error);
      alert("서버 나가기에 실패했습니다.");
    },
  });
};

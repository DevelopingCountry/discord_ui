// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useServerStore } from "@/components/store/use-server-store";
import { useAuth } from "@/components/context/AuthContext";

export const useCreateServer = () => {
  const addServer = useServerStore((state) => state.addServer);
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { serverName: string; imageUrl?: string | null }) => {
      const res = await fetch("http://localhost:8080/server", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("서버 생성 실패");
      return res.json();
    },
    onSuccess: (newServerData) => {
      console.log("새로만든 서버 = ", newServerData);
      addServer(newServerData.response); // 서버 응답에 맞춰서!
    },
  });
};

// hooks/useCreateServer.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";

export const useUpdateServerAlarm = () => {
  const { accessToken } = useAuth();
  return useMutation({
    mutationFn: async (data: { alarm?: boolean; serverId?: string }) => {
      const res = await fetch(`http://localhost:8080/server/${data.serverId}/alarm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("서버 업데이트 실패");
      return res.json();
    },
    onSuccess: (newServerData) => {
      console.log("업데이트한 서버 = ", newServerData);
    },
  });
};

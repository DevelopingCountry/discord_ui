"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { API_URL } from "@/lib/config";
import { useInviteStore } from "@/components/store/use-invite-store";
import { useServerStore } from "@/components/store/use-server-store";
import { useNotificationToastStore } from "@/components/store/use-notification-toast-store";

const TOAST_DURATION_MS = 6000;

export default function NotificationToastHost() {
  const { accessToken } = useAuth();
  const router = useRouter();
  const { invites, removeInvite } = useInviteStore();
  const { setServers } = useServerStore();
  const { toasts, removeToast } = useNotificationToastStore();

  useEffect(() => {
    const timers = toasts.map((toast) => setTimeout(() => removeToast(toast.key), TOAST_DURATION_MS));
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  const handleAccept = async (inviteId: number, key: number) => {
    try {
      await axios.post(`${API_URL}/server/${inviteId}/accept`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const res = await fetch(`${API_URL}/server`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setServers(data.response ?? []);
    } catch (e) {
      console.error("초대 수락 실패:", e);
    } finally {
      removeInvite(key);
    }
  };

  if (invites.length === 0 && toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {invites.map((invite) => (
        <div key={invite.key} className="bg-[#232428] text-white rounded-lg shadow-lg p-3 flex gap-3 items-start">
          {invite.serverImage ? (
            <Image
              src={invite.serverImage}
              alt={invite.serverName}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0 font-bold">
              {invite.serverName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{invite.fromNickname}님의 서버 초대</p>
            <p className="text-xs text-[#b5bac1] truncate">{invite.serverName}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleAccept(invite.inviteId, invite.key)}
                className="text-xs px-2 py-1 rounded bg-[#5865f2] hover:bg-[#4752c4]"
              >
                수락하기
              </button>
              <button
                onClick={() => removeInvite(invite.key)}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      ))}

      {toasts.map((toast) => (
        <div
          key={toast.key}
          onClick={() => {
            if (toast.href) router.push(toast.href);
            removeToast(toast.key);
          }}
          className="bg-[#232428] text-white rounded-lg shadow-lg p-3 flex gap-3 items-start cursor-pointer hover:bg-[#2b2d31]"
        >
          {toast.imageUrl ? (
            <Image
              src={toast.imageUrl}
              alt={toast.title}
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0 font-bold text-sm">
              {toast.title.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{toast.title}</p>
            <p className="text-xs text-[#b5bac1] truncate">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

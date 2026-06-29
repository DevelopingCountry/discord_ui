"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { clsx } from "clsx";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";
import { useWebRTC } from "@/components/hooks/useWebRTC";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/components/store/use-profile";
import Image from "next/image";

export default function VoiceChannelItem({
  name,
  channelId,
  serverId,
  creatorId,
}: {
  name: string;
  channelId: string;
  serverId: string;
  creatorId: string;
}) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { connectedChannelId, remoteParticipantIds } = useVoiceStore();
  const { userId, accessToken } = useAuth();
  const { connect } = useWebRTC();
  const router = useRouter();
  const { profile } = useProfileStore();

  const isConnected = connectedChannelId === channelId;
  const participants = isConnected ? [userId, ...remoteParticipantIds].filter(Boolean) : [];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleClick = async () => {
    if (!userId || !accessToken) return;
    router.push(`/channels/${serverId}/${channelId}`);
    if (!isConnected) {
      await connect(channelId, userId, accessToken);
    }
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
        <div
          className={clsx(
            "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer hover:bg-[#35373c]",
            isConnected ? "text-green-400" : "text-[#96989d] hover:text-white",
          )}
          onClick={handleClick}
        >
          <Volume2 className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 truncate">{name}</span>
        </div>

        {/* 참여자 목록 */}
        {participants.length > 0 && (
          <ul className="ml-6 mt-0.5 mb-1 flex flex-col gap-0.5">
            {participants.map((uid) => {
              const isMe = uid === userId;
              const label = isMe ? (profile?.nickname ?? "나") : (uid ?? "?");
              const imgSrc = isMe ? (profile?.imageUrl ?? null) : null;

              return (
                <li key={uid} className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-green-400">
                  {imgSrc ? (
                    <Image src={imgSrc} alt={label} width={20} height={20} className="rounded-full flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                      {label[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span className="truncate">{label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          channelId={channelId}
          serverId={serverId}
          channelName={name}
          creatorId={creatorId}
        />
      )}
    </>
  );
}

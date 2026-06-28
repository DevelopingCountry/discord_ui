"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { clsx } from "clsx";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";

export default function VoiceChannelItem({
  name,
  channelId,
  serverId,
}: {
  name: string;
  channelId: string;
  serverId: string;
}) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const {
    connectedChannelId,
    connectToVoice,
    removeParticipant,
    disconnectFromVoice,
    addParticipant,
    channelParticipants,
  } = useVoiceStore();
  const { userId } = useAuth();
  const participants = channelParticipants[channelId] || [];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <>
      <ul
        className={clsx(
          "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer text-[#96989d] hover:text-white hover:bg-[#35373c]",
        )}
        onContextMenu={handleContextMenu}
        onClick={() => {
          if (!userId) return;
          const isAlreadyJoined = connectedChannelId === channelId;

          if (isAlreadyJoined) {
            removeParticipant(channelId, userId);
            disconnectFromVoice();
          } else {
            addParticipant(channelId, userId);
            connectToVoice(channelId);
          }

          console.log("channelId:", channelId);
          console.log("connectedChannelId:", connectedChannelId);
        }}
      >
        <Volume2 className="w-5 h-5 text-[#96989d]" />
        {name}
        {participants.length > 0 && <span className="ml-auto text-xs text-green-400">참여: {participants.length}</span>}
      </ul>

      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          channelId={channelId}
          serverId={serverId}
          channelName={name}
        />
      )}
    </>
  );
}

"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { clsx } from "clsx";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";

interface VoiceChannelItemProps {
  channel: {
    id: string;
    name: string;
    type: string;
    creatorId: string;
  };
  serverId: string;
  onChannelClick: (channelId: string) => void;
}

export default function VoiceChannelItem({ channel, serverId, onChannelClick }: VoiceChannelItemProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { connectedChannelId, channelParticipants } = useVoiceStore();

  const { userId } = useAuth();
  const participants = channelParticipants[channel.id] || [];
  const isConnected = connectedChannelId === channel.id;
  const isUserInChannel = participants.includes(userId || "");

  // 컨텍스트 메뉴 핸들러
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleClick = () => {
    console.log("🎤 음성 채널 클릭:", channel.name, channel.id);
    onChannelClick(channel.id);
  };

  return (
    <>
      <li
        className={clsx(
          "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer",
          isConnected && isUserInChannel
            ? "text-white bg-[#35373c] ring-2 ring-green-500"
            : "text-[#96989d] hover:text-white hover:bg-[#35373c]",
        )}
        onContextMenu={handleContextMenu}
        onClick={handleClick}
      >
        <Volume2 className={`w-5 h-5 ${isConnected && isUserInChannel ? "text-green-500" : "text-[#96989d]"}`} />
        {channel.name}
        {participants.length > 0 && <span className="ml-auto text-xs text-green-400">{participants.length}명</span>}
      </li>

      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          channelId={channel.id}
          serverId={serverId}
          channelName={channel.name}
          creatorId={channel.creatorId}
        />
      )}
    </>
  );
}

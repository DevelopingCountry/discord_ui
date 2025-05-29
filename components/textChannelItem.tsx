"use client";

import { Hash } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { usePathname } from "next/navigation";

interface TextChannelItemProps {
  channel: {
    id: string;
    name: string;
    type: string;
    creatorId: string;
  };
  serverId: string;
  onChannelClick: (channelId: string) => void;
}

export function TextChannelItem({ channel, serverId, onChannelClick }: TextChannelItemProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const pathname = usePathname();
  const currentChannelId = pathname.split("/");

  let isActive = false;
  if (currentChannelId.length > 3) {
    isActive = currentChannelId[3] === channel.id;
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleClick = () => {
    console.log("📝 텍스트 채널 클릭:", channel.name, channel.id);
    onChannelClick(channel.id);
  };

  return (
    <>
      <li
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer ${
          isActive ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <Hash className="w-5 h-5 text-[#96989d]" />
        {channel.name}
      </li>

      {contextMenu && (
        <ChannelContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          channelId={channel.id}
          serverId={serverId}
          channelName={channel.name}
        />
      )}
    </>
  );
}

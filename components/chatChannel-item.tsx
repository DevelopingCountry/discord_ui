"use client";
import { Hash } from "lucide-react";
import { useState } from "react";
import { ChannelContextMenu } from "@/components/ui/channel-context-menu";
import { usePathname, useRouter } from "next/navigation";

export default function ChatChannelItem({
  name,
  channelId,
  serverId,
}: {
  name: string;
  channelId: string;
  serverId: string;
}) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const s = usePathname();
  const currentChannelId = s.split("/");
  let isActive = false;
  if (currentChannelId.length > 3) {
    isActive = currentChannelId[3] === channelId;
  }
  // const isActive = currentChannelId === channelId;
  const router = useRouter();

  const handleChannelClick = () => {
    router.push(`/channels/${serverId}/${channelId}`);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // const handleHashClick = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // 부모 요소의 클릭 이벤트가 발생하지 않도록 함
  //   console.log("해시 클릭됨");
  //   setIsCreateChannelModalOpen(true);
  // };
  //
  // const handleCreateChannel = (data: { name: string; type: "text" | "voice"; isPrivate: boolean }) => {
  //   console.log("새 채널 생성:", data);
  //   // 여기에 채널 생성 로직 추가
  // };
  return (
    <>
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm ${
          isActive ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"
        }`}
        onClick={handleChannelClick}
        onContextMenu={handleContextMenu}
      >
        <Hash className="w-5 h-5 text-[#96989d]" />
        {name}
      </div>

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

"use client";

import { PhoneOff, Wifi } from "lucide-react";
import { useVoiceStore } from "@/components/voice/voiceStore";
import { useWebRTC } from "@/components/voice/useWebRTC";
import { useChannelsQuery } from "@/components/channel/use-channels-query";
import { useServersQuery } from "@/components/server/use-servers-query";
import { usePathname } from "next/navigation";

export function VoicePanel() {
  const { connectedChannelId } = useVoiceStore();
  const { disconnect } = useWebRTC();
  const pathname = usePathname();
  const pathServerId = pathname.split("/")[2];
  // "/channels/me" 아래에서는 [2]가 실제 serverId가 아니라 "me" 리터럴이라 채널 조회를 쏘면 안 됨
  const serverId = pathServerId === "me" ? undefined : pathServerId;
  const { data: channels = [] } = useChannelsQuery(serverId);
  const { data: servers = [] } = useServersQuery();

  if (!connectedChannelId) return null;

  const channel = channels.find((c) => c.id === connectedChannelId);
  const server = servers.find((s) => s.id === serverId);

  return (
    <div className="bg-[#232428] border-t border-[#1e1f22] px-3 py-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Wifi className="w-4 h-4 text-green-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-green-400">음성 연결됨</div>
            <div className="text-xs text-[#96989d] truncate">
              {channel?.name ?? "음성 채널"} / {server?.name ?? "서버"}
            </div>
          </div>
        </div>
        <button
          onClick={disconnect}
          title="통화 끊기"
          className="flex-shrink-0 p-1.5 rounded text-[#96989d] hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

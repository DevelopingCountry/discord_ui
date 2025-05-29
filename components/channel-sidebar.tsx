// components/channel-sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { CreateChannelModal } from "@/components/modal/channel/create-channel-modal";
import { useChannelStore } from "@/components/store/use-channel-store";

import { useRouter } from "next/navigation";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";
import { TextChannelItem } from "./textChannelItem";
import VoiceChannelItem from "./voiceChannelItem";

export default function ChannelSidebar({ serverId }: { serverId: string }) {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(true);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [createChannelType, setCreateChannelType] = useState<"CHAT" | "VOICE">("CHAT");

  const { channels } = useChannelStore();
  const router = useRouter();
  const { userId } = useAuth();
  const {
    connectedChannelId,
    connectToVoice,
    removeParticipant,
    disconnectFromVoice,
    addParticipant,
    channelParticipants,
  } = useVoiceStore();

  console.log("=== ChannelSidebar Debug ===");
  console.log("serverId:", serverId);
  console.log("channels:", channels);
  console.log("userId:", userId);

  // 텍스트 채널과 음성 채널 분리
  const textChannels = channels.filter((channel) => channel.type === "CHAT" || channel.type === "text");
  const voiceChannels = channels.filter((channel) => channel.type === "VOICE" || channel.type === "voice");

  const handleHashClick = (e: React.MouseEvent, type: "CHAT" | "VOICE") => {
    e.stopPropagation();
    setCreateChannelType(type);
    setIsCreateChannelModalOpen(true);
  };

  // 텍스트 채널 클릭 핸들러
  const handleTextChannelClick = (channelId: string) => {
    console.log("Text channel clicked:", channelId);
    router.push(`/channels/${serverId}/${channelId}`);
  };

  // 음성 채널 클릭 핸들러
  const handleVoiceChannelClick = (channelId: string) => {
    console.log("Voice channel clicked:", channelId);
    if (!userId) {
      console.log("❌ No userId");
      return;
    }

    const participants = channelParticipants[channelId] || [];
    const isUserInChannel = participants.includes(userId);
    const isConnected = connectedChannelId === channelId;

    console.log("isUserInChannel:", isUserInChannel);
    console.log("isConnected:", isConnected);

    if (isUserInChannel || isConnected) {
      // 현재 채널에 참여 중이면 나가기
      removeParticipant(channelId, userId);
      if (isConnected) {
        disconnectFromVoice();
      }
    } else {
      // 참여하지 않은 채널이면 들어가기
      addParticipant(channelId, userId);
      connectToVoice(channelId);
    }

    // 음성 채널 참여 후 메인 페이지로 이동
    router.push(`/channels/${serverId}`);
  };

  return (
    <div className="flex flex-col w-60 bg-[#2b2d31]">
      <div className="flex-1 overflow-y-auto p-2">
        {/* 텍스트 채널 섹션 */}
        <Collapsible open={isTextOpen} onOpenChange={setIsTextOpen} className="mb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
              <div className="flex items-center">
                <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isTextOpen ? "" : "-rotate-90"}`} />
                <span className="text-xs font-semibold text-[#96989d] hover:text-white">TEXT CHANNELS</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 rounded-sm"
                onClick={(e) => handleHashClick(e, "CHAT")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-0.5">
              {textChannels.map((channel) => (
                <TextChannelItem
                  key={channel.id}
                  channel={channel}
                  serverId={serverId}
                  onChannelClick={handleTextChannelClick}
                />
              ))}
            </ul>
            {textChannels.length === 0 && <div className="px-2 py-1 text-xs text-gray-500">텍스트 채널이 없습니다</div>}
          </CollapsibleContent>
        </Collapsible>

        {/* 음성 채널 섹션 */}
        <Collapsible open={isVoiceOpen} onOpenChange={setIsVoiceOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
              <div className="flex items-center">
                <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isVoiceOpen ? "" : "-rotate-90"}`} />
                <span className="text-xs font-semibold text-[#96989d] hover:text-white">VOICE CHANNELS</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 rounded-sm"
                onClick={(e) => handleHashClick(e, "VOICE")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-0.5">
              {voiceChannels.map((channel) => (
                <VoiceChannelItem
                  key={channel.id}
                  channel={channel}
                  serverId={serverId}
                  onChannelClick={handleVoiceChannelClick}
                />
              ))}
            </ul>
            {voiceChannels.length === 0 && <div className="px-2 py-1 text-xs text-gray-500">음성 채널이 없습니다</div>}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        serverId={serverId}
        defaultType={createChannelType}
      />
    </div>
  );
}

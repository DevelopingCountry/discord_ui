"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import VoiceChannelItem from "@/components/voiceChannel-item";
import ChatChannelItem from "@/components/chatChannel-item";
import { CreateChannelModal } from "@/components/modal/create-channel-modal";

export default function ChannelSidebar({
  channelsData,
  serverId,
}: {
  channelsData: { id: number; name: string; type: string }[];
  serverId: string;
}) {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(true);
  console.log("serverId == " + serverId);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [createChannelType, setCreateChannelType] = useState<"text" | "voice">("text");
  const handleHashClick = (e: React.MouseEvent, type: "text" | "voice") => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트가 발생하지 않도록 함
    console.log("해시 클릭됨");
    setCreateChannelType(type);
    setIsCreateChannelModalOpen(true);
  };
  const handleCreateChannel = (data: { name: string; type: "text" | "voice"; isPrivate: boolean }) => {
    console.log("새 채널 생성:", data);
    // 여기에 채널 생성 로직 추가
  };
  return (
    <div className="flex flex-col w-60 bg-[#2b2d31]">
      <div className="flex-1 overflow-y-auto p-2">
        <Collapsible open={isTextOpen} onOpenChange={setIsTextOpen} className="mb-2">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
              <div className="flex items-center">
                <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isTextOpen ? "" : "-rotate-90"}`} />
                TEXT CHANNELS
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 rounded-sm"
                onClick={(e) => handleHashClick(e, "text")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul>
              {channelsData
                .filter((channel: { id: number; name: string; type: string }) => channel.type === "text")
                .map((channel: { id: number; name: string; type: string }) => (
                  <li key={channel.id}>
                    <ChatChannelItem name={channel.name} channelId={channel.id} serverId={serverId} />
                  </li>
                ))}
            </ul>
            {/*{channelsData*/}
            {/*  .filter((channel: { id: number; name: string; type: string }) => channel.type === "text")*/}
            {/*  .map((channel: { id: number; name: string; type: string }) => (*/}
            {/*    <ChatChannelItem name={channel.name} channelId={channel.id} serverId={serverId} />*/}
            {/*  ))}*/}
            {/*<ChatChannelItem name="general" active />*/}
            {/*<ChatChannelItem name="help" />*/}
            {/*<ChatChannelItem name="announcements" />*/}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isVoiceOpen} onOpenChange={setIsVoiceOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
              <div className="flex items-center">
                <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isVoiceOpen ? "" : "-rotate-90"}`} />
                VOICE CHANNELS
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 rounded-sm"
                onClick={(e) => handleHashClick(e, "voice")}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {channelsData
              .filter((channel: { id: number; name: string; type: string }) => channel.type === "voice")
              .map((channel: { id: number; name: string; type: string }) => (
                <VoiceChannelItem name={channel.name} channelId={channel.id} serverId={serverId} key={channel.id} />
              ))}
            {/*<VoiceChannelItem name="General" />*/}
            {/*<VoiceChannelItem name="Gaming" />*/}
            {/*<VoiceChannelItem name="Music" />*/}
          </CollapsibleContent>
        </Collapsible>
      </div>
      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        serverId={serverId}
        onCreateChannel={handleCreateChannel}
        defaultType={createChannelType}
      />
    </div>
  );
}
//
// function ChannelItem({ name, active = false }: { name: string; active?: boolean }) {
//   return (
//     <div
//       className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm ${
//         active ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"
//       }`}
//       onClick={() => {}}
//     >
//       <Hash className="w-5 h-5 text-[#96989d]" />
//       {name}
//     </div>
//   );
// }

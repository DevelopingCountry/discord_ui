// components/channel-header.tsx
"use client";

import { Bell, Hash, Search, Users, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChannelContext } from "@/components/context/channel-context";
import { useChannelStore } from "@/components/store/use-channel-store";

export default function ChannelHeader() {
  const channelId = useChannelContext()?.channelId;
  const { channels } = useChannelStore();
  const currentChannel = channels.find((channel) => channel.id === channelId);
  const isVoiceChannel = currentChannel?.type === "VOICE" || currentChannel?.type === "voice";

  return (
    <>
      <div className="flex items-center h-12 px-2 border-b border-[#1e1f22] shadow-sm">
        {isVoiceChannel ? (
          <Volume2 className="w-5 h-5 mr-2 text-[#96989d]" />
        ) : (
          <Hash className="w-5 h-5 mr-2 text-[#96989d]" />
        )}
        <h3 className="font-bold text-white">{currentChannel?.name || "채널 이름 없음"}</h3>
        {isVoiceChannel && <span className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded">음성 채널</span>}
      </div>
      <div className="p-3 flex flex-shrink-0 absolute right-1 z-10">
        <div className={"text-[#b5bac1] pr-2 flex-shrink-0 bg-discord1and4 "}>
          <Button variant="ghost" size="icon" className="h-8 w-8 ">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 ">
            <Users className="w-5 h-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#96989d]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#1e1f22] text-sm rounded-md py-1.5 pl-9 pr-3 text-[#dcddde] placeholder:text-[#96989d] focus:outline-none"
          />
        </div>
      </div>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Hash, Headphones, Mic, Plus, Settings, Volume2 } from "lucide-react";
import { useState } from "react";

export default function ChannelSidebar() {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isVoiceOpen, setIsVoiceOpen] = useState(true);

  return (
    <div className="flex flex-col w-60 bg-[#2b2d31]">
      <div className="flex items-center justify-between p-4 h-12 border-b border-[#1e1f22] shadow-sm">
        <h2 className="font-bold truncate">Discord Clone</h2>
        <ChevronDown className="w-4 h-4" />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <Collapsible open={isTextOpen} onOpenChange={setIsTextOpen} className="mb-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
            <div className="flex items-center">
              <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isTextOpen ? "" : "-rotate-90"}`} />
              TEXT CHANNELS
            </div>
            <Button variant="ghost" size="icon" className="w-4 h-4 rounded-sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ChannelItem name="general" active />
            <ChannelItem name="help" />
            <ChannelItem name="announcements" />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isVoiceOpen} onOpenChange={setIsVoiceOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-1 text-xs font-semibold text-[#96989d] hover:text-white">
            <div className="flex items-center">
              <ChevronDown className={`w-3 h-3 mr-0.5 transition-transform ${isVoiceOpen ? "" : "-rotate-90"}`} />
              VOICE CHANNELS
            </div>
            <Button variant="ghost" size="icon" className="w-4 h-4 rounded-sm">
              <Plus className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <VoiceChannelItem name="General" />
            <VoiceChannelItem name="Gaming" />
            <VoiceChannelItem name="Music" />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="p-2 bg-[#232428] mt-auto">
        <div className="flex items-center gap-2 p-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5865f2]">U</div>
          <div className="flex-1 text-sm">
            <div className="font-semibold">Username</div>
            <div className="text-xs text-[#96989d]">#1234</div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md">
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md">
              <Headphones className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelItem({ name, active = false }: { name: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded text-sm ${
        active ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"
      }`}
    >
      <Hash className="w-5 h-5 text-[#96989d]" />
      {name}
    </div>
  );
}

function VoiceChannelItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-[#96989d] hover:text-white hover:bg-[#35373c]">
      <Volume2 className="w-5 h-5 text-[#96989d]" />
      {name}
    </div>
  );
}

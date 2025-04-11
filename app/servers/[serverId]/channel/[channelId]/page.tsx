"use client";

import SectionOne from "@/public/homeDir/ui/sectionOne";

import SectionFour from "@/public/homeDir/ui/sectionFour";

import { Bell, Hash, Search, Users } from "lucide-react";
import MessageInput from "@/components/messeage-input";
import { Button } from "@/components/ui/button";
import { useChannelContext } from "@/components/context/channel-context";
import { useChannelStore } from "@/components/store/useSearchStore";
export default function Home() {
  const channelId = useChannelContext()?.channelId;
  const { channels } = useChannelStore(); // 전체 채널 리스트 가져오기
  // 현재 channelId에 해당하는 채널 찾기
  const currentChannel = channels.find((channel) => channel.id === Number(channelId));
  return (
    <>
      <SectionOne>
        <div className="flex items-center h-12 px-2 border-b border-[#1e1f22] shadow-sm">
          <Hash className="w-5 h-5 mr-2 text-[#96989d]" />
          <h3 className="font-bold text-white">{currentChannel?.name || "채널 이름 없음"}</h3>
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
      </SectionOne>
      <SectionFour>
        <div className={"bg-discord1and4 flex-1 overflow-y-auto max-h-[calc(100vh-48px)] custom-scrollbar relative"}>
          <ul>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>dawwda </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
          </ul>
        </div>
        <div className={"absolute bottom-0 z-20 w-full bg-discord1and4"}>
          <MessageInput />
        </div>
        {/*<div className={"min-w-[358px] bg-amber-50 hidden xl:block justify-center"}>*/}
        {/*  <div className={"h-full w-full flex justify-center items-center"}>친구없음</div>*/}
        {/*</div>*/}
      </SectionFour>
    </>
  );
}

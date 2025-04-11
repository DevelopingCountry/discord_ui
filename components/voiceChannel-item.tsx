"use client";

import { Volume2 } from "lucide-react";
import { clsx } from "clsx";
import { useVoiceStore } from "@/components/store/voiceStore";

export default function VoiceChannelItem({ name, channelId }: { name: string; channelId: number; serverId: string }) {
  const {
    connectedChannelId,
    connectToVoice,
    removeParticipant,
    disconnectFromVoice,
    addParticipant,
    channelParticipants,
  } = useVoiceStore();
  const participants = channelParticipants[channelId] || [];

  return (
    <ul
      // className={clsx(
      //   "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer",
      //   isAcitve ? "text-white bg-[#35373c]" : "text-[#96989d] hover:text-white hover:bg-[#35373c]",
      // )}
      className={clsx(
        "flex items-center gap-1.5 px-2 py-1 rounded text-sm cursor-pointer text-[#96989d] hover:text-white hover:bg-[#35373c]",
      )}
      onClick={() => {
        // 현 유저가 안들어와있을 때
        // 이 유저가 이 채널에 접속해 있다는것을 저장해야한다.
        // 들어와 있을 떄
        // 이 유저를 지운다.
        const isAlreadyJoined = connectedChannelId === channelId;
        const userId = "현재유저ID"; // 실제 로그인된 유저 ID를 여기에 세팅

        if (isAlreadyJoined) {
          // 참여 중이니까 나가기
          removeParticipant(channelId, userId);
          disconnectFromVoice(); // connectedChannelId 초기화
        } else {
          // 참여 중이 아니니까 들어가기
          addParticipant(channelId, userId);
          connectToVoice(channelId); // 마지막 접속 채널 저장
        }

        console.log("channelId:", channelId);
        console.log("connectedChannelId:", connectedChannelId);
      }}
    >
      <Volume2 className="w-5 h-5 text-[#96989d]" />
      {name}
      {participants.length > 0 && <span className="ml-auto text-xs text-green-400">참여: {participants.length}</span>}
    </ul>
  );
}

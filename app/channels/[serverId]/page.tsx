"use client";

import SectionOne from "@/public/homeDir/ui/sectionOne";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useChannelStore } from "@/components/store/use-channel-store";
import VoiceChannel from "@/components/VoiceChannel";
import { useAuth } from "@/components/context/AuthContext";

export default function ServerPage() {
  const { connectedChannelId, channelParticipants } = useVoiceStore();
  const { channels } = useChannelStore();
  const { userId } = useAuth();

  // 현재 연결된 채널 정보 가져오기
  const connectedChannel = connectedChannelId ? channels.find((ch) => ch.id === connectedChannelId) : null;

  // 현재 사용자가 음성 채널에 참여 중인지 확인
  const isUserInVoiceChannel =
    connectedChannelId && (channelParticipants[connectedChannelId] || []).includes(userId || "");

  console.log("=== ServerPage Debug ===");
  console.log("connectedChannelId:", connectedChannelId);
  console.log("connectedChannel:", connectedChannel);
  console.log("isUserInVoiceChannel:", isUserInVoiceChannel);
  console.log("userId:", userId);
  console.log("channelParticipants:", channelParticipants);

  // 🔥 핵심: 음성 채널에 연결되어 있으면 VoiceChannel 컴포넌트 표시
  if (connectedChannelId && connectedChannel?.type === "VOICE" && isUserInVoiceChannel) {
    return (
      <SectionOneAndFour>
        <SectionOne>
          <div className="flex items-center h-12 px-4 border-b border-[#1e1f22] shadow-sm">
            <span className="text-white font-bold">🎤 {connectedChannel.name}</span>
            <span className="text-green-400 text-sm ml-2">• 음성 채널 참여 중</span>
          </div>
        </SectionOne>
        <SectionFour>
          <VoiceChannel />
        </SectionFour>
      </SectionOneAndFour>
    );
  }

  // 음성 채널에 연결되지 않은 경우 기본 서버 페이지
  return (
    <SectionOneAndFour>
      <SectionOne>
        <div className="flex items-center h-12 px-4 border-b border-[#1e1f22] shadow-sm">
          <span className="text-white font-bold">서버 홈</span>
        </div>
      </SectionOne>
      <SectionFour>
        <div className="flex flex-col items-center justify-center h-full text-center text-white bg-[#36393f]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">환영합니다! 👋</h2>
            <p className="text-gray-400 mb-6">
              좌측에서 텍스트 채널을 선택하거나
              <br />
              음성 채널에 참여해보세요.
            </p>
          </div>

          {/* 음성 채널 상태 표시 */}
          {connectedChannelId && (
            <div className="bg-[#2b2d31] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">🎤 음성 채널 연결됨</h3>
              <p className="text-gray-300">채널: {connectedChannel?.name || connectedChannelId}</p>
              <p className="text-green-400 text-sm">
                참여자: {(channelParticipants[connectedChannelId] || []).length}명
              </p>
            </div>
          )}
        </div>
      </SectionFour>
    </SectionOneAndFour>
  );
}

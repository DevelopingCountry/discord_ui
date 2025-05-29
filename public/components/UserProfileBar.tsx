"use client";

import Image from "next/image";
import { useProfileStore } from "@/components/store/use-profile";

const UserProfileBar = ({
  imageUrl,
  stateIcon,
  statusMessage,
}: {
  imageUrl: string;
  stateIcon: string;
  username: string;
  statusMessage: string;
}) => {
  const { profile } = useProfileStore();
  return (
    <div className="flex items-center justify-between p-2 bg-discordSidebar rounded">
      {/* 사용자 이미지 및 상태 */}
      <div className="flex items-center">
        <div className="relative">
          {/* 사용자 이미지 */}
          <Image src={imageUrl} alt="User Avatar" width={40} height={40} className="rounded-full" />

          {/* 상태 아이콘 (디스코드 스타일) */}
          <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 rounded-full bg-discordSidebar p-[2px] flex items-center justify-center border-2 border-[#2b2d31]">
            <Image src={stateIcon} alt="Status Icon" width={12} height={12} className="rounded-full" />
          </div>
        </div>
        <div className="ml-3">
          {/* 사용자 이름 */}
          <p className="text-sm font-semibold text-white">{profile?.nickname}</p>
          {/* 상태 메시지 */}
          <p className="text-xs text-gray-400">{statusMessage}</p>
        </div>
      </div>

      {/* 아이콘들 */}
      <div className="flex space-x-1">
        {/* 마이크 아이콘 */}
        <button className="text-gray-400 hover:text-white">🎤</button>
        {/* 헤드셋 아이콘 */}
        <button className="text-gray-400 hover:text-white">🎧</button>
        {/* 설정 아이콘 */}
        <button className="text-gray-400 hover:text-white">⚙️</button>
      </div>
    </div>
  );
};

export default UserProfileBar;

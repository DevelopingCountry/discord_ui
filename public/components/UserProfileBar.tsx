"use client";

import Image from "next/image";

const UserProfileBar = ({
  imageUrl,
  stateIcon,
  username,
  statusMessage,
}: {
  imageUrl: string;
  stateIcon: string;
  username: string;
  statusMessage: string;
}) => {
  return (
    <div className="flex items-center justify-between p-2 bg-discordSidebar rounded">
      {/* 사용자 이미지 및 상태 */}
      <div className="flex items-center">
        <div className="relative">
          {/* 사용자 이미지 */}
          <Image
            src={imageUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          {/* 상태 아이콘 */}
          <div className="absolute bottom-0 right-0 w-3 h-3">
            <Image
              src={stateIcon}
              alt="Status Icon"
              width={12}
              height={12}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="ml-3">
          {/* 사용자 이름 */}
          <p className="text-sm font-semibold text-white">{username}</p>
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

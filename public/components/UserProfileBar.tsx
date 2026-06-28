"use client";

import Image from "next/image";
import { useProfileStore } from "@/components/store/use-profile";

const UserProfileBar = ({ stateIcon, statusMessage }: { stateIcon: string; statusMessage: string }) => {
  const { profile } = useProfileStore();
  return (
    <div className="flex items-center justify-between p-2 bg-discordSidebar rounded">
      <div className="flex items-center">
        <div className="relative">
          <Image
            src={profile?.imageUrl || "/assets/discord_blue.png"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="absolute bottom-[-2px] right-[-2px] w-4 h-4 rounded-full bg-discordSidebar p-[2px] flex items-center justify-center border-2 border-[#2b2d31]">
            <Image src={stateIcon} alt="Status Icon" width={12} height={12} className="rounded-full" />
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-white">{profile?.nickname ?? "..."}</p>
          <p className="text-xs text-gray-400">{statusMessage}</p>
        </div>
      </div>
      <div className="flex space-x-1">
        <button className="text-gray-400 hover:text-white">🎤</button>
        <button className="text-gray-400 hover:text-white">🎧</button>
        <button className="text-gray-400 hover:text-white">⚙️</button>
      </div>
    </div>
  );
};

export default UserProfileBar;

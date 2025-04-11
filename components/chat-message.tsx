import Image from "next/image";
import { MessageCircle } from "lucide-react";

export default function ChatMessage({
  name,
  status,
  avatar,
  isOnline = false,
  isPlaying = false,
}: {
  name: string;
  status: string;
  avatar?: string | null;
  isOnline?: boolean;
  isPlaying?: boolean;
}) {
  return (
    <div className="flex items-center px-2 py-3 rounded hover:bg-[#35373c] cursor-pointer group">
      <div className="relative mr-3">
        <Image src={avatar || "/assets/discord_blue.png"} alt={name} width={40} height={40} className="rounded-full" />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#313338]"></div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-white text-sm font-medium">{name}</span>
          {isPlaying && (
            <div className="ml-2 flex items-center">
              <div className="w-3 h-3 mr-1">
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <path
                    fill="#3ba55c"
                    d="M3.3,13.5l4.8,4.6c0.4,0.4,1.1,0.1,1.1-0.5V9.9c0-0.6-0.7-0.9-1.1-0.5L3.3,13.5z M9.6,17.6l4.8,4.6 c0.4,0.4,1.1,0.1,1.1-0.5v-7.7c0-0.6-0.7-0.9-1.1-0.5L9.6,17.6z M16,13.5l4.8,4.6c0.4,0.4,1.1,0.1,1.1-0.5V9.9 c0-0.6-0.7-0.9-1.1-0.5L16,13.5z"
                  ></path>
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="text-[#b5bac1] text-sm">{status}</div>
      </div>
      <div className="flex space-x-2">
        <button className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#b5bac1]" />
        </button>
        <button className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path fill="currentColor" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" className="text-[#b5bac1]"></path>
            <path fill="currentColor" d="M4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" className="text-[#b5bac1]"></path>
            <path fill="currentColor" d="M4 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" className="text-[#b5bac1]"></path>
            <path fill="currentColor" d="M20 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" className="text-[#b5bac1]"></path>
            <path fill="currentColor" d="M20 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" className="text-[#b5bac1]"></path>
            <path
              fill="currentColor"
              d="M12 16.5c0 1.38 1.12 2.5 2.5 2.5h3c1.38 0 2.5-1.12 2.5-2.5v-5c0-1.38-1.12-2.5-2.5-2.5h-3c-1.38 0-2.5 1.12-2.5 2.5v5z"
              className="text-[#b5bac1]"
            ></path>
            <path
              fill="currentColor"
              d="M4 16.5c0 1.38 1.12 2.5 2.5 2.5h3c1.38 0 2.5-1.12 2.5-2.5v-5c0-1.38-1.12-2.5-2.5-2.5h-3C5.12 9 4 10.12 4 11.5v5z"
              className="text-[#b5bac1]"
            ></path>
            <path
              fill="currentColor"
              d="M4 4.5C4 5.88 5.12 7 6.5 7h3C10.88 7 12 5.88 12 4.5v-1C12 2.12 10.88 1 9.5 1h-3C5.12 1 4 2.12 4 3.5v1z"
              className="text-[#b5bac1]"
            ></path>
            <path
              fill="currentColor"
              d="M12 4.5C12 5.88 13.12 7 14.5 7h3C18.88 7 20 5.88 20 4.5v-1C20 2.12 18.88 1 17.5 1h-3C13.12 1 12 2.12 12 3.5v1z"
              className="text-[#b5bac1]"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

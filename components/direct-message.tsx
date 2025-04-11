import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DirectMessage({
  id,
  name,
  avatar,
  isOnline = false,
  isPlaying = false,
}: {
  id: number;
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  isPlaying?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      className="flex items-center px-2 py-3 rounded hover:bg-[#35373c] cursor-pointer group w-full"
      onClick={() => {
        router.push(`/channels/dm/${id}`);
      }}
    >
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
      </div>
    </button>
  );
}

"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { DmList } from "@/components/type/response";
import { useDmStore } from "@/components/store/use-dm-store";
import axios from "axios";
import { API_URL } from "@/lib/config";

export default function DirectMessage({ dm }: { dm: DmList }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === `/channels/me/${dm.dmId}`;
  const { removeDm } = useDmStore();

  const handleDelete = async (dmId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    try {
      await axios.post(`${API_URL}/dm/visible`, { dmId }, { headers: { Authorization: `Bearer ${token}` } });
      removeDm(dmId);
      // 현재 열린 DM이면 친구 목록으로 이동
      if (pathname === `/channels/me/${dmId}`) {
        router.push("/channels/me");
      }
    } catch (err) {
      console.error("❌ DM 숨기기 실패:", err);
    }
  };

  return (
    <button
      className={`flex items-center px-2 py-3 rounded hover:bg-[#35373c] cursor-pointer group w-full
      ${isActive ? "bg-[#393c41] text-white" : "text-[#96989d] hover:text-white hover:bg-[#35373c]"}`}
      onClick={() => router.push(`/channels/me/${dm?.dmId}`)}
    >
      <div className="relative mr-3">
        <Image
          src={dm.targetImageUrl || "/assets/discord_blue.png"}
          alt={dm.targetNickname}
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 flex justify-between items-center">
        <span className="text-white text-sm font-medium">{dm?.targetNickname || "No Name"}</span>
        <div
          className="ml-2 text-[#96989d] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(dm.dmId);
          }}
        >
          ✕
        </div>
      </div>
    </button>
  );
}

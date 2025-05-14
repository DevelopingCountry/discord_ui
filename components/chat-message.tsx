"use client";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDmStore } from "@/components/store/use-dm-store";
import { DmList } from "@/components/type/response";
import { useRouter } from "next/navigation";

export default function ChatMessage({
  name,
  status,
  avatar,
  id,
  isOnline = false,
  isPlaying = false,
  isActive,
}: {
  name: string;
  status: string;
  id: string;
  avatar?: string | null;
  isOnline?: boolean;
  isPlaying?: boolean;
  isActive: string;
}) {
  const [dmId, setDmId] = useState<string | null>(null);
  const { dmList, addDm } = useDmStore();
  const route = useRouter();
  const body = {
    targetId: id,
  };
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const clickHandle = () => {
    console.log("clickHandle");
    console.log("body", body);
    console.log("token", token);
    axios
      .post(`http://localhost:8080/dm`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const newDm: DmList = res.data.response;
        setDmId(newDm.dmId);
        console.log("New DM created:", newDm);
        console.log("dmId:", dmId);

        // Zustand store의 addDm 함수 호출
        addDm(newDm);
        console.log("DM 리스트 업데이트 완료");

        // 페이지 이동 전 약간의 지연
        setTimeout(() => {
          route.push(`/channels/me/${newDm.dmId}`);
        }, 0);
      })
      .catch((err) => console.error("❌ dm생성 실패:", err));
    console.log("dmList", dmList);
    console.log("click");
    // route.push(`/channels/me/${dmId}`);
  };
  useEffect(() => {
    // 상태가 변경된 후 dmList 값 확인
    console.log("dmList has been updated:", dmList);
  }, [dmList]); // dmList가 변경될 때마다 실행됨
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
        {isActive === "모두" ? (
          <button className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center" onClick={clickHandle}>
            <MessageCircle className="w-5 h-5 text-[#b5bac1]" />
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

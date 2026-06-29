"use client";
import Image from "next/image";
import { MessageCircle, Check, X, Trash2 } from "lucide-react";
import axios from "axios";
import { DmList } from "@/components/type/response";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { useFriendsContext } from "@/components/context/friends-context";
import { useDmStore } from "@/components/store/use-dm-store";

export default function ChatMessage({
  name,
  status,
  avatar,
  id,
  friendId,
  isOnline = false,
  isActive,
  isSender,
}: {
  name: string;
  status: string;
  id: string;
  friendId: string;
  avatar?: string | null;
  isOnline?: boolean;
  isActive: string;
  isSender: boolean;
}) {
  const route = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const friendsData = useFriendsContext()?.friendsData;
  const setFriendsData = useFriendsContext()?.setFriendsData;
  const addDm = useDmStore((s) => s.addDm);

  const openDm = () => {
    axios
      .post(`${API_URL}/dm`, { targetId: id }, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const newDm: DmList = res.data.response;
        addDm(newDm); // ← 추가
        setTimeout(() => route.push(`/channels/me/${newDm.dmId}`), 0);
      })
      .catch((err) => console.error("❌ dm생성 실패:", err));
  };
  const acceptFriend = () => {
    axios
      .patch(`${API_URL}/friend`, { friendId, isFriend: "ACCEPTED" }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        if (!friendsData || !setFriendsData) return;
        const updated = friendsData.map((f) => (f.friendId === friendId ? { ...f, status: "ACCEPTED" } : f));
        setFriendsData(updated);
      })
      .catch((err) => console.error("❌ 수락 실패:", err.response?.data));
  };

  const rejectFriend = () => {
    axios
      .patch(`${API_URL}/friend`, { friendId, isFriend: "REJECTED" }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        if (!friendsData || !setFriendsData) return;
        setFriendsData(friendsData.filter((f) => f.friendId !== friendId));
      })
      .catch((err) => console.error("❌ 거절 실패:", err.response?.data));
  };

  const deleteFriend = () => {
    axios
      .delete(`${API_URL}/friend`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: id },
      })
      .then(() => {
        if (!friendsData || !setFriendsData) return;
        setFriendsData(friendsData.filter((f) => f.friendId !== friendId));
      })
      .catch((err) => console.error("❌ 삭제 실패:", err));
  };

  return (
    <div className="flex items-center px-10 py-4 rounded hover:bg-[#35373c] cursor-pointer group">
      {/* 아바타 */}
      <div className="relative mr-4 flex-shrink-0">
        <Image src={avatar || "/assets/discord_blue.png"} alt={name} width={42} height={42} className="rounded-full" />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#313338]" />
        )}
      </div>

      {/* 이름 */}
      <div className="flex-1 min-w-0">
        <div className="text-white text-md font-medium truncate">{name}</div>
        <div className="text-[#b5bac1] text-xs">
          {status === "ACCEPTED" ? "온라인" : isSender ? "요청 보냄" : "요청 받음"}
        </div>
      </div>
      <div className="flex space-x-2">
        {isActive === "모두" && (
          <>
            <button
              onClick={openDm}
              title="메시지 보내기"
              className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-[#35373c]"
            >
              <MessageCircle className="w-5 h-5 text-[#b5bac1]" />
            </button>
            <button
              onClick={deleteFriend}
              title="친구 삭제"
              className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4 text-[#b5bac1]" />
            </button>
          </>
        )}
        {isActive === "대기중" && isSender && (
          // 내가 보낸 요청 → 취소 버튼만
          <button
            onClick={deleteFriend}
            title="요청 취소"
            className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-red-500/20"
          >
            <X className="w-5 h-5 text-[#b5bac1]" />
          </button>
        )}
        {isActive === "대기중" && !isSender && (
          <>
            <button
              onClick={acceptFriend}
              title="수락"
              className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-green-500/20"
            >
              <Check className="w-5 h-5 text-[#b5bac1]" />
            </button>
            <button
              onClick={rejectFriend}
              title="거절"
              className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center hover:bg-red-500/20"
            >
              <X className="w-5 h-5 text-[#b5bac1]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

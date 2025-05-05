"use client";
import Image from "next/image";
import axios from "axios";
import { friendsDataType } from "@/components/type/response";
import { useAuth } from "@/components/context/AuthContext";
import { useFriendsContext } from "@/components/context/friends-context";

export default function AddFriendBar({
  name,
  status,
  avatar,
  id,
  isOnline = false,
  isPlaying = false,
}: {
  name: string;
  status: string;
  id: string;
  avatar?: string | null;
  isOnline?: boolean;
  isPlaying?: boolean;
}) {
  const friendsData = useFriendsContext()?.friendsData;
  const setFriendsData = useFriendsContext()?.setFriendsData;
  const { accessToken } = useAuth();
  const body = {
    targetId: id,
  };
  const clickHandle = () => {
    axios
      .post("http://localhost:8080/friend", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("찐추가");
        console.log("id", id);
        //2. response값으로 어떤 유저의 정보를 보내줌
        const newFriend: friendsDataType = res.data.response;
        console.log("newFriend", newFriend);
        console.log("friendsData", friendsData);
        // Zustand store의 addDm 함수 호출
        console.log("user정보 가져오기 완료");
        if (!friendsData) {
          setFriendsData([newFriend]);
        } else {
          const newFriendData = [...friendsData, newFriend];
          console.log("newFriendData", newFriendData);
          setFriendsData(newFriendData);
        }
      })
      .catch((err) => {
        console.error("❌user정보 가져오기 실패:", err);
        console.error("Server Error:", err.response?.data);
      });
    console.log("click");
    // route.push(`/channels/me/${dmId}`);
  };
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
        <button className="w-9 h-9 rounded-full bg-[#2b2d31] flex items-center justify-center" onClick={clickHandle}>
          <Image src={"/assets/channel-plus.svg"} alt={"dm생성"} width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

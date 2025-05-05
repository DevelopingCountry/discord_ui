"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useFriendsContext } from "@/components/context/friends-context";
import { useAuth } from "@/components/context/AuthContext";
import { friendsDataType } from "@/components/type/response";
import AddFriendBar from "@/components/add-friend-bar";
export default function AddFriend() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [searchedUser, setSearchedUser] = useState<friendsDataType | null>(null);
  const { accessToken } = useAuth();
  const friendsData = useFriendsContext()?.friendsData;
  const clickHandler = () => {
    console.log("username ", username);
    //1. 서버에 post요청
    const body = {
      nickName: username, // 서버가 기대하는 필드명으로 수정
    };
    console.log("Sending request body:", { nickName: username });
    console.log("Access Token:", accessToken);
    axios
      .post("http://localhost:8080/friend/search", body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        console.log("hhi");
        //2. response값으로 어떤 유저의 정보를 보내줌
        const newFriend: friendsDataType = res.data.response;
        console.log("newFriend", newFriend);
        console.log("friendsData", friendsData);
        // Zustand store의 addDm 함수 호출
        console.log("user정보 가져오기 완료");
        setSearchedUser(newFriend);
      })
      .catch((err) => {
        setStatus("error");
        console.error("❌user정보 가져오기 실패:", err);
        console.error("Server Error:", err.response?.data);
      });
    //3. 그 유저의 정보를 여기 밑에 띄움
    //4. 그 유저에게 검
  };

  return (
    // <div className={"flex-1 people-column"}>
    //   aa
    //   <header>
    //     <h2>친구 추가하기</h2>
    //   </header>
    //
    // </div>
    <div className="flex-1 p-4 md:p-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">친구 추가하기</h1>
          <p className="text-[#B5BAC1]">Discord 사용자명을 사용하여 친구를 추가할 수 있어요.</p>
        </div>
        <div className="hidden md:block">
          <Image
            src="/assets/icons8-bear-48.png"
            alt="Wumpus Detective"
            width={120}
            height={120}
            className="mt-4 md:mt-0"
          />
        </div>
      </header>

      <div className="border-b border-[#3F4147] pb-8">
        <div className="relative">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Discord 사용자명을 사용하여 친구를 추가할 수 있어요."
            className="bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 pr-32"
          />
          <Button
            onClick={clickHandler}
            disabled={!username.trim()}
            className="absolute right-0 top-0 h-full bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-l-none"
          >
            친구 요청 보내기
          </Button>
        </div>

        {status === "success" && (
          <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-md">성공적으로 친구 요청을 보냈습니다!</div>
        )}

        {status === "error" && (
          <div className="mt-4 p-3 bg-red-500/20 text-red-400 rounded-md">
            친구 요청을 보내는 데 실패했습니다. 사용자명을 확인해주세요.
          </div>
        )}
      </div>

      <div className="mt-8 text-white">
        {searchedUser === null ? (
          ""
        ) : (
          <AddFriendBar name={searchedUser.name} status={"행인1"} id={searchedUser.friendId} />
        )}
      </div>
    </div>
  );
}

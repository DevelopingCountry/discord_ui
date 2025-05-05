"use client";

import Image from "next/image";
import TabItem from "@/public/homeDir/components/TabItem";
import { useState } from "react";
import { useActiveStore } from "@/components/store/useSearchStore";
import { Button } from "@/components/ui/button";
import { MainScreenContextProps, useMainScreenContext } from "@/components/context/main-screen-context";

export function TabBarComp() {
  const { setIsActive } = useActiveStore();
  const [selectedTabId, setSelectedTabId] = useState(1);
  const useMainScreenContext1: MainScreenContextProps | null = useMainScreenContext();
  const setState = useMainScreenContext1?.setState;
  const TabItems: { id: number; label: string }[] = [
    { id: 1, label: "모두" },
    { id: 2, label: "대기중" },
    // 나중에 거절도 넣자
  ];
  const addFriendHandler = () => {
    console.log("click");
    if (setState) {
      console.log("addFriends");
      setState("addFriends");
      setSelectedTabId(3);
      setIsActive("친구추가하기");
    }
  };
  return (
    <div className={"flex items-center relative flex-1"}>
      <Image src={"/assets/friend.png"} alt={"친구"} width={24} height={24} />
      {/*<RxDividerVertical size={25} color={"gray"} />*/}
      <ul className={"flex"}>
        {TabItems.map((item) => (
          <li key={item.id}>
            <TabItem
              label={item.label}
              isSelected={selectedTabId === item.id}
              onClick={() => {
                if (setState) {
                  console.log("item.label", item.label);
                  setState("getFriends");
                }
                setSelectedTabId(item.id);
                setIsActive(item.label);
              }}
            />
          </li>
        ))}
        <li>
          <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white" onClick={addFriendHandler}>
            친구 추가하기
          </Button>
        </li>
      </ul>

      {/*<TabItem label={"추천"} isActive={false} />*/}
      {/*<TabItem label={"차단 목록"} isActive={false} />*/}
      {/*<TabItem label={"친구 추가하기"} />*/}
    </div>
  );
}

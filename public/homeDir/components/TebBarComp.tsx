"use client";

import Image from "next/image";
import TabItem from "@/public/homeDir/components/TabItem";
import { useState } from "react";
import { useActiveStore } from "@/components/store/useSearchStore";

export function TabBarComp() {
  const { setIsActive } = useActiveStore();
  const [selectedTabId, setSelectedTabId] = useState(1);
  const TabItems: { id: number; label: string }[] = [
    { id: 1, label: "모두" },
    { id: 2, label: "대기중" },
  ];
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
                setSelectedTabId(item.id);
                setIsActive(item.label);
              }}
            />
          </li>
        ))}
      </ul>

      {/*<TabItem label={"추천"} isActive={false} />*/}
      {/*<TabItem label={"차단 목록"} isActive={false} />*/}
      {/*<TabItem label={"친구 추가하기"} />*/}
    </div>
  );
}

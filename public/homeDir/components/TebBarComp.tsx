"use client";

import Image from "next/image";
import TabItem from "@/public/homeDir/components/TabItem";

export function TabBarComp() {
  return (
    <div className={"flex items-center relative flex-1"}>
      <Image src={"/assets/friend.png"} alt={"친구"} width={24} height={24} />
      {/*<RxDividerVertical size={25} color={"gray"} />*/}
      <TabItem label={"온라인"} isActive={false} />
      <TabItem label={"모두"} isActive={false} />
      <TabItem label={"대기중"} isActive={false} />
      <TabItem label={"추천"} isActive={false} />
      <TabItem label={"차단 목록"} isActive={false} />
      <TabItem label={"친구 추가하기"} isActive={false} />
    </div>
  );
}

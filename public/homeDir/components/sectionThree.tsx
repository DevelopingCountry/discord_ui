"use client";

import SidebarItem from "@/public/homeDir/components/sidebarItem";
import DirectMessage from "@/components/direct-message";
import { useDmStore } from "@/components/store/use-dm-store";
import { useEffect } from "react";
const SectionThreeMain = () => {
  const { dmList } = useDmStore(); // Zustand에서 DM 목록 가져오기

  // useEffect로 dmList가 변경될 때마다 리렌더링 보장
  useEffect(() => {
    console.log("dmList has been updated", dmList);
  }, [dmList]); // dmList가 변경될 때마다 실행됨

  console.log("dmList", dmList);
  return (
    <div className={"mt-2"}>
      <div className={"relative max-w-[224px] ml-[8px] "}>
        <SidebarItem icon={"/assets/friend.png"} label={"친구"} />
      </div>
      <h2 className={"flex pl-[18px] pt-[18px] pb-[4px] pr-[8px] h-[40px] text-[12px]/[16px] font-[600]"}>
        <span className={"flex-1 text-amber-50"}>다이렉트 메시지</span>
        {/*<button className={"mr-[2px]"}>*/}
        {/*  <Image src={"/assets/channel-plus.svg"} alt={"dm생성"} width={16} height={16} />*/}
        {/*</button>*/}
      </h2>
      <ul>
        {dmList?.map((dm) => (
          <li key={dm.dmId} className={"flex flex-1 w-full"}>
            <DirectMessage dm={dm} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionThreeMain;

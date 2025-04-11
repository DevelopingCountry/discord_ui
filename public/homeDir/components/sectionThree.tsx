"use client";

import SidebarItem from "@/public/homeDir/components/sidebarItem";
import Image from "next/image";
import DirectMessage from "@/components/direct-message";
const SectionThreeMain = ({ dmDatasJson }: { dmDatasJson: { id: number; oppenentName: string }[] }) => {
  return (
    <div className={"mt-2"}>
      <div className={"relative max-w-[224px] ml-[8px] "}>
        <SidebarItem icon={"/assets/friend.png"} label={"친구"} isActive={false} />
      </div>
      <h2 className={"flex pl-[18px] pt-[18px] pb-[4px] pr-[8px] h-[40px] text-[12px]/[16px] font-[600]"}>
        <span className={"flex-1 text-amber-50"}>다이렉트 메시지</span>
        <button className={"mr-[2px]"}>
          <Image src={"/assets/channel-plus.svg"} alt={"dm생성"} width={16} height={16} />
        </button>
      </h2>
      <ul>
        {dmDatasJson.map((dm) => (
          <li key={dm.id} className={"flex flex-1 w-full"}>
            <DirectMessage id={dm.id} name={dm.oppenentName} status={"dm"} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SectionThreeMain;

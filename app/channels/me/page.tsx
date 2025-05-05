"use client";
import SectionOne from "@/public/homeDir/ui/sectionOne";
import { TabBarComp } from "@/public/homeDir/components/TebBarComp";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import SearchFriend from "@/public/homeDir/components/searchFriend";
import { MainScreenContextProps, useMainScreenContext } from "@/components/context/main-screen-context";
import AddFriend from "@/components/add-friend";

export default function Home() {
  const useMainScreenContext1: MainScreenContextProps | null = useMainScreenContext();
  const state = useMainScreenContext1?.state;

  return (
    <>
      <SectionOne>
        <TabBarComp />
        {/*<ToolBar />*/}
      </SectionOne>
      <SectionFour>
        {state === "getFriends" ? <SearchFriend /> : <AddFriend />}

        <div className={"min-w-[358px] bg-discordDark hidden xl:block justify-center shadow-elevationLeft"}>
          <div className={"h-full w-full flex justify-center items-center text-white"}>메모장</div>
        </div>
      </SectionFour>
    </>
  );
}

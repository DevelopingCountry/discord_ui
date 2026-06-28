"use client";
import SectionOne from "@/public/homeDir/ui/sectionOne";
import { TabBarComp } from "@/public/homeDir/components/TebBarComp";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import SearchFriend from "@/public/homeDir/components/searchFriend";
import { MainScreenContextProps, useMainScreenContext } from "@/components/context/main-screen-context";
import AddFriend from "@/components/add-friend";
import OnlineFriendsPanel from "@/components/online-friends-panel";

export default function Home() {
  const useMainScreenContext1: MainScreenContextProps | null = useMainScreenContext();
  const state = useMainScreenContext1?.state;

  return (
    <>
      <SectionOne>
        <TabBarComp />
      </SectionOne>
      <SectionFour>
        <div className={"flex"}>
          {state === "getFriends" ? <SearchFriend /> : <AddFriend />}
          <OnlineFriendsPanel />
        </div>
      </SectionFour>
    </>
  );
}

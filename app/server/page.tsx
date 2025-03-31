import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import { SectionTwoMain } from "@/public/homeDir/components/sectionTwoMain";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import SectionOne from "@/public/homeDir/ui/sectionOne";
import { TabBarComp } from "@/public/homeDir/components/TebBarComp";
import { ToolBar } from "@/public/homeDir/components/toolBar";
import SectionFour from "@/public/homeDir/ui/sectionFour";
export default function Home() {
  return (
    <div className={"flex flex-1 bg-amber-200"}>
      <SectionTwoAndThree>
        <SectionTwo>
          <SectionTwoMain />
        </SectionTwo>
        <SectionThree>
          <ul>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
            <li className={"text-amber-50"}>aa</li>
          </ul>
        </SectionThree>
        <UserProfileBarUi>
          <UserProfileBar
            imageUrl="/assets/discord_blue.png"
            stateIcon="/assets/status-online.svg"
            username="이원빈"
            statusMessage="온라인"
          />
        </UserProfileBarUi>
      </SectionTwoAndThree>
      <SectionOneAndFour>
        <SectionOne>
          <TabBarComp />
          <ToolBar />
        </SectionOne>
        <SectionFour>
          {/*<PeopleColumn>*/}
          {/*  <div*/}
          {/*    className={*/}
          {/*      "w-full mx-3 flex h-[34px] pt-2 shadow-elevationLow justify-center items-center"*/}
          {/*    }*/}
          {/*  >*/}
          {/*    <input placeholder={"검색하기"} className={"w-full"}></input>*/}
          {/*    <div className={"bg-amber-950"}>icon</div>*/}
          {/*  </div>*/}
          {/*  <div className={" custom-scrollbar overflow-y-auto"}>*/}
          {/*    /!*max-h-[calc(100vh-100px)] custom-scrollbar overflow-y-scroll*!/*/}
          {/*    <ul>*/}
          {/*      <li className={" bg-amber-600 h-44 mb-3"}>a</li>*/}
          {/*      <li className={"bg-amber-600 h-44 mb-3"}>a</li>*/}
          {/*      <li className={"bg-amber-600 h-44 mb-3"}>a</li>*/}
          {/*      <li className={"bg-amber-600 h-44 mb-3"}>a</li>*/}
          {/*    </ul>*/}
          {/*  </div>*/}
          {/*</PeopleColumn>*/}
          <div className={"bg-discord1and4 flex-1 overflow-y-auto max-h-[calc(100vh-48px)] custom-scrollbar"}>
            <ul>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
              <li className={"h-44 text-amber-50  mb-3 flex justify-center items-center"}>채팅내역 </li>
            </ul>
          </div>
          {/*<div className={"min-w-[358px] bg-amber-50 hidden xl:block justify-center"}>*/}
          {/*  <div className={"h-full w-full flex justify-center items-center"}>친구없음</div>*/}
          {/*</div>*/}
        </SectionFour>
        {/*<div className={"flex-1 flex bg-amber-800"}>*/}
        {/*  <div className={"flex-1 flex flex-col"}>*/}
        {/*    <div*/}
        {/*      className={"bg-amber-100 h-10 flex justify-center items-center"}*/}
        {/*    >*/}
        {/*      /!*검색창*!/*/}
        {/*      <div className={"bg-amber-400 w-full mx-3 flex "}>*/}
        {/*        <input placeholder={"검색하기"} className={"w-full"}></input>*/}
        {/*        <div className={"bg-amber-950"}>icon</div>*/}
        {/*      </div>*/}
        {/*      /!*검색창*!/*/}
        {/*    </div>*/}
        {/*    /!*사람들 보여주는 창*!/*/}
        {/*    /!*<div*!/*/}
        {/*    /!*  className={*!/*/}
        {/*    /!*    "bg-amber-950 overflow-y-auto custom-scrollbar flex-1 shrink"*!/*/}
        {/*    /!*  }*!/*/}
        {/*    /!*>*!/*/}
        {/*    <SectionThree>*/}
        {/*      <section className={"bg-blue-400"}>온라인 - 몇명?</section>*/}
        {/*      /!*사람들 리스트*!/*/}

        {/*      /!*사람들 리스트*!/*/}
        {/*    </SectionThree>*/}
        {/*  </div>*/}
        {/*  /!*사람들 보여주는 창*!/*/}
        {/*  /!*</div>*!/*/}
        {/*  <div className={"min-w-[358px] bg-amber-50 hidden xl:block"}></div>*/}
        {/*</div>*/}
      </SectionOneAndFour>
    </div>
  );
}

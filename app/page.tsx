import { SectionTwoAndThree } from "@/public/ui/sectionTwoAndThree";
import SectionTwo from "@/public/ui/sectionTwo";
import { SectionTwoMain } from "@/public/ui/components/sectionTwoMain";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/ui/components/UserProfileBar";
import SectionThree from "@/public/ui/sectionThree";
import SectionOneAndFour from "@/public/ui/sectionOneAndFour";
import SectionOne from "@/public/ui/sectionOne";
import { TabBarComp } from "@/public/ui/components/TebBarComp";
import { ToolBar } from "@/public/ui/components/toolBar";

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
      </SectionOneAndFour>
    </div>
  );
}

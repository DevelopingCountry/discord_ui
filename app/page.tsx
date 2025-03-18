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

import SectionOne from "@/public/homeDir/ui/sectionOne";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";

export default function Home() {
  return (
    <SectionOneAndFour>
      <SectionOne>
        <div className={"text-white"}>welcomePage</div>
      </SectionOne>
      <SectionFour>
        <div className={"flex items-center justify-center text-white"}>welcomePage</div>
        <div className={"absolute bottom-0 z-20 w-full bg-discord1and4"}>{/*<MessageInput />*/}</div>
      </SectionFour>
    </SectionOneAndFour>
  );
}

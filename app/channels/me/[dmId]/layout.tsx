import { Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionOne from "@/public/homeDir/ui/sectionOne";
import SectionFour from "@/public/homeDir/ui/sectionFour";
import SearchMessage from "@/components/search-message";
import DmName from "@/components/dm-name";

type Props = {
  children: React.ReactNode;
  params: { dmId: string };
};

export default async function DmLayout({ children, params }: Props) {
  const { dmId } = await params;

  // // ✅ DM message 가져오기 (서버에서)
  // const res = await fetch(`http://localhost:8080/api/dms/${dmId}/opponent`, {
  //   cache: "no-store", // optional: 최신 데이터 보장
  // });
  // const opponent = await res.json();
  return (
    <>
      <SectionOne>
        <DmName dmId={dmId} />
        <div className="p-3 flex flex-shrink-0 absolute right-1 z-10">
          <div className="text-[#b5bac1] pr-2 flex-shrink-0 bg-discord1and4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Users className="w-5 h-5" />
            </Button>
          </div>
          <SearchMessage />
        </div>
      </SectionOne>

      <SectionFour>{children}</SectionFour>
    </>
  );
}

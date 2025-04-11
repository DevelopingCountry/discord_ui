import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import ServerName from "@/components/server-name";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import ChannelSidebar from "@/components/channel-sidebar";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import { ChannelHydrator } from "@/components/hydrate/channel-hydrator";

export default async function ServerRayout({
  params,
  children,
}: {
  params: Promise<{ serverId: string }>;
  children: React.ReactNode;
}) {
  const { serverId } = await params;
  const a = await params;
  console.log(a);
  console.log("serverId" + serverId);
  // const channelsData = await fetch("https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=d0e33acc669d3d7994242e6879cefb32&redirect_uri=http://localhost:8080/auth/login/kakao")
  // ;

  const channelsData: { id: number; name: string; type: string }[] = [
    { id: 1, name: "chatChannelEx", type: "text" },
    { id: 2, name: "chatChanne2lEx", type: "text" },
    { id: 3, name: "voiceChannelEx", type: "voice" },
  ];
  return (
    <div className={"flex flex-1 bg-amber-200"}>
      <ChannelHydrator channels={channelsData} />
      <SectionTwoAndThree>
        <SectionTwo>
          <ServerName />
        </SectionTwo>
        <SectionThree>
          <ChannelSidebar channelsData={channelsData} serverId={serverId} />
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
      {children}
    </div>
  );
}

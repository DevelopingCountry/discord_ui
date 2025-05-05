import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import ServerName from "@/components/server-name";
import SectionThree from "@/public/homeDir/ui/sectionThree";
// import ChannelSidebar from "@/components/channel-sidebar";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import { ChannelHydrator } from "@/components/hydrate/channel-hydrator";
import ChannelSidebar from "@/components/client/channel-sidebar-client";
import { channel } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChannelSubscriber from "@/components/ChannelSubscriber";

export default async function ServerRayout({
  params,
  children,
}: {
  params: { serverId: string };
  children: React.ReactNode;
}) {
  const { serverId } = await params;
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    // 로그인 안 돼 있으면 리디렉션 (선택)
    redirect("/login");
  }
  const channels = await fetch(`http://localhost:8080/server/${serverId}/channel`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/[serverId]/layout] fetch");
  const channelss = await channels.json();
  console.log("channelss = ", channelss);
  const channelsData: channel[] = await channelss.response;
  console.log("channelsData = ", channelsData);
  // const channelsData: channelList[] = [
  //   { channelId: 1, channelName: "chatChannelEx1", type: "text", creatorId: 2 },
  //   { channelId: 2, channelName: "chatChannelEx2", type: "text", creatorId: 3 },
  //   { channelId: 3, channelName: "chatChannelEx3", type: "voice", creatorId: 4 },
  // ];

  return (
    <div className={"flex flex-1 bg-amber-200"}>
      <ChannelHydrator channels={channelsData} />
      <ChannelSubscriber serverId={serverId} token={accessToken} />
      <SectionTwoAndThree>
        <SectionTwo>
          <ServerName />
        </SectionTwo>
        <SectionThree>
          <ChannelSidebar serverId={serverId} />
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

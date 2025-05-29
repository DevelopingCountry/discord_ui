import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import ServerName from "@/components/server-name";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import { ChannelHydrator } from "@/components/hydrate/channel-hydrator";
import ChannelSidebar from "@/components/client/channel-sidebar-client";
import { channel } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChannelSubscriber from "@/components/ChannelSubscriber";

export default async function ServerLayout({
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
    redirect("/login");
  }

  // 채널 데이터 가져오기
  const channels = await fetch(`http://localhost:8080/server/${serverId}/channel`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("[/channels/[serverId]/layout] fetch");
  const channelsResponse = await channels.json();
  console.log("channelsResponse = ", channelsResponse);
  const channelsData: channel[] = await channelsResponse.response;
  console.log("channelsData = ", channelsData);

  return (
    <div className={"flex flex-1 bg-amber-200 relative"}>
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

      {/* 메인 컨텐츠 */}
      {children}
    </div>
  );
}

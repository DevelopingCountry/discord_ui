import ResizableSidebar from "@/components/resizable-sidebar";
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
import { API_URL } from "@/lib/config";

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
    redirect("/login");
  }
  const channels = await fetch(`${API_URL}/server/${serverId}/channel`, {
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

  return (
    <div className={"flex flex-1"}>
      <ChannelHydrator channels={channelsData} />
      <ChannelSubscriber serverId={serverId} token={accessToken} />
      <ResizableSidebar>
        <SectionTwo>
          <ServerName />
        </SectionTwo>
        <SectionThree>
          <ChannelSidebar serverId={serverId} />
        </SectionThree>
        <UserProfileBarUi>
          <UserProfileBar stateIcon="/assets/status-online.svg" statusMessage="온라인" />
        </UserProfileBarUi>
      </ResizableSidebar>
      {children}
    </div>
  );
}

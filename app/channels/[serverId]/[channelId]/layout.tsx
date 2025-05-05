import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import { ChannelProvider } from "@/components/context/channel-context";

export default async function ChennalRayout({
  params,
  children,
}: {
  params: { serverId: string; channelId: string };
  children: React.ReactNode;
}) {
  const { channelId } = await params;
  // const MessageData = await fetch("https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=d0e33acc669d3d7994242e6879cefb32&redirect_uri=http://localhost:8080/auth/login/kakao")
  // ;
  // const MessageData: { id: number; name: string; type: string }[] = [
  //   { id: 1, name: "chatChannelEx", type: "text" },
  //   { id: 2, name: "voiceChannelEx", type: "voice" },
  // ];
  return (
    <ChannelProvider channelId={channelId}>
      <SectionOneAndFour>{children}</SectionOneAndFour>
    </ChannelProvider>
  );
}

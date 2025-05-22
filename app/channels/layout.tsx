import type { Metadata } from "next";
import "../globals.css";
import SideUi from "@/public/ui/sideUi";

import ServerSidebar from "@/components/server-sidebar";

import { ServerHydrator } from "@/components/hydrate/server-hydrator";
import { Profile, server } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyProfileHydrator } from "@/components/hydrate/my-profile-hydrator";
import NotificationSubscribe from "@/lib/NotificationSubscribe";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function ChannelsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    // 로그인 안 돼 있으면 리디렉션 (선택)
    redirect("/login");
  }
  const serversss = await fetch("http://localhost:8080/server", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] servers fetch");
  const profileee = await fetch("http://localhost:8080/me", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] profile fetch");
  const serverss = await serversss.json();
  const servers: server[] = await serverss.response;
  const profilee = await profileee.json();
  const profile: Profile = await profilee.response;
  console.log("servers", servers);
  console.log("profile", profile);
  // const ServersData: { id: number, name: string, imageUrl: string,"createdAt": string }[] = await Servers.json();
  // const servers: Server[] = [
  //   { serverId: "1", name: "Discord Clone", imageUrl: "D", alarm: false, hostId: "124" },
  //   { serverId: "2", name: "Gaming", imageUrl: "G", alarm: false, hostId: "124" },
  //   { serverId: "3", name: "Coding", imageUrl: "C", alarm: false, hostId: "124" },
  //   { serverId: "4", name: "Music", imageUrl: "M", alarm: false, hostId: "124" },
  //   { serverId: "5", name: "Music", imageUrl: "M", alarm: false, hostId: "124" },
  //   { serverId: "6", name: "Music", imageUrl: "M", alarm: false, hostId: "124" },
  // ];
  // const serverDataList = await fetch("http://localhost:8080/servers");
  // const serverData = await serverDataList.json();
  return (
    <>
      <ServerHydrator servers={servers} />
      <MyProfileHydrator myProfile={profile} />
      <NotificationSubscribe myProfile={profile} />
      {/*<EnsureServersClient />*/}
      <div className="bg-discordSidebar w-screen h-screen flex overflow-x-hidden overflow-y-hidden">
        <SideUi>
          <ServerSidebar />
        </SideUi>
        {children}
      </div>
    </>
  );
}

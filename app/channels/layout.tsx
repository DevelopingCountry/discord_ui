import type { Metadata } from "next";
import SideUi from "@/public/ui/sideUi";

import ServerSidebar from "@/components/server-sidebar";

import { ServerHydrator } from "@/components/hydrate/server-hydrator";
import { Profile, server } from "@/components/type/response";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MyProfileHydrator } from "@/components/hydrate/my-profile-hydrator";
import NotificationSubscribe from "@/lib/NotificationSubscribe";
import { API_URL } from "@/lib/config";

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
    redirect("/login");
  }
  const serversss = await fetch(`${API_URL}/server`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] servers fetch");
  const profileee = await fetch(`${API_URL}/me`, {
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
  return (
    <>
      <ServerHydrator servers={servers} />
      <MyProfileHydrator myProfile={profile} />
      <NotificationSubscribe myProfile={profile} />
      <div className="bg-discordSidebar w-screen h-screen flex overflow-x-hidden overflow-y-hidden">
        <SideUi>
          <ServerSidebar />
        </SideUi>
        {children}
      </div>
    </>
  );
}

import type { Metadata } from "next";
import SectionTwo from "@/components/layout/sectionTwo";
import { SectionTwoMain } from "@/components/dm/sectionTwoMain";
import SectionThree from "@/components/layout/sectionThree";
import SectionThreeMain from "@/components/dm/sectionThreeMain";
import UserProfileBarUi from "@/components/layout/UserProfileBarUi";
import UserProfileBar from "@/components/layout/UserProfileBar";
import SectionOneAndFour from "@/components/layout/sectionOneAndFour";
import { DmList } from "@/components/type/response";
import { FriendsHydrator } from "@/components/friend/friends-hydrator";
import { DmHydrator } from "@/components/dm/dm-hydrator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MainScreenProvider } from "@/components/friend/main-screen-context";
import { API_URL } from "@/lib/config";
import { ProfileHydrator } from "@/components/profile/profile-hydrator";
import ResizableSidebar from "@/components/layout/resizable-sidebar";

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function MeLayout({
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
  const dms = await fetch(`${API_URL}/dm`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const dm = await dms.json();
  const dmList: DmList[] = dm.response ?? [];
  console.log(dmList);

  const friendResponse = await fetch(`${API_URL}/friend`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const friendResponseJson = await friendResponse.json();
  const friend = friendResponseJson.response ?? [];
  console.log("friend =", friend);
  return (
    <div className={"flex flex-1"}>
      <FriendsHydrator friendsData={friend} />
      <ResizableSidebar>
        <SectionTwo>
          <SectionTwoMain />
        </SectionTwo>
        <SectionThree>
          <DmHydrator dmList={dmList} />
          <ProfileHydrator />
          <SectionThreeMain />
        </SectionThree>
        <UserProfileBarUi>
          <UserProfileBar stateIcon="/assets/status-online.svg" statusMessage="온라인" />
        </UserProfileBarUi>
      </ResizableSidebar>
      <SectionOneAndFour>
        <MainScreenProvider>{children}</MainScreenProvider>
      </SectionOneAndFour>
    </div>
  );
}

import type { Metadata } from "next";
import { SectionTwoAndThree } from "@/public/homeDir/ui/sectionTwoAndThree";
import SectionTwo from "@/public/homeDir/ui/sectionTwo";
import { SectionTwoMain } from "@/public/homeDir/components/sectionTwoMain";
import SectionThree from "@/public/homeDir/ui/sectionThree";
import SectionThreeMain from "@/public/homeDir/components/sectionThree";
import UserProfileBarUi from "@/public/ui/UserProfileBarUi";
import UserProfileBar from "@/public/components/UserProfileBar";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import { DmList } from "@/components/type/response";
import { FriendsProvider } from "@/components/context/friends-context";
import { DmHydrator } from "@/components/hydrate/dm-hydrator";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MainScreenProvider } from "@/components/context/main-screen-context";
import { API_URL } from "@/lib/config";

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
  const dmList: DmList[] = await dm.response;
  console.log(dmList);

  const friendResponse = await fetch(`${API_URL}/friend`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const friendResponseJson = await friendResponse.json();
  const friend = await friendResponseJson.response;
  console.log("friend =", friend);
  return (
    <div className={"flex flex-1"}>
      <SectionTwoAndThree>
        <SectionTwo>
          <SectionTwoMain />
        </SectionTwo>
        <SectionThree>
          <DmHydrator dmList={dmList} />
          <SectionThreeMain />
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
      <SectionOneAndFour>
        <FriendsProvider friendsData={friend}>
          <MainScreenProvider>{children}</MainScreenProvider>
        </FriendsProvider>
      </SectionOneAndFour>
    </div>
  );
}

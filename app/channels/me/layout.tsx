import type { Metadata } from "next";
import "../../globals.css";
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

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function MeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const friendsDatas = await fetch("http://localhost:8080/friends");
  // const friendsDatasjson: { name: string,imageUrl : string }[] = await friendsDatas.json();
  // const friendsDatasjson: friendsDataType[] = [
  //   { friendId: "1", name: "김성준", imageUrl: "image1", status: "PENDING" },
  //   { friendId: "2", name: "이원빈", imageUrl: "image2", status: "REJECTED" },
  //   { friendId: "3", name: "이소연", imageUrl: "image3", status: "ACCEPTED" },
  //   { friendId: "4", name: "이소연", imageUrl: "image4", status: "REJECTED" },
  //   { friendId: "5", name: "adb", imageUrl: "adb", status: "PENDING" },
  //   { friendId: "6", name: "QRSN", imageUrl: "QRSN", status: "ACCEPTED" },
  // ];

  // const dmDatas = await fetch("http://localhost:8080/channels/dm");
  // const dmDatasJson: { id:number, oppenentName: string }[] = dmDatas.json();
  // const dmDatasJson: DmList[] = [
  //   { dmId: 1, targetId: "1", targetImageUrl: "abab", targetNickName: "이소연" },
  //   { dmId: 2, targetId: "2", targetImageUrl: "abab", targetNickName: "김성준" },
  //   { dmId: 3, targetId: "3", targetImageUrl: "abab", targetNickName: "이원빈" },
  //   { dmId: 4, targetId: "4", targetImageUrl: "abab", targetNickName: "김성준" },
  // ];
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    // 로그인 안 돼 있으면 리디렉션 (선택)
    redirect("/login");
  }
  const dms = await fetch("http://localhost:8080/dm", {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("[/channels/me/layout] fetch");
  const dm = await dms.json();
  const dmList: DmList[] = await dm.response;
  console.log(dmList);

  const friendResponse = await fetch("http://localhost:8080/friend", {
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

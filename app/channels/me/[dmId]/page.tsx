"use client";

import { useParams } from "next/navigation";
import DmChat2 from "@/components/dm-chat2";
import OnlineFriendsPanel from "@/components/online-friends-panel";

export default function Home() {
  const params = useParams();
  const dmId = Array.isArray(params?.dmId) ? params.dmId[0] : params?.dmId;

  return (
    <div className={"flex"}>
      <DmChat2 dmId={dmId} />
      <OnlineFriendsPanel />
    </div>
  );
}

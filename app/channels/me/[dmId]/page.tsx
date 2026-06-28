"use client";

import { useParams } from "next/navigation";
import DmChat2 from "@/components/dm-chat2";
import OnlineFriendsPanel from "@/components/online-friends-panel";

export default function Home() {
  const params = useParams();
  const dmId = Array.isArray(params?.dmId) ? params.dmId[0] : params?.dmId;

  return (
    <div className={"flex h-full w-full"}>
      <div className="flex-1 min-w-0">
        <DmChat2 dmId={dmId} />
      </div>

      <OnlineFriendsPanel />
    </div>
  );
}

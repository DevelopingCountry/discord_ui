"use client";

import { Hash } from "lucide-react";
import { useDmStore } from "@/components/store/use-dm-store";

export default function DmName({ dmId }: { dmId: string }) {
  const { dmList } = useDmStore();
  const targetDm = dmList?.find((dm) => dm.dmId === dmId);
  return (
    <div className="flex items-center h-12 px-2 border-b border-[#1e1f22] shadow-sm">
      <Hash className="w-5 h-5 mr-2 text-[#96989d]" />
      <span className="text-white font-semibold">{targetDm?.targetNickname}</span>
    </div>
  );
}

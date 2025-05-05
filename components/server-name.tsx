"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useServerStore } from "@/components/store/use-server-store";
import { useState, useRef } from "react";
import ServerDropdown from "./server-dropdown";

export default function ServerName() {
  const serverId = usePathname().split("/")[2];
  console.log("현재 서버 name" + serverId);
  const [isActive, setIsActive] = useState(false);
  const { servers } = useServerStore();
  console.log(servers);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentServer = servers.find((server) => server.id === serverId);
  console.log("currentServer ", currentServer);
  const clickHandler = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex items-center justify-between py-4 h-12 border-b border-[#1e1f22] shadow-sm  hover:bg-[#35373c] cursor-pointer"
        onClick={clickHandler}
      >
        <h2 className="font-bold truncate text-white pl-4">{currentServer?.name || "서버 이름 없음"}</h2>

        {isActive ? (
          <ChevronUp className="w-4 h-4 text-white mr-3" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white mr-3" />
        )}
      </div>

      <ServerDropdown
        currentServer={currentServer}
        serverId={serverId}
        isOpen={isActive}
        onClose={() => setIsActive(!isActive)}
        serverName={currentServer?.name || "서버 이름 없음"}
      />
    </div>
  );
}

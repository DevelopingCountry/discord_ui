"use client";

import SectionFour from "@/public/homeDir/ui/sectionFour";
import SectionOneAndFour from "@/public/homeDir/ui/sectionOneAndFour";
import { usePathname } from "next/navigation";
import { useServerStore } from "@/components/store/use-server-store";

export default function Home() {
  const serverId = usePathname().split("/")[2];
  const { servers } = useServerStore();
  const currentServer = servers.find((server) => server.id === serverId);
  return (
    <SectionOneAndFour>
      {/*<SectionOne>*/}
      {/*  <div className={"text-white"}>welcomePage</div>*/}
      {/*</SectionOne>*/}
      <SectionFour>
        {/*<div className={"flex items-center justify-center text-white"}>welcomePage</div>*/}
        {/*<div className={"absolute bottom-0 z-20 w-full bg-discord1and4"}>/!*<MessageInput />*!/</div>*/}
        <section className="relative h-screen w-full bg-discord1and4 text-white flex flex-col items-center justify-center px-4">
          {/* Background Layer */}
          {/*<div className="absolute inset-0 z-0 opacity-20">*/}
          {/*  <Image src="/assets/friend.png" alt="Discord background" width={500} height={500} />*/}
          {/*</div>*/}

          {/* Main Welcome Content */}
          <div className="z-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to the {currentServer?.name}</h1>
            <p className="text-gray-300 mb-6">Feel free to hang out, chat, and vibe 🎧</p>
            <span className="text-white font-semibold px-6 py-2 rounded-lg shadow-md">Join the Chat</span>
          </div>
        </section>
      </SectionFour>
    </SectionOneAndFour>
  );
}

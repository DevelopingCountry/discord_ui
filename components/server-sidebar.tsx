"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Menu, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CreateServerModal } from "@/components/modal/server-create-modal";
// { servers }: { servers: { id: number; name: string; imageUrl: string }[] }
export default function ServerSidebar({ servers }: { servers: { id: number; name: string; imageUrl: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  // const { servers } = useServerStore();
  return (
    <div className="flex flex-col items-center min-w-[72px] bg-[#1e1f22] py-3 gap-2 overflow-y-auto hide-scrollbar h-screen">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-[24px] bg-[#313338] text-white hover:rounded-[16px] hover:bg-[#5865f2] transition-all duration-200",
                pathname === `/` ? "bg-[#5865f2]" : "bg-[#313338]",
              )}
              onClick={() => {
                router.push("/");
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

      {servers.map((server) => (
        <TooltipProvider key={server.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] text-white hover:rounded-[16px] hover:bg-[#5865f2] transition-all duration-200",
                  pathname.startsWith(`/servers/${server.id}`) ? "bg-[#5865f2]" : "bg-[#313338]",
                )}
                onClick={() => {
                  router.push(`/servers/${server.id}`);
                }}
              >
                {pathname.startsWith(`/servers/${server.id}`) && (
                  <div className="absolute left-0 w-1 h-10 bg-white rounded-r-full"></div>
                )}
                {server.imageUrl}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{server?.name || "서버 이름 없음"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] text-[#3ba55c] hover:rounded-[16px] hover:bg-[#3ba55c] hover:text-white transition-all duration-200"
              onClick={() => setIsCreateServerModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CreateServerModal isOpen={isCreateServerModalOpen} onClose={() => setIsCreateServerModalOpen(false)} />
    </div>
  );
}

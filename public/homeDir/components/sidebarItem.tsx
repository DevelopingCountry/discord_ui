"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";

const SidebarItem = ({ icon, label, isActive }: { icon: string; label: string; isActive: boolean }) => {
  const router = useRouter();
  return (
    <div
      className={`flex items-center p-2 mt-1 rounded-md cursor-pointer min-w-[160px] ${
        isActive ? "bg-gray-600 text-white" : "bg-discord2and3 text-gray-300 hover:bg-gray-600 hover:text-white"
      }`}
      onClick={() => router.push("/")}
    >
      <Image src={icon} alt={"User Avatar"} width={24} height={24} className={"rounded-full ml-2"} />
      <span className="ml-3 text-sm">{label}</span>
    </div>
  );
};

export default SidebarItem;

"use client";

import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";

const SidebarItem = ({ icon, label }: { icon: string; label: string }) => {
  const router = useRouter();
  const pathname = usePathname(); // ✅ 현재 경로 확인
  const isActive = pathname === `/channels/me`; // ✅ 현재 활성 DM인지 체크
  return (
    <div
      className={`flex items-center p-2 mt-1 rounded-md cursor-pointer min-w-[160px] ${
        isActive ? "bg-gray-600 text-white" : "bg-discord2and3 text-gray-300 hover:bg-gray-600 hover:text-white"
      }`}
      onClick={() => router.push("/channels/me/")}
    >
      <Image src={icon} alt={"User Avatar"} width={24} height={24} className={"rounded-full ml-2"} />
      <span className="ml-3 text-sm">{label}</span>
    </div>
  );
};

export default SidebarItem;

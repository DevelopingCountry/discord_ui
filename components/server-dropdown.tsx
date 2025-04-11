"use client";

import React, { useState } from "react";

import { Bell, Cog, Gift, UserPlus, X } from "lucide-react";
import { useRef, useEffect } from "react";
import { LeaveServerMdoal } from "@/components/modal/server-leave-modal";

interface ServerDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
}

export default function ServerDropdown({ isOpen, onClose, serverName }: ServerDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const [isLeaveServerModalOpen, setIsLeaveServerModalOpen] = useState(false);
  if (!isOpen) return null;
  const leaveHandler = () => {
    setIsLeaveServerModalOpen(!isLeaveServerModalOpen);
  };
  return (
    <div className="absolute top-12 left-0 w-60 bg-[#1e1f22] rounded-md shadow-lg z-50 text-white" ref={dropdownRef}>
      <div className="p-2 text-base font-semibold border-b border-[#35373c]">{serverName}</div>

      <div className="py-1">
        <DropdownItem icon={<Gift className="w-4 h-4" />} label="서버 부스트" />
      </div>

      <div className="border-t border-[#35373c] py-1">
        <DropdownItem icon={<UserPlus className="w-4 h-4" />} label="초대하기" />
        <DropdownItem icon={<Cog className="w-4 h-4" />} label="서버 설정" />
        {/*<DropdownItem icon={<Plus className="w-4 h-4" />} label="채널 만들기" />*/}
        {/*<DropdownItem icon={<FileText className="w-4 h-4" />} label="카테고리 만들기" />*/}
        {/*<DropdownItem icon={<Calendar className="w-4 h-4" />} label="이벤트 만들기" />*/}
        {/*<DropdownItem icon={<Users className="w-4 h-4" />} label="App 디렉터리" />*/}
      </div>

      <div className="border-t border-[#35373c] py-1">
        <DropdownItem icon={<Bell className="w-4 h-4" />} label="알림 설정" />
        {/*<DropdownItem icon={<Shield className="w-4 h-4" />} label="개인정보 보호 설정" />*/}
        {/*<DropdownItem icon={<Edit className="w-4 h-4" />} label="서버별 프로필 수정하기" />*/}
      </div>

      <div className="border-t border-[#35373c] py-1">
        <DropdownItem icon={<X className="w-4 h-4" color={"#FF0E3C"} />} label="서버 나가기" onClick={leaveHandler} />
      </div>
      <LeaveServerMdoal isOpen={isLeaveServerModalOpen} onClose={() => setIsLeaveServerModalOpen(false)} />
    </div>
  );
}

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
}

function DropdownItem({ icon, label, rightElement, onClick }: DropdownItemProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 hover:bg-[#5865f2] cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}

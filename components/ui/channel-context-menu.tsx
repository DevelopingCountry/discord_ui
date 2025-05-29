"use client";

import React, { useRef, useState, useEffect } from "react";
import { Trash2, Edit, Bell } from "lucide-react";

import { DeleteChannelModal } from "@/components/modal/channel/delete-channel-modal";
import { UpdateChannelModal } from "@/components/modal/channel/update-channel-modal";
import { useAuth } from "@/components/context/AuthContext";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  channelId: string;
  serverId: string;
  channelName: string;
  creatorId: string;
}

export function ChannelContextMenu({ x, y, onClose, channelId, serverId, channelName, creatorId }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 추가
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 추가
  const { userId } = useAuth();

  // 화면 밖으로 나가지 않도록 위치 조정
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // 메뉴 외부 클릭 감지
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // 이미 DeleteModal이 열려있으면 외부 클릭으로 ContextMenu만 닫지 않음
        if (!isDeleteModalOpen) {
          if (!isUpdateModalOpen) {
            console.log("modal을 닫습니다.1");
            onClose();
            return;
          }
        }

        if (!isUpdateModalOpen) {
          if (!isDeleteModalOpen) {
            console.log("modal을 닫습니다.2");
            onClose();
            return;
          }
        }
        // if (!isDeleteModalOpen && !isUpdateModalOpen) {
        //   console.log("modal을 닫습니다.");
        //   onClose();
        // }
      }
    };

    // 컨텍스트 메뉴 위치 조정
    const adjustPosition = () => {
      if (menuRef.current) {
        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let newX = x;
        let newY = y;

        // 오른쪽 경계 확인
        if (x + menuRect.width > viewportWidth) {
          newX = viewportWidth - menuRect.width - 10;
        }

        // 아래쪽 경계 확인
        if (y + menuRect.height > viewportHeight) {
          newY = viewportHeight - menuRect.height - 10;
        }

        setPosition({ x: newX, y: newY });
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", adjustPosition);

    // 초기 위치 조정
    adjustPosition();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", adjustPosition);
    };
  }, [x, y, onClose, isDeleteModalOpen, isUpdateModalOpen]);
  // --> isUpdateModalOpen을 추가하지 않으면 updateModalOpen 내부 클릭시 꺼진다?? 왜이럼?
  // 채널 삭제 모달 열기
  const handleOpenDeleteModal = () => {
    console.log("채널 삭제 모달 열기");
    setIsDeleteModalOpen(true);
  };

  // 채널 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    console.log("채널 삭제 모달 닫기");
    setIsDeleteModalOpen(false);
    onClose(); // 컨텍스트 메뉴도 함께 닫기
  };

  // 채널 업데이트 모달 열기
  const handleOpenUpdateChannel = () => {
    console.log("업데이트 모달 열기");
    setIsUpdateModalOpen(true);
  };
  // 채널 업데이트 모달 닫기
  const handleCloseUpdateModal = () => {
    console.log("업데이트 모달 닫기");
    setIsUpdateModalOpen(false);
    onClose(); // 컨텍스트 메뉴도 함께 닫기
  };
  return (
    <div
      ref={menuRef}
      className="absolute z-50 min-w-[180px] bg-[#18191c] rounded-md shadow-lg py-2 border border-[#2f3136]"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="text-[#b9bbbe] px-3 py-1 text-xs uppercase font-semibold">채널 관리</div>

      {/*<div*/}
      {/*  className="flex items-center px-3 py-2 text-[#dcddde] hover:bg-[#4752c4] cursor-pointer"*/}
      {/*  onClick={() => {*/}
      {/*    console.log("채널 설정");*/}
      {/*    onClose();*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Settings className="w-4 h-4 mr-2" />*/}
      {/*  <span className="text-sm">채널 설정</span>*/}
      {/*</div>*/}

      {creatorId === userId ? (
        <>
          <div
            className="flex items-center px-3 py-2 text-[#dcddde] hover:bg-[#4752c4] cursor-pointer"
            onClick={handleOpenUpdateChannel}
          >
            <Edit className="w-4 h-4 mr-2" />
            <span className="text-sm">이름 변경</span>
          </div>

          <div className="border-t border-[#2f3136] my-1"></div>

          <div
            className="flex items-center px-3 py-2 text-[#ed4245] hover:bg-[#ed4245] hover:text-white cursor-pointer"
            onClick={handleOpenDeleteModal}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="text-sm">채널 삭제</span>
          </div>
          <div className="flex items-center px-3 py-2 text-[#dcddde] hover:bg-[#4752c4] cursor-pointer">
            {/* 여기에 원하는 알림 설정 아이콘을 넣어도 됩니다 */}
            <Bell className="w-4 h-4 mr-2" />
            <span className="text-sm">알림 설정</span>
          </div>
        </>
      ) : (
        <div className="flex items-center px-3 py-2 text-[#dcddde] hover:bg-[#4752c4] cursor-pointer">
          {/* 여기에 원하는 알림 설정 아이콘을 넣어도 됩니다 */}
          <Bell className="w-4 h-4 mr-2" />
          <span className="text-sm">알림 설정</span>
        </div>
      )}
      <DeleteChannelModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onBack={handleCloseDeleteModal}
        channelName={channelName}
        channelId={channelId}
        serverId={serverId}
      />
      <UpdateChannelModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onBack={handleCloseUpdateModal}
        channelName={channelName}
        channelId={channelId}
        serverId={serverId}
      />
    </div>
  );
}

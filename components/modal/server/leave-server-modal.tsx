"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useLeaveServer } from "@/components/hooks/use-leave-server";

interface LeaveServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  serverName: string;
  serverId: string;
}

export const LeaveServerModal = ({ isOpen, onClose, onBack, serverName, serverId }: LeaveServerModalProps) => {
  const leaveServer = useLeaveServer();

  // 컴포넌트 렌더링 확인을 위한 로그
  useEffect(() => {
    if (isOpen) {
      console.log("LeaveChannelModal이 열렸습니다.", { serverId });
    }
  }, [isOpen, serverId]);

  // const handleSubmit = () => {
  //   // 여기에 서버 생성 로직 추가
  //   console.log("서버 생성:", { name: serverName, image: serverImage });
  //   onClose();
  // };
  const handleDelete = () => {
    console.log("채널 삭제");
    leaveServer.mutate({ serverId });
    onClose();
  };
  // const handleUpdate  = () => {
  //   console.log("채널 업데이트");
  //   deleteChannel.mutate({ serverId, channelId });
  //   onClose();
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#313338] text-white border-none max-w-md p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
      >
        {/*<DialogHeader className="p-0">*/}
        {/*  <div className="relative">*/}
        {/*    <Button*/}
        {/*      variant="ghost"*/}
        {/*      size="icon"*/}
        {/*      className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-transparent z-10"*/}
        {/*      onClick={onClose}*/}
        {/*    >*/}
        {/*      <X className="h-5 w-5" />*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</DialogHeader>*/}

        <div className="px-4 pt-4 pb-6 text-center">
          <DialogTitle className="text-2xl font-bold mb-2">{serverName} 떠나기</DialogTitle>
          <DialogDescription className="text-[#B5BAC1] text-center mb-6">
            이 서버에서 나가면 다시 초대를 받아야 하는데 정말 {serverName}에서 나가실 건가요?
          </DialogDescription>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" className="text-white hover:bg-[#4E5058] hover:text-white" onClick={onBack}>
              뒤로 가기
            </Button>
            <Button
              className="bg-[#f2113e] hover:bg-[#ff0f13] text-white"
              onClick={(e) => {
                e.stopPropagation();
                console.log("삭제 버튼 클릭");
                handleDelete();
              }}
            >
              나가기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

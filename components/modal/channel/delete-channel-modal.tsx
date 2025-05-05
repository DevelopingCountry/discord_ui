"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useDeleteChannel } from "@/components/hooks/use-delete-channel";

interface DeleteChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  channelName: string;
  channelId: string;
  serverId: string;
}

export const DeleteChannelModal = ({
  isOpen,
  onClose,
  onBack,
  channelName,
  channelId,
  serverId,
}: DeleteChannelModalProps) => {
  const deleteChannel = useDeleteChannel();

  // 컴포넌트 렌더링 확인을 위한 로그
  useEffect(() => {
    if (isOpen) {
      console.log("DeleteChannelModal이 열렸습니다.", { channelId, serverId });
    }
  }, [isOpen, channelId, serverId]);

  // const handleSubmit = () => {
  //   // 여기에 서버 생성 로직 추가
  //   console.log("서버 생성:", { name: serverName, image: serverImage });
  //   onClose();
  // };
  const handleDelete = () => {
    console.log("채널 삭제");
    deleteChannel.mutate({ serverId, channelId });
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
          <DialogTitle className="text-2xl font-bold mb-2">채널 나가기</DialogTitle>
          <DialogDescription className="text-[#B5BAC1] text-center mb-6">
            정말 {channelName}을 삭제할까요? 삭제하면 되돌릴 수 없어요
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

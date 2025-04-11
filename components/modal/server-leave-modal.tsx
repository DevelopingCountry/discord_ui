"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ChevronRight, Users, X } from "lucide-react";
import { useState } from "react";
import { CustomizeServerModal } from "./customize-server-modal";

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveServerMdoal = ({ isOpen, onClose }: CreateServerModalProps) => {
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  const handleCreateOwn = () => {
    setIsCustomizeModalOpen(true);
  };

  return (
    <>
      <Dialog
        open={isOpen && !isCustomizeModalOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent className="bg-[#313338] text-white border-none max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 text-gray-400 hover:text-white hover:bg-transparent z-10"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="px-4 pt-4 pb-6 text-center pt-10">
            <div>이 서버에서 나가면 다시 초대받아야 되는데 정말 나감?</div>

            <div className="space-y-2">
              <ServerOption
                icon={
                  <div className="bg-[#5865F2] p-2 rounded-full">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                }
                label="직접 만들기"
                onClick={handleCreateOwn}
              />

              {/*<div className="text-left text-xs text-[#B5BAC1] mt-4 mb-2 px-2">템플릿으로 시작</div>*/}

              {/*<ServerOption*/}
              {/*  icon={*/}
              {/*    <div className="bg-[#5865F2] p-2 rounded-full">*/}
              {/*      <GamepadIcon className="h-5 w-5 text-white" />*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  label="게임"*/}
              {/*  onClick={() => {}}*/}
              {/*/>*/}

              {/*<ServerOption*/}
              {/*  icon={*/}
              {/*    <div className="bg-[#EB459E] p-2 rounded-full">*/}
              {/*      <Heart className="h-5 w-5 text-white" />*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  label="친구"*/}
              {/*  onClick={() => {}}*/}
              {/*/>*/}

              {/*<ServerOption*/}
              {/*  icon={*/}
              {/*    <div className="bg-[#FEE75C] p-2 rounded-full">*/}
              {/*      <Users className="h-5 w-5 text-black" />*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  label="스터디 그룹"*/}
              {/*  onClick={() => {}}*/}
              {/*/>*/}

              {/*<ServerOption*/}
              {/*  icon={*/}
              {/*    <div className="bg-[#57F287] p-2 rounded-full">*/}
              {/*      <School className="h-5 w-5 text-white" />*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*  label="학교 클럽"*/}
              {/*  onClick={() => {}}*/}
              {/*/>*/}
            </div>

            <div className="mt-6 pt-6 border-t border-[#3F4147]">
              <div className="text-center mb-4">
                <p className="text-sm text-[#B5BAC1]">이미 초대장을 받으셨나요?</p>
              </div>
              <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white" onClick={() => {}}>
                서버 참가하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CustomizeServerModal
        isOpen={isCustomizeModalOpen}
        onClose={() => {
          setIsCustomizeModalOpen(false);
          onClose();
        }}
        onBack={() => setIsCustomizeModalOpen(false)}
      />
    </>
  );
};

interface ServerOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ServerOption = ({ icon, label, onClick }: ServerOptionProps) => {
  return (
    <button
      className="w-full flex items-center justify-between p-3 rounded-md hover:bg-[#3F4147] transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-[#B5BAC1]" />
    </button>
  );
};

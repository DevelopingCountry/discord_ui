"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Hash, Volume2, X } from "lucide-react";
import { useState } from "react";
import { useCreateChannel } from "@/components/hooks/use-create-channel";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  defaultType: "CHAT" | "VOICE";
}

export const CreateChannelModal = ({ isOpen, onClose, serverId, defaultType }: CreateChannelModalProps) => {
  const [channelType, setChannelType] = useState<"CHAT" | "VOICE">("CHAT");
  const [channelName, setChannelName] = useState("");
  const { mutate } = useCreateChannel();

  const handleClose = () => {
    setChannelName("");
    onClose();
  };
  const handleCreateChannel = () => {
    console.log("새 채널 생성:");
    console.log("새 채널 이름:", channelName);
    console.log("현 서버 id", serverId);
    mutate(
      {
        channelName: channelName,
        type: defaultType,
        serverId: serverId, // ✅ 여기 같이 넘김
      },
      {
        onSuccess: () => {
          onClose(); // 모달 닫기
        },
        onError: (err) => {
          console.error("채널 생성 실패:", err);
          // 필요하면 toast.error("서버 생성에 실패했습니다."); 등 추가 가능
        },
      },
    );
    // 여기에 채널 생성 로직 추가
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] text-white border-none max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">채널 만들기</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/*<DialogDescription className="text-[#B5BAC1] text-sm">자유채널에 추가 있음</DialogDescription>*/}
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#B5BAC1]">채널 유형</h4>
            <RadioGroup value={channelType} onValueChange={(value) => setChannelType(value as "CHAT" | "VOICE")}>
              {defaultType === "CHAT" ? (
                <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#3F4147]">
                  <div className="flex-1">
                    <Label htmlFor="text" className="text-sm font-medium">
                      텍스트
                    </Label>
                    <p className="text-xs text-[#B5BAC1]">메시지, 이미지, GIF, 이모지, 의견, 농담을 전송하세요</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#3F4147]">
                  <div className="flex-1">
                    <Label htmlFor="voice" className="text-sm font-medium">
                      음성
                    </Label>
                    <p className="text-xs text-[#B5BAC1]">음성, 영상, 화면 공유로 함께 어울려요</p>
                  </div>
                </div>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#B5BAC1]">채널 이름</h4>
            <div className="relative">
              {defaultType === "CHAT" ? (
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B5BAC1]" />
              ) : (
                <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B5BAC1]" />
              )}
              <Input
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="새로운 채널"
                className="pl-10 bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            {/*<div className="flex items-center justify-between">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <Lock className="h-4 w-4 text-[#B5BAC1]" />*/}
            {/*    <h4 className="text-sm font-medium">비공개 채널</h4>*/}
            {/*  </div>*/}
            {/*  <Switch*/}
            {/*    checked={isPrivate}*/}
            {/*    onCheckedChange={setIsPrivate}*/}
            {/*    className="data-[state=checked]:bg-[#5865f2]"*/}
            {/*  />*/}
            {/*</div>*/}
            {/*<p className="text-xs text-[#B5BAC1] pl-6">선택한 멤버들과 역할만 이 채널을 볼 수 있어요.</p>*/}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleClose} className="text-white hover:bg-[#4E5058] hover:text-white">
            취소
          </Button>
          <Button
            onClick={handleCreateChannel}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
            disabled={!channelName.trim()}
          >
            채널 만들기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Camera, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCreateServer } from "@/components/hooks/use-create-server";
import Image from "next/image";

interface CustomizeServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const CustomizeServerModal = ({ isOpen, onClose, onBack }: CustomizeServerModalProps) => {
  const [serverName, setServerName] = useState("김태완님의 서버");
  const [serverImage, setServerImage] = useState<string | null>(null);
  const { mutate } = useCreateServer();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setServerImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSubmit = () => {
  //   // 여기에 서버 생성 로직 추가
  //   console.log("서버 생성:", { name: serverName, image: serverImage });
  //   onClose();
  // };
  const handleSubmit = () => {
    console.log("서버만들기");
    mutate(
      { serverName: serverName, imageUrl: serverImage },
      {
        onSuccess: () => {
          onClose(); // 모달 닫기
        },
        onError: (err) => {
          console.error("서버 생성 실패:", err);
          // 필요하면 toast.error("서버 생성에 실패했습니다."); 등 추가 가능
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        <div className="px-4 pt-4 pb-6 text-center">
          <DialogTitle className="text-2xl font-bold mb-2">서버 커스터마이즈하기</DialogTitle>
          <DialogDescription className="text-[#B5BAC1] text-center mb-6">
            새로운 서버에 이름과 아이콘을 부여해 개성을 드러내 보세요. 나중에 언제든 바꿀 수 있어요.
          </DialogDescription>

          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${
                  serverImage ? "" : "border-2 border-dashed border-[#5865F2]"
                }`}
              >
                {serverImage ? (
                  <Image
                    src={serverImage || "/placeholder.svg"}
                    alt="Server Icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-[#5865F2] rounded-full p-2">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-[#5865F2] rounded-full p-1 cursor-pointer">
                  <label htmlFor="server-image" className="cursor-pointer">
                    <Plus className="h-4 w-4 text-white" />
                  </label>
                  <input
                    type="file"
                    id="server-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="text-xs text-[#B5BAC1] mt-2">UPLOAD</div>
            </div>

            <div className="w-full space-y-2">
              <div className="text-left text-xs font-semibold text-[#B5BAC1]">서버 이름</div>
              <Input
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="bg-[#1E1F22] border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="w-full text-left text-xs text-[#B5BAC1] mt-4">
              서버를 만들면 Discord의{" "}
              <a href="#" className="text-[#00A8FC] hover:underline">
                커뮤니티 지침
              </a>
              에 동의하게 됩니다.
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" className="text-white hover:bg-[#4E5058] hover:text-white" onClick={onBack}>
              뒤로 가기
            </Button>
            <Button
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
              onClick={handleSubmit}
              disabled={!serverName.trim()}
            >
              만들기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ title, description, variant = "default", duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  // 자동 닫기 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // 토스트가 사라질 때 애니메이션
  if (!isVisible) return null;

  // 변형에 따른 스타일 설정
  const variantStyles = {
    default: "bg-[#2b2d31] border-[#5865f2]",
    destructive: "bg-[#f23f42] border-[#f23f42] text-white",
    success: "bg-[#3ba55c] border-[#3ba55c] text-white",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-md border-l-4 p-4 shadow-md transition-all ${
        variantStyles[variant]
      }`}
    >
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-300">{description}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function NotificationPermissionBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (Notification.permission === "denied" || Notification.permission === "default") {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-[#2f3136] text-white border border-[#4f545c] rounded-lg shadow-lg p-4 w-80 z-50 animate-fade-in">
      <h4 className="text-base font-semibold mb-1">🔔 알림 권한이 꺼져 있어요</h4>
      <p className="text-sm text-[#b5bac1] mb-2">
        서버 초대, DM 등 중요한 알림을 받으려면 브라우저 알림을 허용해주세요.
      </p>
      <ul className="text-sm text-[#b5bac1] list-disc list-inside mb-2">
        <li>
          <strong>Chrome, Edge</strong>: 주소창 왼쪽 🔒 아이콘 → 사이트 설정 → 알림 허용
        </li>
        <li>
          <strong>Safari</strong>: 환경설정 → 웹사이트 → 알림
        </li>
        <li>
          <strong>Firefox</strong>: 주소창 왼쪽 ⓘ 아이콘 → 권한 → 알림 허용
        </li>
      </ul>
      <button onClick={() => setShowBanner(false)} className="mt-1 text-sm text-blue-400 hover:text-blue-300">
        알겠어요, 닫기
      </button>
    </div>
  );
}

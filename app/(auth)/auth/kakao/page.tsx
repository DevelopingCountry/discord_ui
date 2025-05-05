"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";

export default function KakaoRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [handled, setHandled] = useState(false); // ✅ 중복 요청 방지
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || handled) return;
    setHandled(true); // ✅ 처리 시작
    if (code) {
      fetch(`http://localhost:8080/auth/login/kakao?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          const { accessToken } = data.response;
          console.log("accessToken [login]  " + accessToken);
          login(accessToken);
          document.cookie = `accessToken=${accessToken}; path=/;`;
          localStorage.setItem("accessToken", accessToken); // ✅ WebSocket용
          window.location.href = "/channels/me";
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err);
          router.push("/login");
        });
    }
  }, [searchParams, router, login, handled]);

  return <div>카카오 로그인 처리 중...</div>;
}

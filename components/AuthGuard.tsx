// components/AuthGuard.tsx
"use client";

import { useAuth } from "@/components/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const publicPaths = ["/", "/auth/kakao", "/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    // localStorage 불러올 시간 주기
    const timeout = setTimeout(() => {
      setChecked(true);
    }, 50); // 너무 길게 줄 필요 없음

    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    console.log("AuthGuard isAuthenticated:", isAuthenticated);
    console.log("AuthGuard isAuthenticated:", publicPaths.includes(path));
    console.log("AuthGuard isAuthenticated:", !isAuthenticated && !publicPaths.includes(path));

    if (checked && !isAuthenticated && !publicPaths.includes(path)) {
      router.replace("/login");
    }
  }, [isAuthenticated, path, router, checked]);

  return <>{children}</>;
}

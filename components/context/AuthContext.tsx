// context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  userId: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  settingUserId: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (token) setAccessToken(token);
    if (userId) setUserId(userId);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  };
  const settingUserId = (userId: string) => {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        accessToken,
        isAuthenticated: !!accessToken,
        login,
        logout,
        settingUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

"use client";

import { useEffect } from "react";
import { useServerStore } from "@/components/store/serverStore";

type servers = { id: number; name: string; imageUrl: string };

export const ServerHydrator = ({ servers }: { servers: servers[] }) => {
  const { setServers } = useServerStore();

  useEffect(() => {
    setServers(servers);
  }, [servers, setServers]);

  return null;
};

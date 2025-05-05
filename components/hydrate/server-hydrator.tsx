"use client";

import { useEffect } from "react";
import { useServerStore } from "@/components/store/use-server-store";
import { server } from "@/components/type/response";

export const ServerHydrator = ({ servers }: { servers: server[] }) => {
  const { setServers } = useServerStore();

  // useLayoutEffect(() => {
  //   setServers(servers);
  // }, [servers, setServers]);
  useEffect(() => {
    setServers(servers);
    console.log("hydrate component");
  }, [servers, setServers]);

  return null;
};

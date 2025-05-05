// components/hooks/use-ensure-servers.ts
"use client";

import { useEffect } from "react";
import { useServerStore } from "@/components/store/use-server-store";

export const useEnsureServers = () => {
  const { isFetched, setServers } = useServerStore();

  useEffect(() => {
    console.log("Fetching servers...");
    if (!isFetched) {
      fetch("http://localhost:8080/server")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.response)) {
            setServers(data.response);
          } else {
            console.error("response is not an array:", data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch servers:", err);
        });
    }
  }, [isFetched, setServers]);
};

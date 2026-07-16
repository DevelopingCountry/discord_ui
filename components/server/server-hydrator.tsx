"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { serversQueryKey } from "@/components/server/use-servers-query";
import { server } from "@/components/type/response";

export const ServerHydrator = ({ servers }: { servers: server[] }) => {
  const queryClient = useQueryClient();
  // render-phase seed (not useEffect) so the cache is populated before any
  // sibling/child useServersQuery() call mounts, avoiding a loading flash.
  useState(() => {
    queryClient.setQueryData(serversQueryKey, servers ?? []);
  });

  return null;
};

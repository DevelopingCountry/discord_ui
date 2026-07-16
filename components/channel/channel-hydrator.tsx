"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { channelsQueryKey } from "@/components/channel/use-channels-query";
import { channel } from "@/components/type/response";

export const ChannelHydrator = ({ serverId, channels }: { serverId: string; channels: channel[] }) => {
  const queryClient = useQueryClient();
  useState(() => {
    queryClient.setQueryData(channelsQueryKey(serverId), channels ?? []);
  });

  return null;
};

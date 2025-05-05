"use client";

import { useEffect } from "react";
import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";

export const ChannelHydrator = ({ channels }: { channels: channel[] }) => {
  const { setChannels } = useChannelStore();

  useEffect(() => {
    setChannels(channels);
  }, [channels, setChannels]);

  return null;
};

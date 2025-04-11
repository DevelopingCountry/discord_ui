"use client";

import { useEffect } from "react";
import { useChannelStore } from "@/components/store/useSearchStore";

type Channel = { id: number; name: string; type: string };

export const ChannelHydrator = ({ channels }: { channels: Channel[] }) => {
  const { setChannels } = useChannelStore();

  useEffect(() => {
    setChannels(channels);
  }, [channels, setChannels]);

  return null;
};

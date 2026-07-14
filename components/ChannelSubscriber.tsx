"use client";

import { useChannelStore } from "@/components/store/use-channel-store";
import { channel } from "@/components/type/response";
import { useSocketSubscribe } from "@/components/hooks/useSocketSubscribe";

interface ChannelSubscriberProps {
  serverId: string;
}

export default function ChannelSubscriber({ serverId }: ChannelSubscriberProps) {
  const addChannel = useChannelStore((state) => state.addChannel);
  const channels = useChannelStore((state) => state.channels);
  const setChannels = useChannelStore((state) => state.setChannels);

  useSocketSubscribe<channel & { serverId: string; action: "create" | "update" }>(
    serverId ? `/topic/server/${serverId}/channels` : null,
    (data) => {
      const { action, id, name, type, creatorId } = data;
      const filteredData: channel = { id, name, type, creatorId };
      if (action === "create") {
        addChannel(filteredData);
      }
      if (action === "update") {
        const updatedChannels = channels.map((channel) =>
          channel.id === data.id ? { ...channel, name: data.name } : channel,
        );
        setChannels(updatedChannels);
      }
    },
  );

  return null;
}

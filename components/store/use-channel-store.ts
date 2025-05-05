import { channel } from "@/components/type/response";
import { create } from "zustand/react";

interface ChannelState {
  channels: channel[];
  setChannels: (channels: channel[]) => void;
  addChannel: (channel: channel) => void;
  removeChannel: (channelId: string) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  // setChannels: (channels) => set({ channels }),
  setChannels: (channels) =>
    set((state) => ({
      ...state,
      channels,
    })),
  addChannel: (channel) =>
    set((state) => ({
      ...state,
      channels: [...state.channels, channel],
    })),
  removeChannel: (channelId) =>
    set((state) => ({
      ...state,
      channels: state.channels.filter((channel) => channel.id !== channelId),
    })),
}));

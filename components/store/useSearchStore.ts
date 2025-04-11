import { create } from "zustand/react";

type SearchState = {
  searchText: string;
  setSearchText: (text: string) => void;
};
type ActiveState = {
  isActive: string;
  setIsActive: (isActive: string) => void;
};
export const useSearchStore = create<SearchState>((set) => ({
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),
}));

export const useActiveStore = create<ActiveState>((set) => ({
  isActive: "모두",
  setIsActive: (active) => set({ isActive: active }),
}));

type Channel = { id: number; name: string; type: string };

interface ChannelState {
  channels: Channel[];
  setChannels: (channels: Channel[]) => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  setChannels: (channels) => set({ channels }),
}));

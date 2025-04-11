// store/serverStore.ts
import { create } from "zustand";

interface Server {
  id: number;
  name: string;
  imageUrl: string;
}

interface ServerState {
  servers: Server[];
  setServers: (servers: Server[]) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  setServers: (servers) => set({ servers }),
}));

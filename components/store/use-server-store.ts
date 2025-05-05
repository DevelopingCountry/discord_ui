// store/use-server-store.ts
import { create } from "zustand";
import { server } from "@/components/type/response";

interface ServerState {
  servers: server[];
  isFetched: boolean;
  setServers: (servers: server[]) => void;
  addServer: (server: server) => void;
  removeServer: (serverId: string) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  servers: [],
  isFetched: false,

  setServers: (servers) =>
    set((state) => ({
      ...state,
      servers,
      isFetched: true,
    })),
  addServer: (server) =>
    set((state) => ({
      ...state,
      servers: [...state.servers, server],
    })),
  removeServer: (serverId) =>
    set((state) => ({
      ...state,
      servers: state.servers.filter((server) => server.id !== serverId),
    })),
}));

import { create } from "zustand";

export interface InvitePayload {
  inviteId: number;
  serverImage: string;
  serverName: string;
  fromNickname: string;
  fromImageUrl: string;
  serverUrl: string;
}

interface InviteStore {
  invites: (InvitePayload & { key: number })[];
  addInvite: (invite: InvitePayload) => void;
  removeInvite: (key: number) => void;
}

export const useInviteStore = create<InviteStore>((set) => ({
  invites: [],
  addInvite: (invite) =>
    set((state) => ({
      invites: [...state.invites, { ...invite, key: Date.now() }],
    })),
  removeInvite: (key) =>
    set((state) => ({
      invites: state.invites.filter((i) => i.key !== key),
    })),
}));

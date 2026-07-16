import { create } from "zustand";
import { Profile } from "@/components/type/response";

interface ProfileState {
  profile: Profile | null;
  isFetched: boolean;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isFetched: false,

  setProfile: (profile) =>
    set(() => ({
      profile,
      isFetched: true,
    })),
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

type VoiceState = {
  connectedChannelId: number | null;
  connectToVoice: (channelId: number) => void;
  disconnectVoice: () => void;
};

export const useVoiceStore = create<VoiceState>()(
  persist(
    (set) => ({
      connectedChannelId: null,
      connectToVoice: (channelId) => set({ connectedChannelId: channelId }),
      disconnectVoice: () => set({ connectedChannelId: null }),
    }),
    {
      name: "discord-clone-voice", // localStorage에 저장될 키
    },
  ),
);

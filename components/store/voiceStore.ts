import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VoiceStore {
  connectedChannelId: string | null;
  channelParticipants: Record<string, string[]>;
  connectToVoice: (channelId: string) => void;
  disconnectFromVoice: () => void;
  addParticipant: (channelId: string, userId: string) => void;
  removeParticipant: (channelId: string, userId: string) => void;
}

export const useVoiceStore = create(
  persist<VoiceStore>(
    (set) => ({
      connectedChannelId: null,
      channelParticipants: {},

      connectToVoice: (channelId) => set({ connectedChannelId: channelId }),

      disconnectFromVoice: () => set({ connectedChannelId: null }),

      addParticipant: (channelId, userId) =>
        set((state) => ({
          channelParticipants: {
            ...state.channelParticipants,
            [channelId]: [...(state.channelParticipants[channelId] || []), userId],
          },
        })),

      removeParticipant: (channelId, userId) =>
        set((state) => ({
          channelParticipants: {
            ...state.channelParticipants,
            [channelId]: (state.channelParticipants[channelId] || []).filter((id) => id !== userId),
          },
        })),
    }),
    {
      name: "voice-store", // localStorage key
    },
  ),
);

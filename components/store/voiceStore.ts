import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VoiceStore {
  connectedChannelId: string | null;
  channelParticipants: Record<string, string[]>;
  isConnecting: boolean;
  connectionError: string | null;

  connectToVoice: (channelId: string) => void;
  disconnectFromVoice: () => void;
  addParticipant: (channelId: string, userId: string) => void;
  removeParticipant: (channelId: string, userId: string) => void;
  setConnecting: (connecting: boolean) => void;
  setConnectionError: (error: string | null) => void;
  clearParticipants: (channelId: string) => void;
}

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set) => ({
      connectedChannelId: null,
      channelParticipants: {},
      isConnecting: false,
      connectionError: null,

      connectToVoice: (channelId) =>
        set({
          connectedChannelId: channelId,
          connectionError: null,
        }),

      disconnectFromVoice: () =>
        set({
          connectedChannelId: null,
          isConnecting: false,
          connectionError: null,
        }),

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

      setConnecting: (connecting) => set({ isConnecting: connecting }),

      setConnectionError: (error) => set({ connectionError: error }),

      clearParticipants: (channelId) =>
        set((state) => ({
          channelParticipants: {
            ...state.channelParticipants,
            [channelId]: [],
          },
        })),
    }),
    {
      name: "voice-store",
      partialize: (state) => ({
        connectedChannelId: state.connectedChannelId,
      }),
    },
  ),
);

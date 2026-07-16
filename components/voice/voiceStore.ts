import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VoiceStore {
  connectedChannelId: string | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  remoteParticipantIds: string[];
  channelParticipants: Record<string, string[]>;
  connectToVoice: (channelId: string) => void;
  disconnectFromVoice: () => void;
  setMuted: (muted: boolean) => void;
  setVideoEnabled: (enabled: boolean) => void;
  setRemoteParticipantIds: (ids: string[]) => void;
  addParticipant: (channelId: string, userId: string) => void;
  removeParticipant: (channelId: string, userId: string) => void;
}

export const useVoiceStore = create(
  persist<VoiceStore>(
    (set) => ({
      connectedChannelId: null,
      isMuted: false,
      isVideoEnabled: false,
      remoteParticipantIds: [],
      channelParticipants: {},

      connectToVoice: (channelId) => set({ connectedChannelId: channelId }),

      disconnectFromVoice: () =>
        set({ connectedChannelId: null, isMuted: false, isVideoEnabled: false, remoteParticipantIds: [] }),

      setMuted: (muted) => set({ isMuted: muted }),

      setVideoEnabled: (enabled) => set({ isVideoEnabled: enabled }),

      setRemoteParticipantIds: (ids) => set({ remoteParticipantIds: ids }),

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
      name: "voice-store",
    },
  ),
);

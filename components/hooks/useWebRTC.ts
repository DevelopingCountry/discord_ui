"use client";

import { useCallback } from "react";
import { useVoiceStore } from "@/components/store/voiceStore";

const WS_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/^http/, "ws");
const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

// Module-level singletons — survive re-renders without a Provider
let ws: WebSocket | null = null;
let localStream: MediaStream | null = null;
const peers = new Map<string, RTCPeerConnection>();
export const remoteStreams = new Map<string, MediaStream>();
let activeChannelId: string | null = null;
let activeUserId: string | null = null;

export function getLocalStream() {
  return localStream;
}

function send(data: object) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function buildPeer(remoteUserId: string, onStreamsUpdate: () => void): RTCPeerConnection {
  const pc = new RTCPeerConnection(ICE_CONFIG);

  localStream?.getTracks().forEach((t) => pc.addTrack(t, localStream!));

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      send({
        type: "ice-candidate",
        channelId: activeChannelId,
        userId: activeUserId,
        targetUserId: remoteUserId,
        candidate: e.candidate,
      });
    }
  };

  pc.ontrack = (e) => {
    remoteStreams.set(remoteUserId, e.streams[0]);
    onStreamsUpdate();
  };

  return pc;
}

function cleanupAll() {
  ws?.close();
  ws = null;
  peers.forEach((pc) => pc.close());
  peers.clear();
  remoteStreams.clear();
  localStream?.getTracks().forEach((t) => t.stop());
  localStream = null;
  activeChannelId = null;
  activeUserId = null;
}

export function useWebRTC() {
  const { connectToVoice, disconnectFromVoice, setMuted, setVideoEnabled, setRemoteParticipantIds } = useVoiceStore();

  const onStreamsUpdate = useCallback(() => {
    setRemoteParticipantIds([...remoteStreams.keys()]);
  }, [setRemoteParticipantIds]);

  const connect = useCallback(
    async (channelId: string, userId: string, token: string) => {
      if (ws) {
        send({ type: "leave", channelId: activeChannelId, userId: activeUserId });
        cleanupAll();
        disconnectFromVoice();
      }

      try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setVideoEnabled(true);
      } catch {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          setVideoEnabled(false);
        } catch {
          alert("마이크 접근 권한이 필요합니다.");
          return;
        }
      }

      activeChannelId = channelId;
      activeUserId = userId;

      ws = new WebSocket(`${WS_BASE}/ws/voice?token=${token}`);

      ws.onopen = () => {
        send({ type: "join", channelId, userId });
        connectToVoice(channelId);
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data as string);
        const remoteId: string = data.userId;

        if (data.type === "user-joined" && localStream) {
          const pc = buildPeer(remoteId, onStreamsUpdate);
          peers.set(remoteId, pc);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          send({ type: "offer", channelId, userId, targetUserId: remoteId, offer });
        }

        if (data.type === "offer" && localStream) {
          const pc = buildPeer(remoteId, onStreamsUpdate);
          peers.set(remoteId, pc);
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          send({ type: "answer", channelId, userId, targetUserId: remoteId, answer });
        }

        if (data.type === "answer") {
          const pc = peers.get(remoteId);
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (data.type === "ice-candidate") {
          const pc = peers.get(remoteId);
          if (pc && data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        }

        if (data.type === "user-left") {
          peers.get(remoteId)?.close();
          peers.delete(remoteId);
          remoteStreams.delete(remoteId);
          onStreamsUpdate();
        }
      };

      ws.onclose = () => {
        cleanupAll();
        disconnectFromVoice();
        setRemoteParticipantIds([]);
      };

      ws.onerror = () => {
        cleanupAll();
        disconnectFromVoice();
        setRemoteParticipantIds([]);
      };
    },
    [connectToVoice, disconnectFromVoice, onStreamsUpdate, setVideoEnabled],
  );

  const disconnect = useCallback(() => {
    send({ type: "leave", channelId: activeChannelId, userId: activeUserId });
    cleanupAll();
    disconnectFromVoice();
    setMuted(false);
    setRemoteParticipantIds([]);
    setVideoEnabled(false);
  }, [disconnectFromVoice, setMuted, setRemoteParticipantIds, setVideoEnabled]);

  const toggleMute = useCallback(() => {
    const track = localStream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMuted(!track.enabled);
    }
  }, [setMuted]);

  const toggleVideo = useCallback(() => {
    const track = localStream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    }
  }, [setVideoEnabled]);

  return { connect, disconnect, toggleMute, toggleVideo };
}

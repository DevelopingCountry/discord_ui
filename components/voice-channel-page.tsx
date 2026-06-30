"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2 } from "lucide-react";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useWebRTC, getLocalStream, remoteStreams } from "@/components/hooks/useWebRTC";
import { useAuth } from "@/components/context/AuthContext";
import { useProfileStore } from "@/components/store/use-profile";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function VideoTile({ stream, label, muted = false }: { stream: MediaStream | null; label: string; muted?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  const hasVideo = stream?.getVideoTracks().some((t) => t.enabled && t.readyState === "live");

  return (
    <div className="relative bg-[#1e1f22] rounded-lg overflow-hidden aspect-video flex items-center justify-center">
      {hasVideo ? (
        <video ref={ref} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#5865f2] flex items-center justify-center text-3xl font-bold text-white">
            {label[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-[#b5bac1] text-sm">{label}</span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded-md">{label}</div>
    </div>
  );
}

export function VoiceChannelPage({
  channelId,
  channelName,
  serverId,
}: {
  channelId: string;
  channelName: string;
  serverId: string;
}) {
  const { connectedChannelId, isMuted, isVideoEnabled, remoteParticipantIds } = useVoiceStore();
  const { connect, disconnect, toggleMute, toggleVideo } = useWebRTC();
  const { userId, accessToken } = useAuth();
  const { profile } = useProfileStore();
  const [showControls, setShowControls] = useState(false);
  const [memberNicknames, setMemberNicknames] = useState<Record<string, string>>({});

  const isConnected = connectedChannelId === channelId;

  useEffect(() => {
    if (!accessToken || !serverId) return;
    axios
      .get(`${API}/server/${serverId}/members`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => {
        const map: Record<string, string> = {};
        for (const m of res.data.response ?? []) {
          map[m.userId] = m.nickname;
        }
        setMemberNicknames(map);
      })
      .catch(() => {});
  }, [accessToken, serverId]);

  const getNickname = (uid: string) => memberNicknames[uid] ?? uid;
  const localLabel = profile?.nickname ?? userId ?? "나";

  const handleJoin = async () => {
    if (!userId || !accessToken) return;
    await connect(channelId, userId, accessToken);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col flex-1 bg-[#313338]">
        <div className="flex items-center gap-2 h-12 px-4 border-b border-[#1e1f22] flex-shrink-0">
          <Volume2 className="w-5 h-5 text-[#96989d]" />
          <h3 className="font-bold text-white">{channelName}</h3>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-[#b5bac1] text-base">현재 음성 채널에 아무도 없어요</p>
          <button
            onClick={handleJoin}
            className="px-6 py-2 bg-white text-[#313338] font-semibold text-sm rounded hover:bg-[#e3e5e8] transition-colors"
          >
            음성 채널 참가하기
          </button>
        </div>
      </div>
    );
  }

  const localStream = getLocalStream();
  const allParticipants = remoteParticipantIds;

  return (
    <div className="flex flex-col flex-1 bg-[#313338] overflow-hidden">
      <div className="flex items-center gap-2 h-12 px-4 border-b border-[#1e1f22] flex-shrink-0">
        <Volume2 className="w-5 h-5 text-[#96989d]" />
        <h3 className="font-bold text-white">{channelName}</h3>
      </div>

      <div
        className="relative flex-1 p-4 overflow-auto"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div
          className={`grid gap-3 h-full ${
            allParticipants.length === 0
              ? "grid-cols-1 max-w-2xl mx-auto"
              : allParticipants.length <= 1
                ? "grid-cols-2"
                : allParticipants.length <= 3
                  ? "grid-cols-2"
                  : "grid-cols-3"
          }`}
        >
          <VideoTile stream={localStream} label={localLabel} muted />
          {allParticipants.map((uid) => (
            <VideoTile key={uid} stream={remoteStreams.get(uid) ?? null} label={getNickname(uid)} />
          ))}
        </div>

        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-[#1e1f22]/90 backdrop-blur-sm rounded-2xl transition-opacity duration-200 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isMuted ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#4e5058] text-white hover:bg-[#6d6f78]"
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isMuted ? "음소거" : "마이크"}
          </button>

          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !isVideoEnabled ? "bg-red-500 text-white hover:bg-red-600" : "bg-[#4e5058] text-white hover:bg-[#6d6f78]"
            }`}
          >
            {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            {isVideoEnabled ? "카메라" : "카메라 꺼짐"}
          </button>

          <button
            onClick={disconnect}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}

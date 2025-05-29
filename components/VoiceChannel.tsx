"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MoreHorizontal, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVoiceStore } from "@/components/store/voiceStore";
import { useAuth } from "@/components/context/AuthContext";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isSpeaking: boolean;
  isMuted: boolean;
  hasCamera: boolean;
  isCameraOn: boolean;
  stream?: MediaStream;
}

interface PeerConnection {
  connection: RTCPeerConnection;
  userId: string;
  isInitiator: boolean;
}

interface ParticipantVideoProps {
  participant: Participant;
  isLocal: boolean;
  localVideoRef?: React.RefObject<HTMLVideoElement | null> | null;
  gridSize: number;
}

interface SignalingMessage {
  type: string;
  userId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  targetUserId?: string;
  channelId?: string;
  isMuted?: boolean;
  isCameraOn?: boolean;
}

function ParticipantVideo({ participant, isLocal, localVideoRef, gridSize }: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const streamIdRef = useRef<string>("");
  const isMountedRef = useRef(true);

  // 컴포넌트 마운트 상태 추적
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getVideoSize = () => {
    if (gridSize === 1) return "w-96 h-72";
    if (gridSize <= 4) return "w-80 h-60";
    return "w-64 h-48";
  };

  // 안전한 비디오 요소 가져오기
  const getVideoElement = useCallback((): HTMLVideoElement | null => {
    if (!isMountedRef.current) {
      return null;
    }

    if (isLocal && localVideoRef?.current) {
      return localVideoRef.current;
    }
    if (!isLocal && videoRef.current) {
      return videoRef.current;
    }
    return null;
  }, [isLocal, localVideoRef]);

  // 비디오 재생 함수
  const playVideo = useCallback(
    async (videoElement: HTMLVideoElement | null) => {
      if (!videoElement || !isMountedRef.current) {
        return;
      }

      try {
        if (!videoElement.paused) {
          console.log(`🎥 이미 재생 중: ${participant.id}`);
          return;
        }

        console.log(`🎥 비디오 재생 시도: ${participant.id} (local: ${isLocal})`);

        // 메타데이터 로딩 대기
        if (videoElement.readyState < HTMLMediaElement.HAVE_METADATA) {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("메타데이터 로딩 타임아웃"));
            }, 3000);

            const handleLoadedMetadata = () => {
              clearTimeout(timeout);
              videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
              videoElement.removeEventListener("error", handleError);
              if (isMountedRef.current) {
                resolve();
              }
            };

            const handleError = () => {
              clearTimeout(timeout);
              videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
              videoElement.removeEventListener("error", handleError);
              reject(new Error("비디오 로딩 오류"));
            };

            videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
            videoElement.addEventListener("error", handleError);
          });
        }

        if (!isMountedRef.current) return;

        await videoElement.play();

        if (isMountedRef.current) {
          setIsPlaying(true);
          console.log(`✅ 비디오 재생 성공: ${participant.id}`);
        }
      } catch (error) {
        if (!isMountedRef.current) return;

        const err = error as Error;
        if (err.name === "AbortError") {
          console.log(`⚠️ 재생 요청이 중단됨 (정상): ${participant.id}`);
          return;
        }

        if (err.name === "NotAllowedError") {
          console.warn(`🔇 자동 재생이 차단됨: ${participant.id}`);
          return;
        }

        console.error(`❌ 비디오 재생 실패 (${participant.id}):`, error);
      }
    },
    [participant.id, isLocal],
  );

  // 스트림 설정 처리 - 개선된 버전
  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }

    // DOM 요소가 준비될 때까지 대기
    const waitForVideoElement = async () => {
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts && isMountedRef.current) {
        const video = getVideoElement();
        if (video) {
          return video;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      throw new Error("비디오 요소를 찾을 수 없음");
    };

    const setupStream = async () => {
      try {
        if (!participant.stream) {
          console.log(`❌ 스트림이 없음: ${participant.id}`);
          const video = getVideoElement();
          if (video) {
            video.srcObject = null;
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
          }
          return;
        }

        const currentStreamId = participant.stream.id;
        if (streamIdRef.current === currentStreamId) {
          console.log(`🔄 동일한 스트림, 건너뜀: ${participant.id}`);
          return;
        }

        console.log(`🎥 스트림 설정 시작: ${participant.name} (${participant.id})`);

        const video = await waitForVideoElement();

        if (!isMountedRef.current) return;

        // 기존 재생 정지
        if (!video.paused) {
          try {
            video.pause();
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
          } catch (error) {
            console.warn(`⚠️ 비디오 정지 실패: ${participant.id}`, error);
          }
        }

        // 새 스트림 설정
        video.srcObject = participant.stream;
        video.muted = isLocal;
        streamIdRef.current = currentStreamId;

        console.log(`🎥 스트림 설정 완료: ${participant.id} - ${currentStreamId}`);

        // 스트림이 활성화되면 재생
        if (participant.stream.active) {
          // 약간의 지연 후 재생 시도
          setTimeout(() => {
            if (isMountedRef.current && video && participant.stream?.active) {
              playVideo(video);
            }
          }, 300);
        } else {
          console.warn(`⚠️ 스트림이 비활성 상태: ${participant.id}`);
        }
      } catch (error) {
        console.error(`❌ 스트림 설정 실패: ${participant.id}`, error);
      }
    };

    setupStream();
  }, [participant.stream, participant.name, isLocal, getVideoElement, playVideo]);

  // 정리 함수
  useEffect(() => {
    return () => {
      const video = getVideoElement();
      if (video) {
        try {
          if (!video.paused) {
            video.pause();
          }
          video.srcObject = null;
        } catch (error) {
          console.warn(`⚠️ 비디오 정리 실패: ${participant.id}`, error);
        }
      }
      streamIdRef.current = "";
      if (isMountedRef.current) {
        setIsPlaying(false);
      }
    };
  }, [getVideoElement, participant.id]);

  return (
    <div
      className={`relative ${getVideoSize()} bg-[#2f3136] rounded-lg overflow-hidden border-2 ${
        participant.isSpeaking ? "border-green-500" : "border-transparent"
      } transition-all duration-200`}
    >
      {participant.isCameraOn && participant.stream ? (
        <video
          ref={isLocal ? localVideoRef : videoRef}
          autoPlay={false}
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            console.log(`📊 메타데이터 로드됨: ${participant.id}`);
          }}
          onPlay={() => {
            console.log(`▶️ 재생 시작: ${participant.id}`);
            if (isMountedRef.current) {
              setIsPlaying(true);
            }
          }}
          onPause={() => {
            console.log(`⏸️ 재생 정지: ${participant.id}`);
            if (isMountedRef.current) {
              setIsPlaying(false);
            }
          }}
          onError={(e) => {
            console.error(`❌ 비디오 오류: ${participant.id}`, e);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#2f3136]">
          <Avatar className="w-20 h-20">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="bg-[#5865f2] text-white text-2xl">
              {participant.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-sm font-medium">
          {participant.name}
          {isLocal && " (나)"}
        </div>

        <div className="absolute top-2 right-2">
          {participant.isMuted ? (
            <div className="bg-red-500 p-1 rounded-full">
              <MicOff className="w-4 h-4 text-white" />
            </div>
          ) : participant.isSpeaking ? (
            <div className="bg-green-500 p-1 rounded-full animate-pulse">
              <Mic className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="bg-gray-600 p-1 rounded-full">
              <Mic className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded">
          {participant.stream ? (
            <>
              스트림: {participant.stream.getVideoTracks().length}V/{participant.stream.getAudioTracks().length}A
              {isPlaying && " ▶️"}
              {isLocal && " (로컬)"}
            </>
          ) : (
            "스트림 대기중"
          )}
        </div>

        {participant.isSpeaking && (
          <div className="absolute inset-0 border-4 border-green-400 rounded-lg animate-pulse pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export default function VoiceChannel() {
  const {
    connectedChannelId,
    isConnecting,
    connectionError,
    disconnectFromVoice,
    setConnecting,
    setConnectionError,
    removeParticipant,
  } = useVoiceStore();

  const { userId } = useAuth();

  // 로컬 상태
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string>("");

  // WebRTC 관련
  const [peerConnections, setPeerConnections] = useState<Map<string, PeerConnection>>(new Map());
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const initializingRef = useRef(false);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  const initializeConnection = useCallback(async () => {
    if (initializingRef.current || isConnecting || connected) {
      console.log("⚠️ 이미 연결 중이거나 연결됨. 중복 연결 방지");
      return;
    }

    try {
      initializingRef.current = true;
      setConnecting(true);
      setConnectionError(null);
      setPermissionStatus("연결 준비 중...");

      await initializeMedia();
      await initializeWebSocket();

      setConnected(true);
      setPermissionStatus("연결 완료");
    } catch (error) {
      console.error("❌ 연결 초기화 실패:", error);
      setConnectionError("연결에 실패했습니다: " + (error as Error).message);
      setConnected(false);
    } finally {
      setConnecting(false);
      initializingRef.current = false;
    }
  }, [isConnecting, connected]);

  const cleanup = useCallback(() => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }

    peerConnections.forEach(({ connection }) => {
      connection.close();
    });
    setPeerConnections(new Map());

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      if (!localVideoRef.current.paused) {
        localVideoRef.current.pause();
      }
      localVideoRef.current.srcObject = null;
    }

    initializingRef.current = false;
  }, [webSocket, peerConnections]);

  useEffect(() => {
    if (connectedChannelId && !connected && !isConnecting && !initializingRef.current && userId) {
      console.log("🔄 채널 연결 시작:", connectedChannelId);
      initializeConnection();
    }

    return () => {
      if (connected || isConnecting) {
        console.log("🧹 연결 정리");
        cleanup();
      }
    };
  }, [connectedChannelId, connected, isConnecting, userId, initializeConnection, cleanup]);

  const initializeMedia = async () => {
    try {
      setPermissionStatus("미디어 권한 요청 중...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { max: 30 },
        },
      });

      localStreamRef.current = stream;
      console.log("🎥 로컬 스트림 생성됨:", stream.id);

      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;

      setIsCameraOn(hasVideo);
      setIsMuted(!hasAudio);

      // 로컬 비디오 설정을 약간 지연
      setTimeout(() => {
        if (localVideoRef.current && localStreamRef.current) {
          console.log("🎥 로컬 비디오 요소에 스트림 설정");
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;

          localVideoRef.current.play().catch((error) => {
            console.error("❌ 로컬 비디오 재생 실패:", error);
          });
        }
      }, 100);

      setPermissionStatus("미디어 준비 완료");

      const myParticipant: Participant = {
        id: userId!,
        name: "나",
        avatar: "/assets/discord_blue.png",
        isSpeaking: false,
        isMuted: !hasAudio,
        hasCamera: hasVideo,
        isCameraOn: hasVideo,
        stream: stream,
      };

      setParticipants([myParticipant]);
    } catch (error) {
      console.error("❌ 미디어 초기화 실패:", error);
      throw new Error("미디어 장치에 접근할 수 없습니다.");
    }
  };

  const initializeWebSocket = async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        setPermissionStatus("시그널링 서버 연결 중...");

        const token = localStorage.getItem("accessToken");
        const ws = new WebSocket(`ws://localhost:8080/ws/voice?token=${token}`);

        ws.onopen = () => {
          console.log("🔗 WebSocket 연결됨");
          setPermissionStatus("시그널링 연결됨");

          const joinMessage = {
            type: "join",
            channelId: connectedChannelId,
            userId: userId,
          };
          ws.send(JSON.stringify(joinMessage));

          setWebSocket(ws);
          resolve();
        };

        ws.onmessage = async (event) => {
          try {
            const data = JSON.parse(event.data) as SignalingMessage;
            await handleSignalingMessage(data);
          } catch (error) {
            console.error("❌ 메시지 파싱 오류:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("❌ WebSocket 오류:", error);
          reject(new Error("시그널링 서버 연결 실패"));
        };

        ws.onclose = (event) => {
          console.log("🔌 WebSocket 연결 종료:", event.code, event.reason);
          setWebSocket(null);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleSignalingMessage = async (data: SignalingMessage) => {
    const { type, userId: fromUserId, offer, answer, candidate, targetUserId } = data;

    if (fromUserId === userId) {
      return;
    }

    switch (type) {
      case "join":
      case "user-joined":
        if (fromUserId && !peerConnections.has(fromUserId)) {
          await createPeerConnection(fromUserId, true);

          setParticipants((prev) => {
            const exists = prev.find((p) => p.id === fromUserId);
            if (!exists) {
              return [
                ...prev,
                {
                  id: fromUserId,
                  name: `사용자 ${fromUserId.slice(-4)}`,
                  avatar: "/assets/discord_blue.png",
                  isSpeaking: false,
                  isMuted: true,
                  hasCamera: true,
                  isCameraOn: false,
                  stream: undefined,
                },
              ];
            }
            return prev;
          });
        }
        break;

      case "offer":
        if (targetUserId === userId && fromUserId && offer) {
          await handleOffer(fromUserId, offer);
        }
        break;

      case "answer":
        if (targetUserId === userId && fromUserId && answer) {
          await handleAnswer(fromUserId, answer);
        }
        break;

      case "ice-candidate":
        if (targetUserId === userId && fromUserId && candidate) {
          await handleIceCandidate(fromUserId, candidate);
        }
        break;

      case "leave":
      case "user-left":
        if (fromUserId) {
          removePeerConnection(fromUserId);
        }
        break;

      case "audio-toggle":
        if (fromUserId && data.isMuted !== undefined) {
          setParticipants((prev) => prev.map((p) => (p.id === fromUserId ? { ...p, isMuted: data.isMuted! } : p)));
        }
        break;

      case "video-toggle":
        if (fromUserId && data.isCameraOn !== undefined) {
          setParticipants((prev) =>
            prev.map((p) => (p.id === fromUserId ? { ...p, isCameraOn: data.isCameraOn! } : p)),
          );
        }
        break;
    }
  };

  const createPeerConnection = async (remoteUserId: string, shouldCreateOffer: boolean) => {
    try {
      const pc = new RTCPeerConnection(iceServers);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        console.log("🎥 원격 스트림 수신:", remoteStream.id, "from", remoteUserId);

        // 스트림 설정을 위한 지연
        setTimeout(() => {
          setParticipants((prev) => {
            const existing = prev.find((p) => p.id === remoteUserId);
            if (existing) {
              return prev.map((p) =>
                p.id === remoteUserId
                  ? {
                      ...p,
                      stream: remoteStream,
                      isCameraOn: remoteStream.getVideoTracks().length > 0 && remoteStream.getVideoTracks()[0].enabled,
                      isMuted: remoteStream.getAudioTracks().length === 0 || !remoteStream.getAudioTracks()[0].enabled,
                    }
                  : p,
              );
            } else {
              return [
                ...prev,
                {
                  id: remoteUserId,
                  name: `사용자 ${remoteUserId.slice(-4)}`,
                  avatar: "/assets/discord_blue.png",
                  isSpeaking: false,
                  isMuted: remoteStream.getAudioTracks().length === 0 || !remoteStream.getAudioTracks()[0].enabled,
                  hasCamera: true,
                  isCameraOn: remoteStream.getVideoTracks().length > 0 && remoteStream.getVideoTracks()[0].enabled,
                  stream: remoteStream,
                },
              ];
            }
          });
        }, 500); // 지연 시간 증가
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && webSocket) {
          webSocket.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              targetUserId: remoteUserId,
              channelId: connectedChannelId,
              userId: userId,
            }),
          );
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("🔗 피어 연결 상태:", pc.connectionState, "with", remoteUserId);
        if (pc.connectionState === "failed") {
          removePeerConnection(remoteUserId);
        }
      };

      setPeerConnections((prev) => {
        const newMap = new Map(prev);
        newMap.set(remoteUserId, {
          connection: pc,
          userId: remoteUserId,
          isInitiator: shouldCreateOffer,
        });
        return newMap;
      });

      if (shouldCreateOffer) {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        if (webSocket) {
          webSocket.send(
            JSON.stringify({
              type: "offer",
              offer: offer,
              targetUserId: remoteUserId,
              channelId: connectedChannelId,
              userId: userId,
            }),
          );
        }
      }
    } catch (error) {
      console.error("❌ 피어 연결 생성 실패:", error);
    }
  };

  const handleOffer = async (fromUserId: string, offer: RTCSessionDescriptionInit) => {
    try {
      let peerConn = peerConnections.get(fromUserId);
      if (!peerConn) {
        await createPeerConnection(fromUserId, false);
        peerConn = peerConnections.get(fromUserId);
      }

      const pc = peerConn?.connection;
      if (pc) {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        if (webSocket) {
          webSocket.send(
            JSON.stringify({
              type: "answer",
              answer: answer,
              targetUserId: fromUserId,
              channelId: connectedChannelId,
              userId: userId,
            }),
          );
        }
      }
    } catch (error) {
      console.error("❌ Offer 처리 실패:", error);
    }
  };

  const handleAnswer = async (fromUserId: string, answer: RTCSessionDescriptionInit) => {
    try {
      const peerConn = peerConnections.get(fromUserId);
      const pc = peerConn?.connection;

      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error("❌ Answer 처리 실패:", error);
    }
  };

  const handleIceCandidate = async (fromUserId: string, candidate: RTCIceCandidateInit) => {
    try {
      const peerConn = peerConnections.get(fromUserId);
      const pc = peerConn?.connection;

      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error("❌ ICE Candidate 처리 실패:", error);
    }
  };

  const removePeerConnection = (userId: string) => {
    const peerConn = peerConnections.get(userId);
    if (peerConn) {
      peerConn.connection.close();
      setPeerConnections((prev) => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    }

    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const disconnect = () => {
    if (webSocket) {
      webSocket.send(
        JSON.stringify({
          type: "leave",
          channelId: connectedChannelId,
          userId: userId,
        }),
      );
    }

    cleanup();

    setConnected(false);
    setParticipants([]);
    setIsCameraOn(false);
    setIsMuted(false);
    setPermissionStatus("");

    if (connectedChannelId && userId) {
      removeParticipant(connectedChannelId, userId);
    }
    disconnectFromVoice();
  };

  const toggleMicrophone = () => {
    if (!localStreamRef.current) {
      console.warn("⚠️ 로컬 스트림이 없습니다");
      return;
    }

    const newMutedState = !isMuted;
    console.log("🎤 마이크 상태 변경:", isMuted ? "켜짐" : "꺼짐");

    const audioTracks = localStreamRef.current.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !newMutedState;
      console.log("🎤 오디오 트랙 상태:", track.enabled ? "활성" : "비활성");
    });

    setIsMuted(newMutedState);

    setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isMuted: newMutedState } : p)));

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(
        JSON.stringify({
          type: "audio-toggle",
          userId: userId,
          isMuted: newMutedState,
          channelId: connectedChannelId,
        }),
      );
    }
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) {
      console.warn("⚠️ 로컬 스트림이 없습니다");
      return;
    }

    const newCameraState = !isCameraOn;
    console.log("📹 카메라 상태 변경:", isCameraOn ? "꺼짐" : "켜짐");

    const videoTracks = localStreamRef.current.getVideoTracks();
    videoTracks.forEach((track) => {
      track.enabled = newCameraState;
      console.log("📹 비디오 트랙 상태:", track.enabled ? "활성" : "비활성");
    });

    setIsCameraOn(newCameraState);

    setParticipants((prev) => prev.map((p) => (p.id === userId ? { ...p, isCameraOn: newCameraState } : p)));

    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(
        JSON.stringify({
          type: "video-toggle",
          userId: userId,
          isCameraOn: newCameraState,
          channelId: connectedChannelId,
        }),
      );
    }
  };

  // 화면 공유 기능
  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      console.log("🖥️ 화면 공유 시작");

      if (localStreamRef.current) {
        const videoTrack = displayStream.getVideoTracks()[0];

        // 피어 연결에서 비디오 트랙 교체
        peerConnections.forEach(({ connection }) => {
          const senders = connection.getSenders();
          const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video");
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          }
        });

        // 로컬 스트림 업데이트
        const oldVideoTracks = localStreamRef.current.getVideoTracks();
        oldVideoTracks.forEach((track) => {
          localStreamRef.current!.removeTrack(track);
          track.stop();
        });
        localStreamRef.current.addTrack(videoTrack);

        // 화면 공유가 종료되면 원래 카메라로 돌아가기
        videoTrack.onended = async () => {
          console.log("🖥️ 화면 공유 종료");
          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const newVideoTrack = cameraStream.getVideoTracks()[0];

            peerConnections.forEach(({ connection }) => {
              const senders = connection.getSenders();
              const videoSender = senders.find((sender) => sender.track && sender.track.kind === "video");
              if (videoSender) {
                videoSender.replaceTrack(newVideoTrack);
              }
            });

            if (localStreamRef.current) {
              const oldTracks = localStreamRef.current.getVideoTracks();
              oldTracks.forEach((track) => {
                localStreamRef.current!.removeTrack(track);
                track.stop();
              });
              localStreamRef.current.addTrack(newVideoTrack);
            }
          } catch (error) {
            console.error("❌ 카메라로 복귀 실패:", error);
          }
        };
      }
    } catch (error) {
      console.error("❌ 화면 공유 실패:", error);
    }
  };

  const getGridCols = () => {
    if (participants.length <= 1) return "grid-cols-1";
    if (participants.length <= 4) return "grid-cols-2";
    return "grid-cols-3";
  };

  if (!connectedChannelId) {
    return (
      <div className="flex items-center justify-center h-full text-white bg-[#36393f]">
        <div className="text-center">
          <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl mb-2">음성 채널에 참여하세요</h2>
          <p className="text-gray-400">좌측에서 음성 채널을 선택하여 참여할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-full text-white bg-[#36393f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl mb-2">음성 채널에 연결 중...</h2>
          <p className="text-gray-400">{permissionStatus}</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="flex items-center justify-center h-full text-white bg-[#36393f]">
        <div className="text-center max-w-md">
          <h2 className="text-xl mb-2 text-red-400">연결 오류</h2>
          <p className="text-gray-400 mb-4">{connectionError}</p>
          <button onClick={disconnect} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-colors">
            채널에서 나가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative bg-[#36393f]">
      {/* 디버그 정보 */}
      <div className="absolute top-4 left-4 text-xs text-white bg-black bg-opacity-75 p-3 rounded z-10 max-w-xs">
        <div className="font-bold mb-1">디버그 정보</div>
        <div>상태: {permissionStatus}</div>
        <div>참가자: {participants.length}명</div>
        <div>피어 연결: {peerConnections.size}개</div>
        <div>WebSocket: {webSocket ? "연결됨" : "끊김"}</div>
        <div>채널ID: {connectedChannelId}</div>
        <div>내 ID: {userId?.slice(-8)}</div>
        <div className="mt-2 text-yellow-300">
          참가자 목록:
          {participants.map((p) => (
            <div key={p.id} className="ml-2">
              • {p.name} ({p.id.slice(-4)})
              {p.stream
                ? ` [${p.stream.getVideoTracks().length}V/${p.stream.getAudioTracks().length}A]`
                : " [No Stream]"}
            </div>
          ))}
        </div>
      </div>

      {/* 참가자 그리드 */}
      <div className={`flex-1 p-4 grid ${getGridCols()} gap-4 place-items-center`}>
        {participants.map((participant) => (
          <ParticipantVideo
            key={participant.id}
            participant={participant}
            isLocal={participant.id === userId}
            localVideoRef={participant.id === userId ? localVideoRef : undefined}
            gridSize={participants.length}
          />
        ))}
      </div>

      {/* 통화 컨트롤 */}
      <div className="w-full flex justify-center mb-4 mt-4">
        <div className="bg-[#292b2f] px-4 py-2 rounded-full flex items-center justify-center gap-3 shadow-lg">
          <button
            onClick={toggleMicrophone}
            className={`rounded-full p-2 transition-colors ${
              isMuted ? "bg-red-500 hover:bg-red-600" : "bg-[#1e1f22] hover:bg-[#2b2d31]"
            }`}
            title={isMuted ? "마이크 켜기" : "마이크 끄기"}
          >
            {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
          </button>

          <button
            onClick={toggleCamera}
            className={`rounded-full p-2 transition-colors ${
              !isCameraOn ? "bg-red-500 hover:bg-red-600" : "bg-[#1e1f22] hover:bg-[#2b2d31]"
            }`}
            title={isCameraOn ? "카메라 끄기" : "카메라 켜기"}
          >
            {isCameraOn ? <Video className="h-6 w-6 text-white" /> : <VideoOff className="h-6 w-6 text-white" />}
          </button>

          <button
            onClick={startScreenShare}
            className="rounded-full p-2 bg-[#1e1f22] hover:bg-[#2b2d31] transition-colors"
            title="화면 공유"
          >
            <Monitor className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={disconnect}
            className="rounded-full p-2 bg-red-500 hover:bg-red-600 transition-colors"
            title="채널에서 나가기"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>

          <button className="rounded-full p-2 bg-[#1e1f22] hover:bg-[#2b2d31] transition-colors" title="더 보기">
            <MoreHorizontal className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* 연결 상태 표시 */}
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
            connected && webSocket ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          <div className={`w-2 h-2 rounded-full ${connected && webSocket ? "bg-green-300" : "bg-red-300"}`}></div>
          {connected && webSocket ? "연결됨" : "연결 끊김"}
        </div>
      </div>
    </div>
  );
}

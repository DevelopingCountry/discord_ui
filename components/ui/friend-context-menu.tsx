"use client";

import React, { useEffect, useState, useRef } from "react";
import { UserPlus, ChevronRight, User, Ban, UserMinus } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { inviteToServer } from "@/lib/invite";
import { useServerStore } from "@/components/store/use-server-store";
import { useFriendsContext } from "@/components/context/friends-context";
import axios from "axios";

interface FriendContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  friendId: string;
  friendName: string;
}

export default function FriendContextMenu({ x, y, onClose, friendId, friendName }: FriendContextMenuProps) {
  const { accessToken } = useAuth();
  const { servers } = useServerStore();
  const { friendsData, setFriendsData } = useFriendsContext();
  const [showServerList, setShowServerList] = useState(false);
  const [serverListPosition, setServerListPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const serverListRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!menuRef.current?.contains(target) && !serverListRef.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  const handleInvite = async (serverId: string) => {
    try {
      if (!accessToken) return;
      await inviteToServer(serverId, friendId, accessToken);
      alert(`${friendName}님을 서버에 초대했습니다!`);
      onClose();
    } catch (error) {
      console.error("Failed to invite friend:", error);
      alert("서버 초대에 실패했습니다.");
    }
  };

  const handleDeleteFriend = async () => {
    try {
      if (!accessToken) return;
      await axios.delete(`http://localhost:8080/friend/${friendId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (friendsData && setFriendsData) {
        setFriendsData(friendsData.filter((friend) => friend.friendId !== friendId));
      }
      alert(`${friendName}님을 친구 목록에서 삭제했습니다.`);
      onClose();
    } catch (error) {
      console.error("Failed to delete friend:", error);
      alert("친구 삭제에 실패했습니다.");
    }
  };

  const handleBlock = async () => {
    try {
      if (!accessToken) return;
      await axios.post(
        `http://localhost:8080/friend/block/${friendId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      alert(`${friendName}님을 차단했습니다.`);
      onClose();
    } catch (error) {
      console.error("Failed to block friend:", error);
      alert("차단에 실패했습니다.");
    }
  };

  const handleProfile = () => {
    // TODO: 프로필 모달 또는 페이지로 이동
    console.log("View profile:", friendId);
    onClose();
  };

  const handleServerInviteEnter = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const listHeight = servers.length * 32;
    const centerY = rect.top + rect.height / 2;

    let top = centerY - listHeight / 2;
    if (top + listHeight > windowHeight) {
      top = windowHeight - listHeight - 10;
    }
    if (top < 0) {
      top = 10;
    }

    setServerListPosition({ top, left: rect.right + 5 });

    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowServerList(true);
  };

  const handleServerInviteLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowServerList(false);
    }, 50);
  };

  const handleServerListEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };

  const handleServerListLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setShowServerList(false);
    }, 50);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="fixed bg-[#313338] rounded-md shadow-lg py-1 w-48 z-50"
        style={{ top: y, left: x }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-2 py-1.5 text-sm text-[#b5bac1] hover:bg-[#42464d] hover:text-white cursor-pointer flex items-center justify-between"
          onMouseEnter={handleServerInviteEnter}
          onMouseLeave={handleServerInviteLeave}
        >
          <div className="flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            서버 초대하기
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>

        <div
          className="px-2 py-1.5 text-sm text-[#b5bac1] hover:bg-[#42464d] hover:text-white cursor-pointer flex items-center"
          onClick={handleProfile}
        >
          <User className="w-4 h-4 mr-2" />
          프로필
        </div>

        <div
          className="px-2 py-1.5 text-sm text-[#b5bac1] hover:bg-[#42464d] hover:text-white cursor-pointer flex items-center"
          onClick={handleDeleteFriend}
        >
          <UserMinus className="w-4 h-4 mr-2" />
          친구 삭제하기
        </div>

        <div
          className="px-2 py-1.5 text-sm text-red-500 hover:bg-[#42464d] hover:text-red-400 cursor-pointer flex items-center"
          onClick={handleBlock}
        >
          <Ban className="w-4 h-4 mr-2" />
          차단하기
        </div>
      </div>

      {showServerList && (
        <div
          ref={serverListRef}
          onMouseEnter={handleServerListEnter}
          onMouseLeave={handleServerListLeave}
          className="fixed bg-[#313338] rounded-md shadow-lg py-1 w-48 z-50"
          style={{ top: serverListPosition.top, left: serverListPosition.left }}
        >
          {servers.map((server) => (
            <div
              key={server.id}
              className="px-2 py-1.5 text-sm text-[#b5bac1] hover:bg-[#42464d] hover:text-white cursor-pointer"
              onClick={() => handleInvite(server.id)}
            >
              {server.name}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

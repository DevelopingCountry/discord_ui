// components/MessageActions.tsx
"use client";

import { ThumbsUp, Smile, Reply, MoreHorizontal } from "lucide-react";

export default function MessageActions({
  isMine,
  onReact,
  onEdit,
  onReply,
  onMore,
}: {
  isMine: boolean;
  onReact?: () => void;
  onEdit?: () => void;
  onReply?: () => void;
  onMore?: () => void;
}) {
  return (
    <div
      className={`absolute ${
        isMine ? "left-[-130px]" : "right-[-130px]"
      } top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 bg-[#1e1f22] rounded-md px-2 py-1 shadow-md z-20`}
    >
      <button onClick={onReact} className="text-white hover:scale-110 transition" title="이모지">
        <ThumbsUp size={16} />
      </button>
      <button onClick={onReply} className="text-white hover:scale-110 transition" title="답장">
        <Reply size={16} />
      </button>
      <button onClick={onEdit} className="text-white hover:scale-110 transition" title="편집">
        <Smile size={16} />
      </button>
      <button onClick={onMore} className="text-white hover:scale-110 transition" title="더 보기">
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}

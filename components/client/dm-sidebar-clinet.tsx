"use client";

import dynamic from "next/dynamic";

// 클라이언트 전용으로 dynamic import (이제 가능함!)
const ChannelSidebar = dynamic(() => import("@/components/channel-sidebar"), {
  ssr: false,
});

export default ChannelSidebar;

"use client";

import dynamic from "next/dynamic";

const ChannelSidebar = dynamic(() => import("@/components/channel/channel-sidebar"), {
  ssr: false,
});

export default ChannelSidebar;

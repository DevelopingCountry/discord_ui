"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function ServerIconButton({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  const [showTooltip, setToolTip] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/channel/${name}`);
  };

  return (
    <li className="relative pt-3">
      <button
        className={`w-11 h-11 rounded-full bg-discordDark flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 relative transition-all duration-300 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]
          ${imageUrl ? "hover:rounded-2xl" : "hover:rounded-2xl hover:bg-discordGreen"}
        `}
        onMouseEnter={() => setToolTip(true)}
        onMouseLeave={() => setToolTip(false)}
        onClick={handleClick}
      >
        <Image
          src={imageUrl}
          alt={"Server Icon"}
          width={30}
          height={30}
          className="w-full h-full object-cover transition-all duration-300 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)]"
          onMouseEnter={() => setToolTip(true)}
          onMouseLeave={() => setToolTip(false)}
          onClick={handleClick}
        />
      </button>

      {showTooltip && (
        <div className="absolute font-bold top-1/2 left-14 transform -translate-y-1/2 bg-gray-900 text-white text-md py-2 px-2 rounded-md shadow-lg z-50 whitespace-nowrap opacity-100 transition-opacity duration-300">
          {name}
          <div
            className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0
              border-t-[6px] border-t-transparent
              border-b-[6px] border-b-transparent
              border-r-[6px] border-r-gray-900"
          ></div>
        </div>
      )}
    </li>
  );
}

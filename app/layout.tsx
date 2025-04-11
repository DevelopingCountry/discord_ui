import type { Metadata } from "next";
import "./globals.css";
import SideUi from "@/public/ui/sideUi";

import ServerSidebar from "@/components/server-sidebar";

import { ServerHydrator } from "@/components/hydrate/server-hydrator";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const Servers = await fetch("http://localhost:8080/server");
  // const ServersData: { id: number, name: string, imageUrl: string,"createdAt": string }[] = await Servers.json();
  const servers = [
    { id: 1, name: "Discord Clone", imageUrl: "D" },
    { id: 2, name: "Gaming", imageUrl: "G" },
    { id: 3, name: "Coding", imageUrl: "C" },
    { id: 4, name: "Music", imageUrl: "M" },
  ];
  // const serverDataList = await fetch("http://localhost:8080/servers");
  // const serverData = await serverDataList.json();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServerHydrator servers={servers} />
        <div className="bg-discordSidebar w-screen h-screen flex overflow-x-hidden overflow-y-hidden">
          <SideUi>
            <ServerSidebar servers={servers} />
          </SideUi>
          {children}
        </div>
      </body>
    </html>
  );
}

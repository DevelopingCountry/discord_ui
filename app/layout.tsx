import type { Metadata } from "next";
import "./globals.css";
import SideUi from "@/public/ui/sideUi";
import ServerIconButton from "@/public/components/serverIconButton";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "discord ui",
  description: "Clone discord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="bg-discordSidebar w-screen h-screen  flex overflow-x-hidden">
          <SideUi>
            <ul>
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
              <ServerIconButton imageUrl={"/assets/discord_blue.png"} name={"me"} />
            </ul>
          </SideUi>
          {children}
        </div>
      </body>
    </html>
  );
}

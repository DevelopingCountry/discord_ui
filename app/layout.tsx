import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/provider/react-query-provider";
import AuthGuard from "@/components/AuthGuard";
import { AuthProvider } from "@/components/context/AuthContext";

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
  // Create a client
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <AuthGuard>
          <ReactQueryProvider>
            <body>{children}</body>
          </ReactQueryProvider>
        </AuthGuard>
      </AuthProvider>
    </html>
  );
}

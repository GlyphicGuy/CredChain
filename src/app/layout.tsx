import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CredChain | Issue Once. Verify Forever.",
  description: "A decentralized credential verification trusted system. Trust infrastructure for the modern era.",
};

import { DevPanel } from "@/components/dev/DevPanel";
import { ThreeBackground } from "@/components/three/ThreeBackground";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <ThreeBackground />
            <div className="relative z-10 min-h-screen flex flex-col">
              {children}
            </div>
          </Providers>
          <DevPanel />
          <Toaster richColors position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}

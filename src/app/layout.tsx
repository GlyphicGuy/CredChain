import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "CredChain | Issue Once. Verify Forever.",
  description: "A decentralized credential verification trusted system. Trust infrastructure for the modern era.",
};

import { DevPanel } from "@/components/dev/DevPanel";
import { ThreeBackground } from "@/components/three/ThreeBackground";
import { Navbar } from "@/components/shared/Navbar";
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
          className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} font-sans antialiased`}
        >
          <Providers>
            {/* Global SVG Noise Texture for Premium Physicality - Lighter for Light Mode */}
            <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            <ThreeBackground />
            <div className="relative z-10 min-h-screen flex flex-col">
              <Navbar />
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

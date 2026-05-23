"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Network, Wallet, Building2, Search } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Don't show navbar on public verifier profiles or landing page if desired,
  // but for global consistency, we'll show it everywhere except landing page perhaps?
  // Let's show it everywhere, but just styled nicely.
  if (pathname === '/') return null;

  const links = [
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/issuer", label: "Issuer Studio", icon: Building2 },
    { href: "/verify", label: "Verify", icon: Search },
  ];

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center py-4 px-4 pointer-events-none"
    >
      <div className="bg-white/80 backdrop-blur-xl border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-4 py-2 flex items-center gap-6 pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 pr-4 border-r border-black/[0.05] group">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Network className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold tracking-tight text-foreground hidden sm:block">CredChain</span>
        </Link>
        
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-black/[0.03] text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/[0.02]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {isSignedIn && (
          <div className="pl-4 border-l border-black/[0.05]">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: { avatarBox: "w-8 h-8 rounded-full border border-black/[0.05] shadow-sm" }
            }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

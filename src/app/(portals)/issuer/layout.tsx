import Link from "next/link";
import { LayoutDashboard, FileBadge, ShieldAlert, Settings, Network } from "lucide-react";

export default function IssuerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-40 w-full flex justify-center pb-4 px-4 pointer-events-none">
        <nav className="glass flex items-center gap-1 px-2 py-2 rounded-2xl pointer-events-auto bg-white/80 backdrop-blur-xl border border-black/[0.05] shadow-sm">
          <Link href="/issuer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
            <LayoutDashboard className="h-4 w-4" /> Studio
          </Link>
          <Link href="/issuer/issue" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
            <FileBadge className="h-4 w-4" /> Issue Proof
          </Link>
          <Link href="/issuer/records" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all">
            <ShieldAlert className="h-4 w-4" /> Network Records
          </Link>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 pt-12">
        {children}
      </main>
    </div>
  );
}

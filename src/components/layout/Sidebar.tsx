import Link from "next/link";
import { LayoutDashboard, FileBadge, ShieldAlert, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border/40 bg-card/30 backdrop-blur-md hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-foreground">CredChain</span>
          <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">ISSUER</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/issuer" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary/50 text-foreground hover:bg-secondary transition-colors">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link href="/issuer/issue" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
          <FileBadge className="h-4 w-4" /> Issue Credential
        </Link>
        <Link href="/issuer/records" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
          <ShieldAlert className="h-4 w-4" /> Records
        </Link>
        <Link href="/issuer/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </nav>
    </aside>
  );
}

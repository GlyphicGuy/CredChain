import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">CredChain</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/verify" className="hover:text-foreground transition-colors">Verify</Link>
          <Link href="/login">
            <Button variant="secondary" className="glass hover:bg-secondary text-foreground rounded-full px-6">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

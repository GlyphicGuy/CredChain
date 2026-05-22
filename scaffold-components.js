const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/Navbar.tsx': `import Link from "next/link";
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
            <Button variant="secondary" className="glass hover:bg-white/10 text-white rounded-full px-6">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}`,
  'src/components/layout/Sidebar.tsx': `import Link from "next/link";
import { LayoutDashboard, FileBadge, ShieldAlert, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border/40 bg-card/30 backdrop-blur-md hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">CredChain</span>
          <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">ISSUER</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/issuer" className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 text-white hover:bg-white/10 transition-colors">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
        <Link href="/issuer/issue" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
          <FileBadge className="h-4 w-4" /> Issue Credential
        </Link>
        <Link href="/issuer/records" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
          <ShieldAlert className="h-4 w-4" /> Records
        </Link>
        <Link href="/issuer/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </nav>
    </aside>
  );
}`,
  'src/components/shared/CredentialCard.tsx': `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export interface CredentialCardProps {
  title: string;
  issuer: string;
  date: string;
  status: "VALID" | "INVALID" | "REVOKED";
}

export function CredentialCard({ title, issuer, date, status }: CredentialCardProps) {
  const isOk = status === "VALID";
  
  return (
    <Card className={\`glass-card overflow-hidden transition-all hover:scale-[1.02] cursor-pointer relative \${isOk ? 'hover:neon-valid' : status === 'REVOKED' ? 'hover:neon-revoked' : 'hover:neon-invalid'}\`}>
      <div className={\`absolute top-0 left-0 w-full h-1 \${isOk ? 'bg-status-valid' : status === 'REVOKED' ? 'bg-status-revoked' : 'bg-status-invalid'}\`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className={\`\${isOk ? 'text-status-valid border-status-valid/30' : 'text-status-invalid border-status-invalid/30'}\`}>
            {isOk ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-xl font-semibold mt-4 text-white leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Issued by</p>
        <p className="font-medium text-gray-200">{issuer}</p>
      </CardContent>
    </Card>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content + '\n');
});
console.log('Components scaffolded.');

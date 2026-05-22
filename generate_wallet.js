const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(portals)/wallet/layout.tsx': `export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">CredChain</span>
            <span className="text-xs font-medium bg-secondary text-white px-2 py-0.5 rounded-full">WALLET</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10" />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}`,
  'src/app/(portals)/wallet/page.tsx': `"use client";
import { useState } from "react";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, Link2, Copy, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletDashboard() {
  const [selectedCred, setSelectedCred] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const credentials = [
    { id: 1, title: "B.Sc Computer Science", issuer: "Stanford University", date: "May 20, 2026", status: "VALID" as const },
    { id: 2, title: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "April 15, 2026", status: "VALID" as const },
    { id: 3, title: "Data Engineering Bootcamp", issuer: "TechAcademy", date: "Jan 10, 2025", status: "REVOKED" as const },
  ];

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Credentials</h1>
        <p className="text-muted-foreground">Manage and share your verifiable digital credentials.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {credentials.map((cred, i) => (
          <motion.div key={cred.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedCred(cred)}>
            <CredentialCard {...cred} />
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedCred} onOpenChange={() => setSelectedCred(null)}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Share Verification</DialogTitle>
            <DialogDescription>
              Share cryptographic proof of your {selectedCred?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6 py-6">
            <div className="w-48 h-48 bg-white rounded-xl p-4 flex items-center justify-center relative group overflow-hidden">
               <QrCode className="w-full h-full text-black" />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                 <span className="text-white font-medium">Click to expand</span>
               </div>
            </div>
            
            <div className="w-full space-y-2">
              <label className="text-sm font-medium text-gray-400">Verification Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-300 font-mono truncate">
                  https://credchain.network/verify/{selectedCred?.id}-proof
                </div>
                <Button size="icon" variant="outline" className="shrink-0 border-white/20 glass" onClick={copyLink}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white" />}
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground max-w-[280px]">
              This shares a Zero-Knowledge proof. The verifier will not see your private data.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content + '\n');
});
console.log('Wallet portal generated.');

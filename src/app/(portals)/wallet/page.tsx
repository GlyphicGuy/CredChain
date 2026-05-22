"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState } from "react";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, QrCode, ScanLine, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function WalletDashboard() {
  const [selectedCred, setSelectedCred] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ["student-wallet"],
    queryFn: async () => {
      const res = await fetchWithAuth('http://localhost:3002/credentials/wallet');
      if (!res.ok) throw new Error("Failed to fetch wallet credentials");
      return res.json();
    },
    select: (data) => data.map((item: any) => ({
      id: item.credentialHash,
      title: item.credentialTitle,
      issuer: item.institution?.name,
      date: new Date(item.issueDate || item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      status: item.status
    })),
    refetchInterval: 3000
  });

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out px-4 py-8 pb-32 md:pb-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-medium tracking-tight text-foreground">Digital Wallet</h1>
        <p className="text-muted-foreground font-light text-lg">Your mathematically proven credentials, ready to share.</p>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center text-muted-foreground/50">
          <Loader2 className="w-16 h-16 mb-4 animate-spin opacity-50" />
          <p className="text-xl font-light">Loading your wallet...</p>
        </div>
      ) : credentials.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-secondary/20 rounded-3xl border border-dashed border-border/50">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border shadow-sm">
            <ScanLine className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Your wallet is empty</h3>
          <p className="text-muted-foreground max-w-xs text-center font-light">No credentials yet. Wait for an institution to issue you one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-12">
          {credentials.map((cred: any, i: number) => (
            <motion.div 
              key={cred.id} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
              onClick={() => setSelectedCred(cred)}
            >
              <CredentialCard {...cred} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Share Sheet Modal */}
      <AnimatePresence>
        {selectedCred && (
          <Dialog open={!!selectedCred} onOpenChange={() => setSelectedCred(null)}>
            <DialogContent className="glass-card border-border/40 sm:max-w-sm rounded-[2.5rem] p-8 overflow-hidden outline-none">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
              
              <DialogHeader className="space-y-1 pb-6 text-center border-b border-border/50">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-primary" />
                </div>
                <DialogTitle className="text-2xl font-medium tracking-tight text-foreground">Share Proof</DialogTitle>
                <p className="text-sm text-muted-foreground font-light">
                  Instantly verify {selectedCred.title}
                </p>
              </DialogHeader>
              
              <div className="flex flex-col items-center space-y-8 pt-8">
                {/* QR Code */}
                <div className="bg-white p-4 rounded-3xl shadow-xl border border-black/5 dark:border-white/10 ring-8 ring-primary/5">
                  <QRCodeSVG 
                    value={`https://credchain.network/verify?hash=${selectedCred.id}`}
                    size={200}
                    level="Q"
                    includeMargin={false}
                  />
                </div>
                
                {/* Link Copier */}
                <div className="w-full space-y-3">
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl bg-secondary/50 border-border/50 hover:bg-secondary/80 justify-between px-6 shadow-sm transition-all" 
                      onClick={copyLink}
                    >
                      <span className="text-muted-foreground font-mono text-sm truncate max-w-[200px]">
                        ...verify?hash={selectedCred.id.substring(0, 12)}
                      </span>
                      {copied ? <CheckCircle2 className="w-5 h-5 text-status-valid" /> : <Copy className="w-5 h-5 text-foreground" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-2xl p-4 w-full text-center border border-border/30">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero-Knowledge share. The verifier will only see the mathematical proof of authenticity, not your private data.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}


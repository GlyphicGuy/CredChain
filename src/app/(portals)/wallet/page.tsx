"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect } from "react";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, CheckCircle2, QrCode, ScanLine, Loader2, UserCircle, Briefcase, Download, FileText, Send } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { toast } from "sonner";

export default function WalletDashboard() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [selectedCred, setSelectedCred] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [devEmail, setDevEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credentials' | 'request'>('credentials');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(^| )dev_role=([^;]+)/);
      if (match) {
        if (match[2] === 'student-alice') setDevEmail('alice@credchain.dev');
        if (match[2] === 'student-bob') setDevEmail('bob@credchain.dev');
        if (match[2] === 'student-charlie') setDevEmail('charlie@credchain.dev');
        if (match[2] === 'student-eve') setDevEmail('eve@credchain.dev');
      }
    }
  }, []);

  const displayEmail = devEmail || user?.primaryEmailAddress?.emailAddress || "your account";

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

  const demoMutation = useMutation({
    mutationFn: async () => {
      const res = await fetchWithAuth('http://localhost:3002/credentials/issue-demo', {
        method: 'POST'
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to generate demo credential");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-wallet"] });
      toast.success("Demo Credential Issued", {
        description: "Welcome to CredChain! Check out your new proof.",
      });
    },
    onError: (error: Error) => {
      toast.error("Generation Failed", { description: error.message });
    }
  });

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addToLinkedIn = () => {
    if (!selectedCred) return;
    const baseUrl = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
    const name = encodeURIComponent(selectedCred.title);
    const organizationName = encodeURIComponent(selectedCred.issuer || "CredChain Network");
    
    const d = new Date(selectedCred.date);
    const issueYear = d.getFullYear();
    const issueMonth = d.getMonth() + 1;
    const certUrl = encodeURIComponent(`https://credchain.network/verify?hash=${selectedCred.id}`);

    const url = `${baseUrl}&name=${name}&organizationName=${organizationName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out px-4 py-8 pb-32 md:pb-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-xs font-mono text-muted-foreground">
            <UserCircle className="w-4 h-4" />
            {displayEmail}
          </div>
          <Link href={`/p/${displayEmail}`}>
            <Button variant="outline" size="sm" className="h-7 rounded-full text-xs font-medium bg-background hover:bg-secondary">
              View Public Profile
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-semibold tracking-tighter text-foreground">Digital Wallet</h1>
        <p className="text-muted-foreground font-light text-lg">Your mathematically proven credentials, ready to share.</p>
      </div>

      <div className="flex justify-center w-full">
        <div className="bg-secondary/30 p-1.5 rounded-full flex gap-1 border border-border/50">
          <button 
            onClick={() => setActiveTab('credentials')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'credentials' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Credentials
          </button>
          <button 
            onClick={() => setActiveTab('request')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'request' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Request Credential
          </button>
        </div>
      </div>

      {activeTab === 'credentials' && (
        <>
          {isLoading ? (
            <div className="relative w-full max-w-md mx-auto h-[600px] mt-12 perspective-1000">
              <SkeletonCard />
            </div>
          ) : credentials.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-secondary/20 rounded-3xl border border-dashed border-border/50">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-border shadow-sm">
                <ScanLine className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Your wallet is empty</h3>
              <p className="text-muted-foreground max-w-xs text-center font-light mb-8">You haven't been issued any credentials yet.</p>
              <Button 
                onClick={() => demoMutation.mutate()}
                disabled={demoMutation.isPending}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8 shadow-lg transition-all"
              >
                {demoMutation.isPending ? "Generating..." : "Claim Demo Credential"}
              </Button>
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto h-[600px] mt-12 perspective-1000">
              {credentials.map((cred: any, i: number) => {
                const isSelected = selectedCred?.id === cred.id;
                const topOffset = i * 60;
                const scale = 1 - (credentials.length - 1 - i) * 0.05;
                const zIndex = isSelected ? 50 : i;

                return (
                  <motion.div 
                    key={cred.id} 
                    initial={{ opacity: 0, y: 100 }} 
                    animate={{ 
                      opacity: 1, 
                      y: isSelected ? 0 : topOffset, 
                      scale: isSelected ? 1.05 : scale,
                      rotateX: isSelected ? 0 : 5
                    }} 
                    transition={{ type: "spring", stiffness: 300, damping: 25 }} 
                    onClick={() => setSelectedCred(cred)}
                    drag={isSelected ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 200 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.y > 100) {
                        setSelectedCred(null);
                      }
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCred(isSelected ? null : cred);
                      } else if (e.key === 'Escape' && isSelected) {
                        setSelectedCred(null);
                      }
                    }}
                    className="absolute w-full cursor-pointer transform-gpu origin-top focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-8 rounded-[2rem]"
                    style={{ zIndex }}
                    aria-label={`Credential for ${cred.title}`}
                    aria-expanded={isSelected}
                  >
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] border border-black/[0.05] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-white/50">
                      <CredentialCard 
                        title={cred.credentialTitle}
                        issuer={cred.institution?.name}
                        date={new Date(cred.issueDate).toLocaleDateString()}
                        status={cred.status}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'request' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto w-full glass-card p-10 rounded-[2.5rem] border border-border/50 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-foreground">Request a Missing Credential</h3>
            <p className="text-muted-foreground font-light text-sm">
              If your institution has partnered with CredChain but your credential is not in your wallet, you can formally request an issuance.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2">Institution Name</label>
              <input type="text" placeholder="e.g. Stanford University" className="w-full h-12 bg-background border border-border/50 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2">Credential Type</label>
              <select className="w-full h-12 bg-background border border-border/50 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Professional Certificate</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-2">Graduation Year</label>
              <input type="text" placeholder="YYYY" className="w-full h-12 bg-background border border-border/50 rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
          </div>
          <Button className="w-full h-14 rounded-2xl bg-foreground text-background text-base shadow-lg hover:shadow-xl transition-all gap-2">
            Submit Request <Send className="w-4 h-4" />
          </Button>
        </motion.div>
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
                
                {/* Actions */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2 md:col-span-2">
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
                  <Button 
                    onClick={addToLinkedIn}
                    className="h-12 rounded-2xl bg-[#0077b5] text-white hover:bg-[#0077b5]/90 gap-2 shadow-sm"
                  >
                    <Briefcase className="w-4 h-4" /> Add to LinkedIn
                  </Button>
                  <Button 
                    onClick={() => window.print()}
                    variant="outline" 
                    className="h-12 rounded-2xl bg-background border-border/50 gap-2 hover:bg-secondary shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Save Record
                  </Button>
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


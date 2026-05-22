"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/shared/UploadZone";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, XCircle, Scan, Fingerprint, LockKeyhole, FileCheck2, Building2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

// Helper function to hash file locally
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<"IDLE" | "VALID" | "INVALID" | "REVOKED">("IDLE");
  const [report, setReport] = useState<any>(null);

  const verifyMutation = useMutation({
    mutationFn: async (hashToVerify: string) => {
      const response = await fetchWithAuth(`http://localhost:3002/credentials/verify/${hashToVerify}`);
      if (!response.ok) throw new Error("Verification failed");
      return response.json();
    },
    onSuccess: (data) => {
      setReport(data.record);
      setState(data.status as "VALID" | "INVALID" | "REVOKED");
    },
    onError: (error) => {
      console.error(error);
      setState("INVALID");
    }
  });

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (hash && state === "IDLE" && !verifyMutation.isPending) {
      verifyMutation.mutate(hash);
    }
  }, [searchParams]);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    try {
      const hash = await hashFile(file);
      verifyMutation.mutate(hash);
    } catch (e) {
      setState("INVALID");
    }
  };

  const resetState = () => {
    setState("IDLE");
    setReport(null);
    verifyMutation.reset();
  };

  const currentState = verifyMutation.isPending ? "PROCESSING" : state;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        
        {/* State: IDLE */}
        {currentState === "IDLE" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-3xl space-y-12 text-center mt-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Scan className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">Trust Scanner</h1>
              <p className="text-xl font-light text-muted-foreground max-w-xl mx-auto">Upload a document to begin verification.</p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="glass-card border-border/40 rounded-[2.5rem] p-4 relative overflow-hidden bg-secondary/20">
                <UploadZone onFileSelect={handleFileSelect} />
              </div>
            </div>

            <div className="flex justify-center items-center gap-8 text-muted-foreground font-light text-sm mt-12">
              <span className="flex items-center gap-2"><LockKeyhole className="w-4 h-4" /> Zero-Knowledge</span>
              <span className="flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Mathematical Proof</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Protected</span>
            </div>
          </motion.div>
        )}

        {/* State: PROCESSING */}
        {currentState === "PROCESSING" && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center space-y-12">
             <div className="relative w-40 h-40 flex items-center justify-center">
               <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping duration-[3000ms]" />
               <div className="absolute inset-4 border-2 border-primary/20 border-t-primary rounded-full animate-[spin_1.5s_cubic-bezier(0.68,-0.55,0.265,1.55)_infinite]" />
               <div className="absolute inset-8 border-2 border-secondary/20 border-b-foreground rounded-full animate-[spin_2s_linear_infinite_reverse]" />
               
               <Fingerprint className="w-12 h-12 text-foreground relative z-10" />
               
               {/* Scanline */}
               <motion.div 
                 className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent w-full h-[10px]"
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               />
             </div>
             
             <div className="text-center space-y-3">
               <motion.h2 className="text-3xl font-medium tracking-tight text-foreground">
                 Verifying Proof
               </motion.h2>
               <motion.p className="text-muted-foreground font-light text-lg">
                 Analyzing Protected signature...
               </motion.p>
             </div>
          </motion.div>
        )}

        {/* State: VALID */}
        {currentState === "VALID" && (
          <motion.div key="valid" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="bg-gradient-to-b from-status-valid/5 to-transparent border border-status-valid/20 rounded-[3rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.05)] text-center">
               
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-status-valid/20 rounded-full blur-[80px]" />
               <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-status-valid/10 rounded-full blur-[80px]" />

               <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-status-valid/10 rounded-3xl flex items-center justify-center mb-6 border border-status-valid/30 text-status-valid ring-8 ring-status-valid/5">
                   <FileCheck2 className="w-12 h-12" />
                 </div>
                 
                 <h2 className="text-4xl font-medium tracking-tight text-foreground mb-2">Verified Authentic</h2>
                 <p className="text-status-valid text-lg font-light mb-12">Protectedally proven against the trusted system.</p>
                 
                 <div className="w-full glass-card bg-background/50 rounded-2xl p-8 border border-border/50 text-left space-y-6">
                   <div className="space-y-1">
                     <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Recipient</p>
                     <p className="text-xl font-medium text-foreground">{report?.recipientName || "Loading..."}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Credential</p>
                     <p className="text-xl font-medium text-foreground">{report?.credentialTitle || "Loading..."}</p>
                   </div>
                   <div className="pt-4 border-t border-border/50 space-y-1">
                     <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Authorized Issuer</p>
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                         <Building2 className="w-4 h-4 text-muted-foreground" />
                       </div>
                       <p className="text-lg font-medium flex items-center gap-2">
                         {report?.institution?.name || "Loading..."}
                         <ShieldCheck className="w-4 h-4 text-status-valid" />
                       </p>
                     </div>
                   </div>
                   <div className="pt-4 border-t border-border/50 space-y-1 flex justify-between items-center">
                     <div>
                       <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Issued On</p>
                       <p className="text-sm font-medium text-foreground">{report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Loading..."}</p>
                     </div>
                     <div className="px-3 py-1 bg-status-valid/10 border border-status-valid/20 rounded-full text-xs font-semibold text-status-valid uppercase tracking-widest">
                       Verified Proof
                     </div>
                   </div>
                 </div>
                 
                 <Button onClick={resetState} className="mt-12 h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium transition-all shadow-soft w-full sm:w-auto">
                   Scan Another Document
                 </Button>
               </div>
            </div>
          </motion.div>
        )}

        {/* State: INVALID */}
        {currentState === "INVALID" && (
          <motion.div key="invalid" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="bg-gradient-to-b from-status-invalid/5 to-transparent border border-status-invalid/20 rounded-[3rem] p-10 relative overflow-hidden text-center shadow-[0_20px_50px_rgba(239,68,68,0.05)]">
               
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-status-invalid/20 rounded-full blur-[80px]" />

               <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-status-invalid/10 rounded-3xl flex items-center justify-center mb-6 border border-status-invalid/30 text-status-invalid ring-8 ring-status-invalid/5">
                   <XCircle className="w-12 h-12" />
                 </div>
                 
                 <h2 className="text-4xl font-medium tracking-tight text-foreground mb-2">Verification Failed</h2>
                 <p className="text-status-invalid text-lg font-light mb-8">No matching mathematical proof found.</p>
                 
                 <div className="w-full glass-card bg-background/50 rounded-2xl p-8 border border-status-invalid/20 text-center">
                   <p className="text-muted-foreground font-light leading-relaxed">
                     This document may have been forged, tampered with, or was never issued on the trusted system. <strong className="font-medium text-foreground">Do not trust this credential.</strong>
                   </p>
                 </div>
                 
                 <Button onClick={resetState} variant="outline" className="mt-12 h-14 px-8 rounded-full font-medium transition-all w-full sm:w-auto">
                   Try Again
                 </Button>
               </div>
            </div>
          </motion.div>
        )}

        {/* State: REVOKED */}
        {currentState === "REVOKED" && (
          <motion.div key="revoked" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="bg-gradient-to-b from-status-revoked/5 to-transparent border border-status-revoked/20 rounded-[3rem] p-10 relative overflow-hidden text-center shadow-[0_20px_50px_rgba(245,158,11,0.05)]">
               
               <div className="absolute -top-32 -left-32 w-64 h-64 bg-status-revoked/20 rounded-full blur-[80px]" />

               <div className="relative z-10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-status-revoked/10 rounded-3xl flex items-center justify-center mb-6 border border-status-revoked/30 text-status-revoked ring-8 ring-status-revoked/5">
                   <ShieldAlert className="w-12 h-12" />
                 </div>
                 
                 <h2 className="text-4xl font-medium tracking-tight text-foreground mb-2">Proof Revoked</h2>
                 <p className="text-status-revoked text-lg font-light mb-8">The authorized issuer explicitly invalidated this credential.</p>
                 
                 <div className="w-full glass-card bg-background/50 rounded-2xl p-8 border border-border/50 text-left space-y-6">
                   <div className="space-y-1">
                     <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Original Issuer</p>
                     <p className="text-xl font-medium text-foreground">{report?.institution?.name || "Loading..."}</p>
                   </div>
                   <div className="pt-4 border-t border-border/50 text-muted-foreground font-light text-sm">
                     While the Protected proof matches, the institution has flagged this credential as no longer valid.
                   </div>
                 </div>
                 
                 <Button onClick={resetState} className="mt-12 h-14 px-8 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium transition-all shadow-soft w-full sm:w-auto">
                   Scan Another
                 </Button>
               </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default function VerifyPortal() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Scan className="w-8 h-8 animate-pulse text-muted-foreground" /></div>}>
      <VerifyContent />
    </Suspense>
  );
}


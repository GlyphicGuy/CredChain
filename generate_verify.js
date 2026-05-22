const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(portals)/verify/page.tsx': `"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/shared/UploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, ShieldAlert, XCircle, Hash, Database, Link2 } from "lucide-react";

export default function VerifyPortal() {
  const [state, setState] = useState<"IDLE" | "PROCESSING" | "VALID" | "INVALID" | "REVOKED">("IDLE");

  const startVerification = (type: "VALID" | "INVALID" | "REVOKED") => {
    setState("PROCESSING");
    setTimeout(() => {
      setState(type);
    }, 4000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {state === "IDLE" && (
          <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl space-y-8 text-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Verify a Credential</h1>
              <p className="text-xl text-muted-foreground">Instantly verify cryptographic proofs on the CredChain network.</p>
            </div>
            
            <div className="glass-card border-white/10 rounded-3xl p-8 space-y-8">
              <UploadZone />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Paste Verification Link..." className="pl-10 h-12 bg-black/40 border-white/10 text-white text-lg" />
                </div>
                <Button className="h-12 px-8 bg-white text-black hover:bg-gray-200" onClick={() => startVerification("VALID")}>
                  Verify
                </Button>
              </div>
            </div>

            {/* Dev Controls */}
            <div className="flex gap-4 justify-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
               <span className="text-xs text-muted-foreground flex items-center mr-2">Simulate:</span>
               <Button size="sm" variant="outline" className="border-status-valid text-status-valid hover:bg-status-valid/10" onClick={() => startVerification("VALID")}>Valid</Button>
               <Button size="sm" variant="outline" className="border-status-invalid text-status-invalid hover:bg-status-invalid/10" onClick={() => startVerification("INVALID")}>Invalid</Button>
               <Button size="sm" variant="outline" className="border-status-revoked text-status-revoked hover:bg-status-revoked/10" onClick={() => startVerification("REVOKED")}>Revoked</Button>
            </div>
          </motion.div>
        )}

        {state === "PROCESSING" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center space-y-12">
             <div className="relative w-32 h-32">
               <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-[spin_1.5s_linear_infinite]" />
               <div className="absolute inset-2 border-4 border-secondary/20 border-b-secondary rounded-full animate-[spin_2s_linear_infinite_reverse]" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Hash className="w-10 h-10 text-white animate-pulse" />
               </div>
             </div>
             
             <div className="text-center space-y-2">
               <motion.h2 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 0.5 }}
                 className="text-2xl font-bold text-white"
               >
                 Generating Hash...
               </motion.h2>
               <motion.p 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 2 }}
                 className="text-muted-foreground"
               >
                 Comparing with blockchain records...
               </motion.p>
             </div>
          </motion.div>
        )}

        {state === "VALID" && (
          <motion.div key="valid" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
            <div className="glass-card neon-valid rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.65_0.2_145_/_15%),transparent_50%)]" />
               <div className="flex flex-col items-center text-center mb-8 relative z-10">
                 <div className="w-20 h-20 bg-status-valid/20 rounded-full flex items-center justify-center mb-4 border border-status-valid/50 shadow-[0_0_30px_oklch(0.65_0.2_145_/_30%)]">
                   <ShieldCheck className="w-10 h-10 text-status-valid" />
                 </div>
                 <h2 className="text-3xl font-bold text-white">Cryptographically Valid</h2>
                 <p className="text-status-valid mt-1">This credential matches the blockchain record.</p>
               </div>

               <div className="space-y-6 relative z-10">
                 <div className="bg-black/50 rounded-xl p-6 border border-white/5 space-y-4">
                   <div className="grid grid-cols-3 border-b border-white/10 pb-4">
                     <span className="text-muted-foreground">Recipient</span>
                     <span className="col-span-2 text-white font-medium">Alice Johnson</span>
                   </div>
                   <div className="grid grid-cols-3 border-b border-white/10 pb-4">
                     <span className="text-muted-foreground">Credential</span>
                     <span className="col-span-2 text-white font-medium">B.Sc Computer Science</span>
                   </div>
                   <div className="grid grid-cols-3">
                     <span className="text-muted-foreground">Issuer</span>
                     <span className="col-span-2 text-white font-medium">Stanford University</span>
                   </div>
                 </div>

                 <div className="bg-status-valid/5 border border-status-valid/20 rounded-xl p-4 font-mono text-xs space-y-2 break-all text-gray-400">
                   <p><span className="text-status-valid">Network:</span> Ethereum Mainnet</p>
                   <p><span className="text-status-valid">TxHash:</span> 0x8f2a1b9c4d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a</p>
                   <p><span className="text-status-valid">Timestamp:</span> May 20, 2026 14:30:00 UTC</p>
                 </div>
               </div>
               
               <div className="mt-8 flex justify-center">
                 <Button variant="outline" className="glass border-white/20 text-white" onClick={() => setState("IDLE")}>Verify Another</Button>
               </div>
            </div>
          </motion.div>
        )}

        {state === "INVALID" && (
          <motion.div key="invalid" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
            <div className="glass-card neon-invalid rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.6_0.25_25_/_15%),transparent_50%)]" />
               <div className="flex flex-col items-center text-center mb-8 relative z-10">
                 <div className="w-20 h-20 bg-status-invalid/20 rounded-full flex items-center justify-center mb-4 border border-status-invalid/50">
                   <XCircle className="w-10 h-10 text-status-invalid" />
                 </div>
                 <h2 className="text-3xl font-bold text-white">Verification Failed</h2>
                 <p className="text-status-invalid mt-1">The cryptographic hash does not match any known record.</p>
               </div>
               
               <div className="bg-black/50 rounded-xl p-6 border border-white/5 space-y-4 relative z-10 text-center">
                 <p className="text-gray-300">This document may have been tampered with or is completely forged. Do not trust this credential.</p>
               </div>
               
               <div className="mt-8 flex justify-center">
                 <Button variant="outline" className="glass border-white/20 text-white" onClick={() => setState("IDLE")}>Try Again</Button>
               </div>
            </div>
          </motion.div>
        )}

        {state === "REVOKED" && (
          <motion.div key="revoked" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
            <div className="glass-card neon-revoked rounded-3xl p-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.7_0.2_45_/_15%),transparent_50%)]" />
               <div className="flex flex-col items-center text-center mb-8 relative z-10">
                 <div className="w-20 h-20 bg-status-revoked/20 rounded-full flex items-center justify-center mb-4 border border-status-revoked/50">
                   <ShieldAlert className="w-10 h-10 text-status-revoked" />
                 </div>
                 <h2 className="text-3xl font-bold text-white">Credential Revoked</h2>
                 <p className="text-status-revoked mt-1">The issuer explicitly invalidated this record.</p>
               </div>
               
               <div className="bg-black/50 rounded-xl p-6 border border-white/5 space-y-4 relative z-10">
                 <div className="grid grid-cols-3 border-b border-white/10 pb-4">
                   <span className="text-muted-foreground">Original Issuer</span>
                   <span className="col-span-2 text-white font-medium">TechAcademy</span>
                 </div>
                 <div className="grid grid-cols-3">
                   <span className="text-muted-foreground">Revocation Date</span>
                   <span className="col-span-2 text-status-revoked font-medium">Feb 15, 2026</span>
                 </div>
               </div>
               
               <div className="mt-8 flex justify-center">
                 <Button variant="outline" className="glass border-white/20 text-white" onClick={() => setState("IDLE")}>Back</Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
console.log('Verify portal generated.');

"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/shared/UploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Network, CheckCircle2, QrCode, Building2, GraduationCap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Helper function to hash file locally
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex;
}

export default function IssueStudio() {
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [credentialType, setCredentialType] = useState("");
  const [documentHash, setDocumentHash] = useState<string | null>(null);

  const issueMutation = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('http://localhost:3002/credentials/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          studentEmail,
          credentialTitle: credentialType,
          documentHash,
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to issue");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-records"] });
      setIsSuccess(true);
      toast.success("Credential Issued", {
        description: "The proof has been successfully anchored to the blockchain.",
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Issuance Failed", {
        description: error.message || "System unreachable. Please check your connection.",
      });
    }
  });

  const handleIssue = () => {
    if (!recipientName || !credentialType || !studentEmail) {
      toast.error("Missing Information", { description: "Please fill out all required fields." });
      return;
    }
    issueMutation.mutate();
  };

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      const hash = await hashFile(file);
      setDocumentHash(hash);
    } else {
      setDocumentHash(null);
    }
  };

  const resetForm = () => {
    setRecipientName("");
    setStudentEmail("");
    setCredentialType("");
    setDocumentHash(null);
    setIsSuccess(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">Issue Proof</h1>
        <p className="text-muted-foreground font-light text-lg">Generate a mathematically proven credential.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-8">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Recipient Name</label>
                    <Input 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Jane Doe" 
                      className="bg-secondary/30 border-transparent focus-visible:border-border h-12 rounded-xl text-foreground text-lg shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Student Email</label>
                    <Input 
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="jane@example.com" 
                      className="bg-secondary/30 border-transparent focus-visible:border-border h-12 rounded-xl text-foreground text-lg shadow-inner" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1">Credential Title</label>
                    <Input 
                      value={credentialType}
                      onChange={(e) => setCredentialType(e.target.value)}
                      placeholder="e.g. Master of Science" 
                      className="bg-secondary/30 border-transparent focus-visible:border-border h-12 rounded-xl text-foreground text-lg shadow-inner" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-muted-foreground">Supporting Document (Optional)</label>
                    {documentHash && (
                      <span className="text-xs text-status-valid bg-status-valid/10 px-2 py-0.5 rounded font-mono">
                        {documentHash.substring(0, 10)}...
                      </span>
                    )}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border/50">
                    <UploadZone onFileSelect={handleFileSelect} />
                  </div>
                </div>

                <Button 
                  onClick={handleIssue} 
                  disabled={issueMutation.isPending || !recipientName || !credentialType || !studentEmail} 
                  className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-lg font-medium shadow-soft transition-all duration-300 relative overflow-hidden group"
                >
                  <AnimatePresence mode="wait">
                    {issueMutation.isPending ? (
                      <motion.div key="processing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3">
                        <Network className="w-5 h-5 animate-pulse" />
                        <span>Issuing to Network...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 group-hover:gap-3 transition-all">
                        <ShieldCheck className="w-5 h-5" />
                        <span>Generate Proof</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-8 rounded-3xl flex flex-col items-center text-center space-y-6 shadow-soft neon-valid"
              >
                <div className="w-20 h-20 rounded-full bg-status-valid/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-status-valid" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-foreground mb-2">Proof Issued</h3>
                  <p className="text-muted-foreground font-light">The credential is now securely issued and globally verifiable.</p>
                </div>
                <div className="flex gap-4 w-full pt-4">
                  <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={resetForm}>Issue Another</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] aspect-[1/1.4] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 bg-gradient-to-br from-secondary/80 to-background backdrop-blur-3xl group">
            
            {/* Card Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-700" />
            
            <div className="h-full flex flex-col justify-between relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center backdrop-blur-md">
                    <GraduationCap className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <div className="px-3 py-1 bg-foreground/5 rounded-full text-xs font-semibold tracking-wider uppercase border border-foreground/10">
                  Verified Proof
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                  Recipient
                </p>
                <h2 className={`text-4xl font-medium tracking-tight ${!recipientName ? 'text-muted-foreground/30' : 'text-foreground'} transition-colors duration-300`}>
                  {recipientName || "Name"}
                </h2>
                
                <div className="pt-4 space-y-1">
                  <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                    Credential
                  </p>
                  <p className={`text-2xl font-light ${!credentialType ? 'text-muted-foreground/30' : 'text-foreground'} transition-colors duration-300`}>
                    {credentialType || "Title"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between pt-8 border-t border-border/50">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Issued By</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">CredChain Institution</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center p-2">
                  <QrCode className="w-full h-full text-foreground/50" />
                </div>
              </div>
            </div>
            
            {/* Glass reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 dark:from-white/0 dark:via-white/0 dark:to-white/5 pointer-events-none" />
          </div>
        </div>

      </div>
    </div>
  );
}

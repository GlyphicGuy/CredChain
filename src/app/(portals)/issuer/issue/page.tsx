"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/shared/UploadZone";
import { SkeletonAnalytics } from "@/components/shared/SkeletonAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Network, CheckCircle2, QrCode, Building2, GraduationCap, Search, FileUp, Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'single' | 'batch' | 'manage'>('overview');
  
  // Batch states
  const [batchRecords, setBatchRecords] = useState<any[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await fetchWithAuth('http://localhost:3002/students');
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: records = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ["institution-records"],
    queryFn: async () => {
      const res = await fetchWithAuth('http://localhost:3002/credentials/records');
      if (!res.ok) return [];
      return res.json();
    },
    enabled: activeTab === 'manage' || activeTab === 'overview',
    refetchInterval: 5000
  });

  const totalIssued = records.length;
  const activeCount = records.filter((r: any) => r.status === 'VALID' || r.status === 'ISSUED').length;
  const revokedCount = records.filter((r: any) => r.status === 'REVOKED').length;

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
        return Promise.reject(new Error(errorData?.message || "Failed to issue"));
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

  const batchMutation = useMutation({
    mutationFn: async () => {
      const response = await fetchWithAuth('http://localhost:3002/credentials/issue-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentials: batchRecords
        })
      });
      if (!response.ok) throw new Error("Batch issue failed");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["institution-records"] });
      setIsSuccess(true);
      toast.success("Batch Issued", {
        description: `Successfully issued ${data.successful} credentials.`,
      });
      setBatchRecords([]);
    },
    onError: (error: Error) => {
      toast.error("Batch Issuance Failed", { description: error.message });
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async (hash: string) => {
      const response = await fetchWithAuth('http://localhost:3002/credentials/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });
      if (!response.ok) throw new Error("Revocation failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-records"] });
      toast.success("Credential Revoked", {
        description: "The blockchain state has been updated. Verifications will now fail.",
      });
    },
    onError: (error: Error) => {
      toast.error("Revocation Failed", { description: error.message });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsParsing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      // Assume CSV: name, email, title
      const records = lines.slice(1).map(line => {
        const [recipientName, studentEmail, credentialTitle] = line.split(',').map(s => s.trim());
        return { recipientName, studentEmail, credentialTitle };
      }).filter(r => r.recipientName && r.studentEmail && r.credentialTitle);
      
      setBatchRecords(records);
      setIsParsing(false);
    };
    reader.readAsText(file);
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

  const filteredStudents = students.filter((s: any) => 
    s.email.toLowerCase().includes(studentEmail.toLowerCase()) || 
    s.name.toLowerCase().includes(studentEmail.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter text-foreground mb-1">Issue Proof</h1>
          <p className="text-muted-foreground font-light text-lg">Generate mathematically proven credentials on the blockchain.</p>
        </div>
        <div className="bg-black/[0.03] p-1.5 rounded-full flex gap-1 border border-black/[0.05] shadow-inner">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'overview' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-foreground scale-100' : 'text-muted-foreground hover:text-foreground hover:bg-white/50 scale-95'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('single')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'single' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-foreground scale-100' : 'text-muted-foreground hover:text-foreground hover:bg-white/50 scale-95'}`}
          >
            Single Issue
          </button>
          <button 
            onClick={() => setActiveTab('batch')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'batch' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-foreground scale-100' : 'text-muted-foreground hover:text-foreground hover:bg-white/50 scale-95'}`}
          >
            Batch CSV
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'manage' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-foreground scale-100' : 'text-muted-foreground hover:text-foreground hover:bg-white/50 scale-95'}`}
          >
            Manage Records
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
        
        {activeTab === 'overview' && (
          <div className="lg:col-span-12 space-y-8">
            {isLoadingRecords ? (
              <SkeletonAnalytics />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-8 rounded-[2rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Total Issued</h3>
                  <p className="text-5xl font-semibold tracking-tighter text-foreground">{totalIssued}</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-status-valid/10 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-status-valid" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Active Proofs</h3>
                  <p className="text-5xl font-semibold tracking-tighter text-foreground">{activeCount}</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-status-invalid/10 flex items-center justify-center mb-6">
                    <QrCode className="w-6 h-6 text-status-invalid" />
                  </div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-2">Revoked</h3>
                  <p className="text-5xl font-semibold tracking-tighter text-foreground">{revokedCount}</p>
                </div>

              </motion.div>
            )}
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-10 rounded-[2.5rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground">Ready for Scale</h2>
                <p className="text-muted-foreground text-lg leading-relaxed font-light">
                  Your institution is connected to the CredChain network. You can issue thousands of immutable credentials instantly, entirely bypassing expensive legacy verification services.
                </p>
                <div className="pt-4">
                  <Button onClick={() => setActiveTab('batch')} className="h-12 px-8 rounded-full bg-foreground text-background shadow-lg text-sm font-semibold">
                    Start Batch Issuance
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 aspect-square rounded-[2rem] bg-gradient-to-br from-secondary to-background border border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] mix-blend-multiply" />
                 <ShieldCheck className="w-20 h-20 text-primary/20 absolute -top-4 -right-4" />
                 <div className="text-center z-10">
                   <div className="text-5xl font-bold tracking-tighter text-primary mb-2">100%</div>
                   <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Immutable</div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Left Column: Input Form */}
        {activeTab === 'single' && (
        <>
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
                  
                  {/* Student Search Dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Search Student Account</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <Input 
                        value={studentEmail}
                        onChange={(e) => {
                          setStudentEmail(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                        placeholder="e.g. alice@credchain.dev" 
                        className="bg-white border-black/[0.08] hover:border-black/[0.15] focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 h-14 rounded-2xl text-foreground text-base shadow-[0_2px_10px_rgba(0,0,0,0.02)] pl-12 transition-all" 
                      />
                    </div>
                    
                    <AnimatePresence>
                      {isDropdownOpen && filteredStudents.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-3xl border border-black/[0.08] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-50 overflow-hidden max-h-60 overflow-y-auto p-2"
                        >
                          {filteredStudents.map((s: any) => (
                            <button
                              key={s.id}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setRecipientName(s.name);
                                setStudentEmail(s.email);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-black/[0.03] rounded-xl transition-colors flex flex-col mb-1 last:mb-0"
                            >
                              <span className="font-semibold text-foreground text-sm">{s.name}</span>
                              <span className="text-xs text-muted-foreground">{s.email}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Recipient Name</label>
                      <Input 
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Jane Doe" 
                        className="bg-white border-black/[0.08] hover:border-black/[0.15] focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 h-14 rounded-2xl text-foreground text-base shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">Credential Title</label>
                      <Input 
                        value={credentialType}
                        onChange={(e) => setCredentialType(e.target.value)}
                        placeholder="Master of Science" 
                        className="bg-white border-black/[0.08] hover:border-black/[0.15] focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10 h-14 rounded-2xl text-foreground text-base shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all" 
                      />
                    </div>
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
                  <p className="text-muted-foreground font-light">The credentials are now securely issued and globally verifiable.</p>
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
          <div className="w-full max-w-[420px] aspect-[1/1.4] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/50 bg-gradient-to-br from-secondary/80 to-background backdrop-blur-3xl group">
            
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
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
          </div>
        </div>
        </>
        )}

        {activeTab === 'batch' && (
          <div className="lg:col-span-12 space-y-8">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div key="batch-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 glass-card p-8 rounded-[2.5rem] border border-border/50">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-medium text-foreground mb-2">Batch Issue via CSV</h2>
                    <p className="text-muted-foreground">Upload a CSV file containing <code className="bg-secondary/50 px-2 py-0.5 rounded text-sm">recipientName, studentEmail, credentialTitle</code> to issue thousands of records instantly.</p>
                  </div>
                  
                  <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  
                  {batchRecords.length === 0 ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border/50 rounded-3xl p-12 text-center hover:bg-secondary/20 transition-colors cursor-pointer group">
                      <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <FileUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-lg font-medium text-foreground mb-1">Click to upload CSV file</p>
                      <p className="text-sm text-muted-foreground">.csv up to 10MB</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-status-valid/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-status-valid" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{batchRecords.length} Records Found</p>
                            <p className="text-sm text-muted-foreground">Ready for cryptographic anchoring.</p>
                          </div>
                        </div>
                        <Button variant="ghost" onClick={() => setBatchRecords([])}>Cancel</Button>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto rounded-xl border border-border/50 bg-background/50">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-secondary/50 text-muted-foreground sticky top-0">
                            <tr>
                              <th className="px-4 py-3 font-medium">Name</th>
                              <th className="px-4 py-3 font-medium">Email</th>
                              <th className="px-4 py-3 font-medium">Credential</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/50">
                            {batchRecords.slice(0, 10).map((r, i) => (
                              <tr key={i} className="hover:bg-secondary/20">
                                <td className="px-4 py-3 font-medium text-foreground">{r.recipientName}</td>
                                <td className="px-4 py-3 text-muted-foreground">{r.studentEmail}</td>
                                <td className="px-4 py-3 text-muted-foreground">{r.credentialTitle}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {batchRecords.length > 10 && (
                          <div className="p-3 text-center text-sm text-muted-foreground border-t border-border/50 bg-secondary/20">
                            + {batchRecords.length - 10} more records
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={() => batchMutation.mutate()} 
                        disabled={batchMutation.isPending} 
                        className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-lg font-medium shadow-soft transition-all duration-300"
                      >
                        {batchMutation.isPending ? "Anchoring Batch to Network..." : `Issue ${batchRecords.length} Credentials`}
                      </Button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="batch-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 rounded-[3rem] flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-status-valid/10 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-status-valid" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-medium text-foreground mb-2">Batch Anchored</h3>
                    <p className="text-lg text-muted-foreground font-light max-w-md">All records have been cryptographically hashed and permanently issued to the network.</p>
                  </div>
                  <Button variant="outline" className="rounded-xl h-12 px-8 mt-4" onClick={resetForm}>Upload Another CSV</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        {activeTab === 'manage' && (
          <div className="lg:col-span-12 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-8 rounded-[2.5rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Issued Credentials</h2>
                <p className="text-muted-foreground">Manage and revoke existing cryptographic proofs anchored to the network.</p>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-black/[0.08]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-black/[0.02] text-muted-foreground sticky top-0 border-b border-black/[0.08]">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Recipient</th>
                      <th className="px-6 py-4 font-semibold">Credential</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.08]">
                    {isLoadingRecords ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading records...</td></tr>
                    ) : records.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No records found.</td></tr>
                    ) : (
                      records.map((r: any, i: number) => (
                        <tr key={i} className="hover:bg-black/[0.02] transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{r.studentName || 'Student'}</td>
                          <td className="px-6 py-4 text-muted-foreground">{r.credentialTitle}</td>
                          <td className="px-6 py-4">
                            {r.status === 'VALID' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-status-valid/10 text-status-valid">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-valid"></span> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-status-invalid/10 text-status-invalid">
                                <span className="w-1.5 h-1.5 rounded-full bg-status-invalid"></span> Revoked
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{new Date(r.createdAt || r.issueDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-right">
                            {r.status === 'VALID' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-status-invalid border-status-invalid/20 hover:bg-status-invalid hover:text-white"
                                onClick={() => {
                                  if (confirm("Are you sure you want to cryptographically revoke this credential? This action is permanent and immediate.")) {
                                    revokeMutation.mutate(r.credentialHash);
                                  }
                                }}
                                disabled={revokeMutation.isPending}
                              >
                                Revoke
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}

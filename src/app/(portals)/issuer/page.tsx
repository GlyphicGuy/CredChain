"use client";
import { motion } from "framer-motion";
import { FileBadge, ShieldAlert, CheckCircle2, Activity, ShieldCheck, Fingerprint, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { SecurityCore } from "@/components/3d/SecurityCore";

export default function TrustStudio() {
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["institution-records"],
    queryFn: async () => {
      const res = await fetchWithAuth("http://localhost:3002/credentials/records");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async (hash: string) => {
      const res = await fetchWithAuth(`http://localhost:3002/credentials/${hash}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-records"] });
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async (hash: string) => {
      const res = await fetchWithAuth(`http://localhost:3002/credentials/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });
      if (!res.ok) throw new Error("Failed to revoke");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institution-records"] });
    }
  });

  const totalIssued = records?.length || 0;
  const activeVerifications = records?.filter((r: any) => r.status === "VALID").length || 0;
  const revokedProofs = records?.filter((r: any) => r.status === "REVOKED").length || 0;

  const stats = [
    { title: "Total Proofs Issued", value: isLoading ? "-" : totalIssued, icon: FileBadge, color: "text-foreground" },
    { title: "Active Verifications", value: isLoading ? "-" : activeVerifications, icon: ShieldCheck, color: "text-status-valid" },
    { title: "Revoked Proofs", value: isLoading ? "-" : revokedProofs, icon: ShieldAlert, color: "text-status-revoked" },
    { title: "Network Status", value: "Healthy", icon: Activity, color: "text-status-valid" },
  ];

  return (
    <div className="w-full relative min-h-[85vh] animate-in fade-in duration-1000 ease-out pb-12">
      
      {/* 3D Immersive Background Header */}
      <div className="absolute top-0 left-0 right-0 h-[450px] overflow-hidden -mt-8 rounded-b-[4rem] bg-gradient-to-br from-indigo-50 via-white to-teal-50 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none" />
        {/* Animated Mesh Gradient Spheres behind the glass */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }} />
        <SecurityCore />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 relative z-20 pt-16 space-y-16">
        {/* Header Text */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/80 border border-border/50 rounded-full text-xs font-medium text-foreground uppercase tracking-widest backdrop-blur-xl shadow-sm">
            <Activity className="w-3.5 h-3.5 text-status-valid animate-pulse" />
            Network Live
          </div>
          <h1 className="text-5xl font-semibold tracking-tight text-foreground drop-shadow-sm">Trust Studio</h1>
          <p className="text-muted-foreground font-light text-xl max-w-lg mx-auto">Overview of your institution's cryptographically proven footprints.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="bg-background/40 backdrop-blur-2xl p-6 rounded-3xl border border-border/50 hover:border-border transition-all duration-300 h-full flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="flex flex-row items-center justify-between pb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-4xl font-semibold tracking-tight text-foreground">
                {isLoading ? <span className="animate-pulse bg-secondary/50 h-8 w-16 block rounded-md" /> : stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 mt-12">
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border border-border/50 shadow-xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground mb-6">Recent Anchors</h2>
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-transparent animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-secondary/50" />
                  <div className="flex-1 ml-4 space-y-2">
                    <div className="h-4 bg-secondary/50 rounded w-1/3" />
                    <div className="h-3 bg-secondary/50 rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : records?.length === 0 ? (
              <div className="text-center py-16 px-4 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                  <FileBadge className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No proofs issued yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start issuing verifiable, tamper-proof credentials to your students.</p>
                <Link href="/issuer/issue">
                  <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
                    Issue First Proof
                  </Button>
                </Link>
              </div>
            ) : (
              records?.slice(0, 4).map((record: any) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/40 group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center text-foreground shadow-sm group-hover:scale-105 transition-transform">
                      <Fingerprint className="w-5 h-5 opacity-70" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">{record.metadata?.course || record.credentialTitle}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">Proof ID: {record.credentialHash.substring(0, 10)}...</p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block mb-1 ${
                      record.status === "ISSUED" ? "bg-status-valid/10 text-status-valid" : "bg-status-revoked/10 text-status-revoked"
                    }`}>
                      {record.status === "ISSUED" ? "Issued" : "Revoked"}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <p className="text-xs text-muted-foreground block">
                        {new Date(record.issueDate || record.createdAt).toLocaleDateString()}
                      </p>
                      {record.status === "ISSUED" && (
                        <button 
                          onClick={() => revokeMutation.mutate(record.credentialHash)}
                          disabled={revokeMutation.isPending}
                          className="p-1 hover:bg-status-revoked/10 text-muted-foreground hover:text-status-revoked rounded-md transition-colors"
                          title="Revoke Credential"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMutation.mutate(record.credentialHash)}
                        className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="glass-card p-8 rounded-[2.5rem] border border-border/50 shadow-xl flex flex-col items-center text-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-status-valid/5 to-transparent z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          
          <h2 className="text-xl font-medium tracking-tight text-foreground mb-8 relative z-10 self-start">Verified</h2>
          
          <div className="flex flex-col items-center justify-center py-4 space-y-6 relative z-10 flex-1 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-status-valid blur-2xl opacity-20 rounded-full animate-pulse" />
              <div className="w-24 h-24 rounded-full border border-status-valid/30 flex items-center justify-center bg-status-valid/10 relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                <CheckCircle2 className="w-10 h-10 text-status-valid" />
              </div>
            </div>
            <div>
              <h4 className="text-foreground font-medium text-xl tracking-tight mb-1">Network Synced</h4>
              <p className="text-sm text-muted-foreground font-light">Global nodes are in Verified.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

"use client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ShieldAlert, ShieldCheck, Fingerprint, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function IssuerRecords() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["institution-records"],
    queryFn: async () => {
      const res = await fetchWithAuth('http://localhost:3002/credentials/records');
      if (!res.ok) throw new Error("Failed to fetch records");
      return res.json();
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async (hash: string) => {
      const res = await fetchWithAuth('http://localhost:3002/credentials/revoke', {
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

  const filteredRecords = records.filter((r: any) => 
    r.metadata?.course?.toLowerCase().includes(search.toLowerCase()) ||
    r.student?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">Network Records</h1>
          <p className="text-muted-foreground font-light text-lg">Manage and revoke proofs issued by your institution.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
          <Input 
            placeholder="Search trusted system..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full sm:w-[320px] bg-secondary/30 border-transparent focus-visible:border-border h-12 rounded-xl text-foreground shadow-inner transition-all" 
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center opacity-50">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-lg">Syncing with trusted system...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 px-4 bg-secondary/20 rounded-3xl border border-dashed border-border/50">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
              <Fingerprint className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No records found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {search ? "No records match your search criteria." : "You haven't issued any credentials yet."}
            </p>
            {!search && (
              <Link href="/issuer/issue">
                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">
                  Issue a Credential
                </Button>
              </Link>
            )}
          </div>
        ) : (
          filteredRecords.map((record: any, i: number) => {
            const isValid = record.status === "VALID" || record.status === "ISSUED";
            const isRevoking = revokeMutation.isPending && revokeMutation.variables === record.credentialHash;

            return (
              <motion.div 
                key={record.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl glass-card hover:bg-secondary/20 transition-all duration-300 border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isValid ? 'bg-status-valid/10 text-status-valid' : 'bg-status-revoked/10 text-status-revoked'}`}>
                    {isValid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground tracking-tight">{record.student?.email || 'Student'}</h3>
                    <p className="text-sm text-muted-foreground font-light">{record.metadata?.course || record.credentialTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 sm:mt-0">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-foreground">{new Date(record.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-xs text-muted-foreground">Issued</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${isValid ? 'bg-status-valid/10 text-status-valid' : 'bg-status-revoked/10 text-status-revoked'}`}>
                      {isValid ? "VERIFIED" : "REVOKED"}
                    </span>
                    
                    {isValid ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={isRevoking}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl w-24"
                        onClick={() => revokeMutation.mutate(record.credentialHash)}
                      >
                        {isRevoking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke"}
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="opacity-50 rounded-xl w-24">Revoked</Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

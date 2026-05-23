"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle, Calendar, Building2, Fingerprint, Network, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicProfile() {
  const { id } = useParams();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["public-profile", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3002/students/profile/${id}`);
      if (!res.ok) throw new Error("Profile not found");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Network className="w-8 h-8 animate-pulse text-muted-foreground" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <UserCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-medium mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">This public profile doesn't exist or is set to private.</p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Navbar Minimal */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-5xl mx-auto relative z-10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight">CredChain</span>
        </Link>
        <Link href={`/verify`}>
          <Button variant="outline" size="sm" className="rounded-full font-medium">Verify Documents</Button>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-12 md:pt-20">
        
        {/* Header Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 text-center md:text-left"
        >
          <div className="w-32 h-32 rounded-[2rem] bg-secondary flex items-center justify-center border-4 border-background shadow-xl shrink-0">
            <UserCircle className="w-16 h-16 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-status-valid/10 border border-status-valid/20 text-status-valid text-xs font-semibold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
              Verified Identity
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground">{profile.name}</h1>
            <p className="text-xl text-muted-foreground font-light max-w-lg">
              Public portfolio of cryptographically verified academic and professional credentials.
            </p>
          </div>
        </motion.div>

        {/* Credentials Grid */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="text-2xl font-medium">Verified Credentials</h2>
            <span className="text-muted-foreground font-mono bg-secondary/50 px-3 py-1 rounded-lg text-sm">{profile.credentials.length} Records</span>
          </motion.div>

          {profile.credentials.length === 0 ? (
            <div className="py-20 text-center bg-secondary/20 rounded-3xl border border-dashed border-border/50">
              <Fingerprint className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-light">No verified credentials to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.credentials.map((cred: any, i: number) => (
                <motion.div 
                  key={cred.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="glass-card p-6 rounded-[2rem] border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <Link href={`/verify?hash=${cred.id}`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-4">{cred.title}</h3>
                  
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm font-medium">{cred.issuer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{new Date(cred.date).toLocaleDateString()}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground/50 truncate max-w-[100px]" title={cred.id}>
                        {cred.id.substring(0, 10)}...
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

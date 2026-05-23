"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CredentialCard } from "@/components/shared/CredentialCard";
import { motion } from "framer-motion";
import { UserCircle, ShieldCheck, BadgeCheck, Network, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicProfile() {
  const params = useParams();
  const email = decodeURIComponent(params.email as string);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentName, setStudentName] = useState<string>("Student");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:3002/credentials/public/${encodeURIComponent(email)}`);
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((item: any) => ({
            id: item.credentialHash,
            title: item.credentialTitle,
            issuer: item.institution?.name,
            date: new Date(item.issueDate || item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
            status: item.status
          }));
          setCredentials(formatted);
          if (data.length > 0 && data[0].student?.name) {
            setStudentName(data[0].student.name);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [email]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center pt-24 pb-32 px-4 selection:bg-primary/20">
      
      {/* Background Decor */}
      <div className="fixed top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 mb-16 max-w-2xl w-full"
      >
        <div className="w-24 h-24 rounded-[2rem] bg-secondary border-2 border-white shadow-xl flex items-center justify-center mx-auto mb-6 relative">
          <UserCircle className="w-12 h-12 text-muted-foreground" />
          <div className="absolute -bottom-2 -right-2 bg-status-valid text-white p-1.5 rounded-full shadow-lg border-2 border-white">
            <BadgeCheck className="w-5 h-5" />
          </div>
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-2">{studentName}</h1>
          <p className="text-xl text-muted-foreground font-light">{email}</p>
        </div>
        
        <div className="flex justify-center gap-4 text-sm font-medium">
          <div className="bg-secondary/50 px-4 py-2 rounded-full border border-border/50 text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-status-valid" /> Cryptographically Verified
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-xl">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center text-muted-foreground">
            <Network className="w-8 h-8 animate-pulse mb-4" />
            <p className="font-light">Fetching blockchain proofs...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="py-16 text-center bg-secondary/20 rounded-3xl border border-border/50">
            <p className="text-muted-foreground font-light">No public credentials found for this user.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-lg font-semibold tracking-tight">Verified Credentials</h3>
              <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full text-muted-foreground">{credentials.length}</span>
            </div>
            
            <div className="grid gap-6">
              {credentials.map((cred: any, i: number) => (
                <motion.div 
                  key={cred.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Link href={`/verify?hash=${cred.id}`} target="_blank">
                    <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 hover:-translate-y-1 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <CredentialCard {...cred} />
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Button size="icon" className="rounded-full shadow-lg h-10 w-10">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-24 pt-8 border-t border-border/50 w-full max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
          <Network className="w-4 h-4" /> Powered by CredChain Network
        </Link>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Building2, UserCircle, Settings, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [step, setStep] = useState(0);

  const roles = [
    { title: "Institution", desc: "Issue & manage credentials", icon: Building2, link: "/issuer", color: "text-blue-400" },
    { title: "Student", desc: "View & share your wallet", icon: UserCircle, link: "/wallet", color: "text-green-400" },
    { title: "Verifier", desc: "Check credential validity", icon: ShieldCheck, link: "/verify", color: "text-purple-400" },
    { title: "System Admin", desc: "Manage ecosystem", icon: Settings, link: "/admin", color: "text-muted-foreground" }
  ];

  const skipToRoles = () => setStep(2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(255,255,255,1)_70%)]" />
      
      <div className="z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to CredChain</h1>
                <p className="text-lg text-muted-foreground font-light">The next generation of verifiable, tamper-proof digital credentials.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => setStep(1)} className="w-full h-12 rounded-xl bg-foreground text-background text-lg">Get Started</Button>
                <Button onClick={skipToRoles} variant="ghost" className="w-full text-muted-foreground">Skip</Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center mx-auto border border-border/50">
                <BookOpen className="w-10 h-10 text-foreground" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">How it Works</h1>
                <p className="text-lg text-muted-foreground font-light">Institutions issue credentials. Students own them in their wallet. Employers verify them instantly with cryptographic proof.</p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => setStep(2)} className="w-full h-12 rounded-xl bg-foreground text-background text-lg">Choose Your Role</Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="text-center space-y-2">
                 <h1 className="text-3xl font-bold text-foreground tracking-tight">Select Role</h1>
                 <p className="text-muted-foreground">Choose your portal to continue.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {roles.map((role, i) => (
                  <Link key={i} href={role.link}>
                    <Card className="glass-card border-border/60 hover:border-border hover:bg-secondary/50 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-secondary/50 rounded-xl group-hover:scale-110 transition-transform">
                          <role.icon className={`w-6 h-6 ${role.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-lg">{role.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">{role.desc}</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Fingerprint, Network, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="flex flex-col items-center w-full bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[100vh] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Soft Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none opacity-60" />
        
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 flex flex-col items-center text-center max-w-5xl"
        >
          <div className="mb-8 px-5 py-2 rounded-full border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl flex items-center gap-3 shadow-soft">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="text-sm font-medium tracking-wide">The New Standard for Trust</span>
          </div>
          
          <h1 className="text-6xl md:text-[7rem] font-medium tracking-tighter text-foreground mb-8 leading-[1.05]">
            Trust, mathematically <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary/80 to-primary">
              proven.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
            Transform credentials from forgeable documents into Protected proofs. Instant verification. Zero fraud.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
            <Link href="/issuer">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-soft transition-all duration-300">
                Start Issuing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-border hover:bg-secondary text-foreground rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-md transition-all duration-300">
                Verify a Credential
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* The Workflow */}
      <section className="w-full py-32 bg-secondary/30 border-y border-border/50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">A seamless flow of authenticity.</h2>
            <p className="text-xl text-muted-foreground font-light">From issuance to verification in seconds.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

            {[
              { title: "Issue", desc: "Institutions generate a Protected proof instead of a PDF.", icon: ShieldCheck },
              { title: "Hold", desc: "Students hold the proof in their secure digital wallet.", icon: Fingerprint },
              { title: "Verify", desc: "Employers instantly scan and mathematically verify the origin.", icon: ScanFace }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 glass-card p-10 rounded-[2rem] flex flex-col items-center text-center shadow-soft group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-medium mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section className="w-full py-40 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
                <Network className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1]">
                Security that feels <br />
                <span className="text-muted-foreground">invisible.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-md">
                We've abstracted away the complexity. No keys to manage, no hashes to read. Just pure, unadulterated trust powered by decentralized networks.
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-lg relative">
              {/* Abstract Visual Proof */}
              <motion.div 
                style={{ y }}
                className="glass p-8 rounded-[2.5rem] relative z-10 shadow-2xl border-white/20"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-6">
                    <div>
                      <h4 className="font-medium text-lg">Verified Origin</h4>
                      <p className="text-sm text-muted-foreground">Mathematical proof valid.</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-status-valid/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-status-valid" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-2 w-3/4 bg-secondary rounded-full" />
                    <div className="h-2 w-1/2 bg-secondary rounded-full" />
                    <div className="h-2 w-5/6 bg-secondary rounded-full" />
                  </div>
                  
                  <div className="pt-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
                    <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                      Network Anchored
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Background accent */}
              <div className="absolute top-10 -right-10 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-12 border-t border-border/50 bg-background text-center">
        <p className="text-muted-foreground text-sm font-light tracking-wide">
          CredChain &copy; 2026. Designed for absolute trust.
        </p>
      </footer>
    </div>
  );
}

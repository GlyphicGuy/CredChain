"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Fingerprint, Network, ScanFace, 
  Building2, Database, CheckCircle, User, Code2, Lock, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/60 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Network className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight">CredChain</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#students" className="hover:text-foreground transition-colors">For Students</a>
        <a href="#institutions" className="hover:text-foreground transition-colors">For Institutions</a>
        <a href="#verifiers" className="hover:text-foreground transition-colors">For Verifiers</a>
        <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
        </Link>
        <Link href="/login">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            Open App
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}

function StatTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ['network-stats'],
    queryFn: async () => {
      const res = await fetch("http://localhost:3002/credentials/network-stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    }
  });

  const stats = [
    { label: "Proofs Anchored", value: isLoading ? "-" : data?.proofsAnchored || 0 },
    { label: "Active Institutions", value: isLoading ? "-" : data?.activeInstitutions || 0 },
    { label: "Network Uptime", value: data?.uptime || "99.99%" }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 py-8 px-4 border-y border-border/40 bg-secondary/10">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center min-w-[200px]">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {isLoading ? <span className="animate-pulse bg-secondary/50 h-8 w-16 block rounded-md" /> : stat.value}
          </span>
          <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

function PillarCard({ icon: Icon, title, desc, features, link, linkText }: any) {
  return (
    <div className="glass-card p-8 rounded-[2rem] border border-white/10 flex flex-col h-full shadow-soft hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-3xl font-medium mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{desc}</p>
      <ul className="space-y-3 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
            <CheckCircle className="w-4 h-4 text-status-valid" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={link}>
        <Button variant="outline" className="w-full rounded-xl h-12 group-hover:bg-foreground group-hover:text-background transition-colors">
          {linkText} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="flex flex-col items-center w-full bg-background selection:bg-primary/20 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-20 md:pt-52 md:pb-32 flex flex-col items-center justify-center overflow-hidden px-4">
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
            <span className="text-sm font-medium tracking-wide">Mainnet Alpha is Live</span>
          </div>
          
          <h1 className="text-6xl md:text-[7.5rem] font-medium tracking-tighter text-foreground mb-8 leading-[1.05]">
            Trust, mathematically <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary/80 to-primary">
              proven.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed font-light">
            A decentralized network for verifiable credentials. Transform forgeable PDFs into mathematically undeniable proofs of truth.
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

      {/* Ticker */}
      <div className="w-full">
        <StatTicker />
      </div>

      {/* The Three Pillars */}
      <section className="w-full py-32 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-6">Built for the entire trust ecosystem.</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">CredChain replaces fragmented paper systems with a unified cryptographic network.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PillarCard 
              icon={User}
              title="Students"
              desc="Your digital academic vault. Hold your degrees, certificates, and achievements in one secure wallet."
              features={["Categorized document storage", "Generate expiring share links", "Immutable activity logs"]}
              link="/wallet"
              linkText="Open Wallet"
            />
            <PillarCard 
              icon={Building2}
              title="Institutions"
              desc="Issue millions of credentials with zero infrastructure overhead. Eradicate diploma mills instantly."
              features={["Bulk CSV issuance", "Instant credential revocation", "API keys for ERP integration"]}
              link="/issuer"
              linkText="Open Studio"
            />
            <PillarCard 
              icon={ScanFace}
              title="Verifiers"
              desc="Background check candidates in milliseconds. No phone calls to universities. Just math."
              features={["1-click QR code verification", "Automated API endpoints", "Request documents directly"]}
              link="/verify"
              linkText="Verify Now"
            />
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section id="architecture" className="w-full py-40 px-4 bg-secondary/30 border-y border-border/50 overflow-hidden relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.1]">
                Security that feels <br />
                <span className="text-muted-foreground">invisible.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-md">
                We've abstracted away the complexity. Metadata is pinned to IPFS, whilst an SHA-256 footprint is anchored to the Ethereum blockchain. No keys to manage. Just pure trust.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl h-12 px-6">
                  <Code2 className="w-4 h-4 mr-2" /> Read the Docs
                </Button>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg relative">
              <motion.div 
                style={{ y }}
                className="glass p-8 rounded-[2.5rem] relative z-10 shadow-2xl border-white/20"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-6">
                    <div>
                      <h4 className="font-medium text-lg">Verified Origin</h4>
                      <p className="text-sm text-muted-foreground">Smart Contract Validation</p>
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
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Database className="w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                      IPFS CID: QmYwAPJ...
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <div className="absolute top-10 -right-10 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-[3rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-4 bg-background border-t border-border/40">
        <div className="container mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Network className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold tracking-tight">CredChain</span>
            </div>
            <p className="text-muted-foreground max-w-xs font-light">
              Building the decentralized layer of trust for global credentials.
            </p>
          </div>
          <div>
            <h5 className="font-medium mb-4 uppercase tracking-widest text-xs text-muted-foreground">Platform</h5>
            <ul className="space-y-3 text-sm">
              <li><Link href="/wallet" className="hover:text-primary transition-colors">Student Wallet</Link></li>
              <li><Link href="/issuer" className="hover:text-primary transition-colors">Issuer Studio</Link></li>
              <li><Link href="/verify" className="hover:text-primary transition-colors">Verification API</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-4 uppercase tracking-widest text-xs text-muted-foreground">Resources</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 CredChain Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

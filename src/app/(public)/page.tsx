"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, User, Building2, Fingerprint, Network, Layers, Database, Lock, Server, CheckCircle, Code2, ChevronRight, ScanFace, Boxes, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityCore } from "@/components/3d/SecurityCore";
import { MagneticButton } from "@/components/premium/MagneticButton";
import { InteractiveScanner } from "@/components/premium/InteractiveScanner";
import { LiveTerminal } from "@/components/premium/LiveTerminal";

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-3xl border-b border-black/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
          <Network className="w-5 h-5 text-foreground" />
        </div>
        <span className="text-xl font-semibold tracking-tight">CredChain</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Sign In</Button>
        </Link>
        <Link href="/login">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-sm">
            Open App
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}


function BentoCard({ title, desc, icon: Icon, children, className, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass p-8 rounded-[2rem] flex flex-col gap-6 relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <motion.div 
        whileHover={{ rotate: 180, scale: 1.1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="w-12 h-12 rounded-2xl bg-black/[0.03] flex items-center justify-center relative z-10 shadow-sm overflow-hidden"
      >
        <motion.div className="absolute inset-0 border-2 border-dashed border-zinc-300 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite]" />
        <Icon className="w-5 h-5 text-foreground relative z-10" />
      </motion.div>
      <div className="relative z-10 flex-1">
        <h3 className="text-2xl font-semibold tracking-tight mb-4 text-zinc-950">{title}</h3>
        <p className="text-muted-foreground leading-relaxed font-medium text-[15px]">{desc}</p>
      </div>
      {children && (
        <div className="relative z-10 mt-10 flex-1 flex items-end">
          {children}
        </div>
      )}
    </motion.div>
  );
}

function PillarCard({ icon: Icon, title, desc, features, link, linkText }: any) {
  return (
    <div className="glass-card p-8 rounded-[2rem] border border-border/50 flex flex-col h-full shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-background/50 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div className="absolute inset-0 border-2 border-dashed border-green-500/50 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:animate-[spin_8s_linear_infinite]" />
        <Icon className="w-8 h-8 text-foreground group-hover:text-green-600 transition-colors duration-500 relative z-10" />
      </div>
      <h3 className="text-3xl font-semibold mb-4 relative z-10 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed mb-8 flex-1 relative z-10 font-light">{desc}</p>
      <ul className="space-y-4 mb-8 relative z-10">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-status-valid" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={link} className="relative z-10">
        <Button variant="outline" className="w-full rounded-xl h-14 group-hover:bg-foreground group-hover:text-background transition-colors border-border/50 text-base font-medium">
          {linkText} <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const bgDark = useTransform(scrollYProgress, [0.7, 0.8], ["#ffffff", "#09090b"]);
  const textLight = useTransform(scrollYProgress, [0.7, 0.8], ["#09090b", "#ffffff"]);
  const borderDark = useTransform(scrollYProgress, [0.7, 0.8], ["rgba(0,0,0,0.1)", "rgba(255,255,255,0.1)"]);

  return (
    <div className="flex flex-col items-center w-full bg-background selection:bg-foreground/10 min-h-screen overflow-hidden">
      <Navbar />

      {/* Ultra-Premium Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center px-4 md:px-12 lg:px-24 overflow-hidden pt-20 bg-[#fafafa]">
        
        {/* Subtle background glow */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-200/50 rounded-full blur-[120px] -z-10" />
        </div>
        
        <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start text-left pt-12 lg:pt-0"
          >
            <div className="overflow-hidden mb-2 relative">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-sans font-bold tracking-tighter text-zinc-950 leading-[0.9] relative inline-block"
              >
                CredChain
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-10 pt-2">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-[2.5rem] md:text-[4rem] lg:text-[4.5rem] font-sans font-semibold tracking-tight text-zinc-800 leading-[1.1]"
              >
                Issue Once.<br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-zinc-950">Verify Forever.</span>
                  
                  {/* Hand-drawn SVG Underline Animation - Double Scribble */}
                  <motion.svg 
                    className="absolute -bottom-4 left-[-5%] w-[110%] h-6 text-green-500 drop-shadow-sm overflow-visible" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                  >
                    <motion.path 
                      d="M2,15 Q30,5 50,15 T98,10" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.2, ease: "easeInOut" }}
                    />
                    <motion.path 
                      d="M5,18 Q40,12 60,18 T95,14" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      className="text-green-400"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
                    />
                  </motion.svg>
                </span>
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-zinc-600 mb-12 max-w-lg leading-relaxed font-medium"
            >
              Turning credentials from editable documents into <span className="relative inline-block font-semibold text-zinc-900 mx-1">
                trusted digital assets
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
                  className="absolute bottom-0 left-0 h-[3px] bg-green-500 rounded-full"
                />
              </span> using cryptographic proofs.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-start items-center"
            >
              <Link href="/issuer">
                <Button className="h-14 px-8 bg-black hover:bg-zinc-800 text-white rounded-full text-base font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  Issue Credentials <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" className="h-14 px-8 border-zinc-200 hover:bg-zinc-100 text-zinc-900 rounded-full text-base font-medium transition-all duration-300 bg-white">
                  Open Student Wallet
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side interactive scanner */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full hidden md:flex items-center justify-center pt-10"
          >
            <InteractiveScanner />
          </motion.div>

        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="w-full py-16 border-b border-border/50 bg-background/50 backdrop-blur-sm z-10 relative overflow-hidden flex flex-col items-center">
        <p className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-8">Trusted by forward-thinking institutions</p>
        
        <div className="w-full flex overflow-hidden mask-edges relative">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex whitespace-nowrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500 min-w-max animate-css-marquee">
            {/* Duplicated list for infinite scroll */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-24 pr-24 items-center">
                <div className="flex items-center gap-2"><Network className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">StanfordBlock</span></div>
                <div className="flex items-center gap-2"><Layers className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">MIT_Node</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">OxfordCrypt</span></div>
                <div className="flex items-center gap-2"><Database className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">CloudTrust Enterprise</span></div>
                <div className="flex items-center gap-2"><Lock className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">BerkeleyZero</span></div>
                <div className="flex items-center gap-2"><Server className="w-8 h-8" /><span className="text-xl font-bold font-mono tracking-tighter">Web3Academy</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="w-full py-32 px-4 bg-secondary/10 relative z-10 border-b border-border/50">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24 max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 text-zinc-950 pb-2">Built for the entire trust ecosystem.</h2>
            <p className="text-2xl text-muted-foreground font-medium leading-relaxed">CredChain replaces fragmented paper systems with a unified cryptographic network.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <PillarCard 
                icon={User}
                title="Students"
                desc="Your digital academic vault. Hold your degrees, certificates, and achievements in one secure wallet."
                features={["Categorized document storage", "Generate expiring share links", "Immutable activity logs"]}
                link="/wallet"
                linkText="Open Wallet"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <PillarCard 
                icon={Building2}
                title="Institutions"
                desc="Issue millions of credentials with zero infrastructure overhead. Eradicate diploma mills instantly."
                features={["Bulk CSV issuance", "Instant credential revocation", "API keys for ERP integration"]}
                link="/issuer"
                linkText="Open Studio"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <PillarCard 
                icon={ScanFace}
                title="Verifiers"
                desc="Background check candidates in milliseconds. No phone calls to universities. Just math."
                features={["1-click QR code verification", "Automated API endpoints", "Request documents directly"]}
                link="/verify"
                linkText="Verify Now"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section id="how-it-works" className="w-full py-32 px-4 bg-background relative z-10">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">A seamless chain of trust.</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">Three steps to eradicate diploma mills and background check delays forever.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop with drawing animation */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] -z-10">
               <motion.svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 <motion.line 
                   x1="0" y1="0" x2="100%" y2="0" 
                   stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeDasharray="8 8"
                 />
                 <motion.line 
                   x1="0" y1="0" x2="100%" y2="0" 
                   stroke="#22c55e" strokeWidth="2"
                   initial={{ pathLength: 0, opacity: 0 }}
                   whileInView={{ pathLength: 1, opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                 />
               </motion.svg>
            </div>

            {[
              {
                step: "01", icon: Building2, title: "Institution Issues",
                desc: "Universities upload CSVs or single records. The data is hashed locally using SHA-256."
              },
              {
                step: "02", icon: Network, title: "Network Anchors",
                desc: "The cryptographic footprint is anchored immutably to the blockchain via Smart Contracts."
              },
              {
                step: "03", icon: ScanFace, title: "Employer Verifies",
                desc: "Verifiers scan a QR code or upload the document. Math proves its exact origin in milliseconds."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-background border border-border/50 flex items-center justify-center mb-8 shadow-sm">
                  <item.icon className="w-10 h-10 text-foreground" />
                </div>
                <div className="text-sm font-semibold text-muted-foreground tracking-widest uppercase mb-3">Step {item.step}</div>
                <h3 className="text-2xl font-medium tracking-tight mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento Box */}
      <section id="features" className="w-full py-32 px-4 bg-secondary/20 border-y border-border/50 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">Enterprise-grade architecture.</h2>
            <p className="text-xl text-muted-foreground font-light">Built to scale to millions of records without compromising privacy.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
            <BentoCard 
              className="md:col-span-8 min-h-[400px]"
              delay={0}
              icon={ShieldCheck}
              title="GDPR-Compliant Local Hashing"
              desc="We never store actual documents on the blockchain. Personal data remains entirely private. We anchor a one-way mathematical hash that proves existence without revealing contents."
            >
              <div className="w-full bg-secondary/30 rounded-2xl border border-border/50 p-6 flex flex-col gap-3 font-mono text-xs text-muted-foreground overflow-hidden">
                <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-status-valid" /> <span className="text-foreground">Local Hash Generator</span></div>
                <div className="w-full h-px bg-border/50 my-2" />
                <div>Input: <span className="text-foreground">"Computer Science B.S."</span></div>
                <div>Output: <span className="text-status-valid break-all">0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span></div>
              </div>
            </BentoCard>
            
            <BentoCard 
              className="md:col-span-4 min-h-[400px]"
              delay={0.1}
              icon={Boxes}
              title="Batch Issuance"
              desc="Upload massive CSVs. Issue 10,000 diplomas in a single transaction with ultra-low latency."
            >
              <div className="w-full bg-white rounded-2xl border border-border p-4 shadow-sm space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Uploading records.csv</span>
                  <span className="text-status-valid">100%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="w-full h-full bg-status-valid rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground text-center">10,000 / 10,000 records processed</p>
              </div>
            </BentoCard>
            
            <BentoCard 
              className="md:col-span-4 min-h-[400px]"
              delay={0.2}
              icon={Server}
              title="IPFS Redundancy"
              desc="Metadata is distributed across the InterPlanetary File System, ensuring records survive even if centralized servers fail."
            >
              <div className="w-full grid grid-cols-2 gap-2 opacity-80">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-secondary/50 rounded-xl border border-border/50 flex items-center justify-center">
                    <Database className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </BentoCard>
            
            <BentoCard 
              className="md:col-span-8 min-h-[400px]"
              delay={0.3}
              icon={Layers}
              title="Instant Fraud Prevention"
              desc="If a degree is revoked, the issuer can instantly update the smart contract state. The next time an employer verifies the document, the cryptographic proof fails immediately."
            >
              <div className="w-full flex gap-4 overflow-hidden">
                <div className="w-48 shrink-0 bg-white rounded-2xl border border-status-invalid/20 shadow-sm p-4 flex flex-col items-center text-center translate-y-4 rotate-[-5deg]">
                  <div className="w-10 h-10 rounded-full bg-status-invalid/10 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-status-invalid" />
                  </div>
                  <div className="font-semibold text-sm mb-1">Revoked</div>
                  <div className="text-xs text-muted-foreground">0x3f...8a</div>
                </div>
                <div className="w-48 shrink-0 bg-white rounded-2xl border border-status-valid/20 shadow-sm p-4 flex flex-col items-center text-center -translate-y-2 rotate-[2deg]">
                  <div className="w-10 h-10 rounded-full bg-status-valid/10 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-status-valid" />
                  </div>
                  <div className="font-semibold text-sm mb-1">Active Proof</div>
                  <div className="text-xs text-muted-foreground">0x9a...2c</div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <motion.section 
        id="architecture" 
        style={{ backgroundColor: bgDark, color: textLight }}
        className="w-full py-40 px-4 overflow-hidden relative z-10 transition-colors duration-0"
      >
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center -translate-y-20">
          <SecurityCore />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-8"
            >
              <motion.div style={{ borderColor: borderDark }} className="inline-flex items-center justify-center p-4 rounded-3xl mb-2 border backdrop-blur-md bg-white/5 dark:bg-black/5">
                <Lock className="w-10 h-10" />
              </motion.div>
              <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
                Security that feels <br />
                <span className="opacity-50">invisible.</span>
              </h2>
              <p className="text-xl opacity-70 font-light leading-relaxed max-w-md">
                We've abstracted away the complexity. Metadata is pinned to IPFS, whilst an SHA-256 footprint is anchored to the EVM blockchain. No private keys to manage. Just pure trust.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="/issuer">
                  <Button className="rounded-full h-14 px-8 bg-green-500 text-black hover:bg-green-400 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Access Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <div className="flex-1 w-full max-w-lg relative">
              <motion.div 
                style={{ y }}
                className="relative z-10"
              >
                <LiveTerminal />
              </motion.div>
              
              {/* Decorative background glow behind terminal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="w-full py-40 px-4 relative z-10 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-8">Ready to secure your network?</h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">Join the forward-thinking institutions using CredChain to issue verifiable, tamper-proof credentials at global scale.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/issuer">
              <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-16 bg-white text-zinc-950 hover:bg-zinc-200 rounded-full shadow-2xl transition-all duration-300">
                Start Issuing Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full pt-20 pb-10 px-4 bg-secondary/10 border-t border-border/40">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Network className="w-6 h-6 text-foreground" />
              <span className="text-2xl font-semibold tracking-tight text-zinc-950">CredChain</span>
            </div>
            <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
              Building the decentralized layer of trust for global credentials. Setting the standard for academic and corporate verification.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:justify-self-end">
            <div>
              <h5 className="font-semibold mb-6 uppercase tracking-widest text-xs text-zinc-950">Platform</h5>
              <ul className="space-y-4 text-sm font-light">
                <li><Link href="/wallet" className="text-muted-foreground hover:text-foreground transition-colors">Student Wallet</Link></li>
                <li><Link href="/issuer" className="text-muted-foreground hover:text-foreground transition-colors">Issuer Studio</Link></li>
                <li><Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors">Verification API</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-light">
          <p>&copy; 2026 CredChain Network. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span className="opacity-50">Terms of Service</span>
            <span className="opacity-50">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

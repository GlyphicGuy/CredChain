const fs = require('fs');
const path = require('path');

const pageContent = `"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Database, Link2, Key, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,rgba(0,0,0,1)_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 flex flex-col items-center text-center max-w-4xl"
        >
          <div className="mb-6 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-300">The New Trust Infrastructure</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-tight">
            Issue Once. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">
              Verify Forever.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Transform credentials from editable PDFs into cryptographically secure digital assets. 
            Instant verification, zero fraud.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/issuer">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-white text-black hover:bg-gray-200 rounded-full">
                Start Issuing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 border-white/20 hover:bg-white/10 text-white rounded-full glass">
                Verify Credential
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 bg-black px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How CredChain Works</h2>
            <p className="text-xl text-gray-400">A seamless flow from issuance to verification.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Issue", desc: "Institution uploads the credential.", icon: ShieldCheck },
              { step: "02", title: "Store", desc: "Proof stored immutably on-chain.", icon: Database },
              { step: "03", title: "Share", desc: "Student shares verifiable link.", icon: Link2 },
              { step: "04", title: "Verify", desc: "Employer verifies instantly.", icon: CheckCircle2 }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-3xl flex flex-col items-start border border-white/5 hover:border-white/20 transition-colors"
              >
                <item.icon className="w-12 h-12 text-primary mb-6" />
                <span className="text-4xl font-black text-white/10 mb-2">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Architecture Section */}
      <section className="w-full py-32 bg-gradient-to-b from-black to-zinc-950 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">Trust Infrastructure. <br/>Not File Storage.</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Files remain off-chain to preserve privacy. Cryptographic proofs are anchored on-chain ensuring 
              tamper-evident verification that takes seconds, not weeks.
            </p>
            <ul className="space-y-4">
              {['Privacy Preserving', 'Instant Revocation', 'Cryptographic Proofs'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="p-1 rounded-full bg-primary/20 text-primary">
                    <Key className="w-4 h-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <div className="glass-card p-8 rounded-3xl relative z-10 border border-white/10 shadow-2xl overflow-hidden">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                   <CheckCircle2 className="w-6 h-6 text-green-500" />
                 </div>
                 <div>
                   <h4 className="text-white font-medium text-lg">Hash Verified</h4>
                   <p className="text-gray-400 text-sm">Blockchain proof matched.</p>
                 </div>
               </div>
               <div className="space-y-3 font-mono text-xs text-gray-500 bg-black/50 p-4 rounded-xl">
                 <p><span className="text-primary">TxID:</span> 0x8f2a...9c4b</p>
                 <p><span className="text-primary">Issuer:</span> did:cred:university</p>
                 <p><span className="text-primary">Timestamp:</span> 2026-05-22 14:30:00</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

fs.writeFileSync('src/app/(public)/page.tsx', pageContent);
console.log('Public page generated.');

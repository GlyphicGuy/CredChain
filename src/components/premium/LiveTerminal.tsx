"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function LiveTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const script = [
    "Initializing secure enclave...",
    "Connecting to IPFS swarm nodes...",
    "Found 12 active peers.",
    "Loading document metadata...",
    "> CID: QmYwAPJzv5CZsnA625s3Xf2sm5D...",
    "Verifying cryptographic signature...",
    "Signer: 0x8a92...4bF1 (Institution_MIT)",
    "Signature matched. Generating SHA-256 hash...",
    "> Hash: 0x7f83b1657ff1fc53b92dc18...",
    "Querying CredChain Smart Contract on-chain...",
    "Checking revocation registry...",
    "State: ACTIVE (Not revoked)",
    " ",
    "✓ VERIFICATION SUCCESSFUL",
    "Document is authentic and unmodified.",
  ];

  const startSimulation = () => {
    if (isSimulating) return;
    setLines([]);
    setIsSimulating(true);
  };

  useEffect(() => {
    if (!isSimulating) return;

    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < script.length) {
        setLines(prev => [...prev, script[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 400); // 400ms delay between lines for typing effect

    return () => clearInterval(interval);
  }, [isSimulating]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full h-full min-h-[350px] bg-black/90 backdrop-blur-xl rounded-[2rem] border border-zinc-800 shadow-2xl p-6 flex flex-col font-mono text-sm relative overflow-hidden group">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-6 opacity-70">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <div className="ml-4 flex items-center gap-2 text-zinc-400 text-xs tracking-wider">
          <Terminal className="w-4 h-4" /> credchain-cli
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto space-y-2 text-zinc-300 pr-2 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        <div className="text-zinc-500 mb-4">$ ./verify-credential --id=8f2a91</div>
        {lines.map((line, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              line.includes("✓") ? "text-green-400 font-bold mt-4" : 
              line.startsWith(">") ? "text-zinc-500 ml-4" : ""
            }`}
          >
            {line}
          </motion.div>
        ))}
        {isSimulating && (
          <motion.div 
            animate={{ opacity: [1, 0, 1] }} 
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-zinc-400 inline-block mt-2"
          />
        )}
      </div>

      {/* Action Button */}
      {!isSimulating && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={startSimulation}
            className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform"
          >
            {lines.length > 0 ? "Run Again" : "Simulate Verification"}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export function InteractiveScanner() {
  const [isScanned, setIsScanned] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  React.useEffect(() => {
    let scanTimeout: NodeJS.Timeout;
    let resetTimeout: NodeJS.Timeout;

    const runLoop = () => {
      setIsHovering(true);
      
      // Wait for scan to finish (3s) + show result for 2.5s = 5.5s
      scanTimeout = setTimeout(() => {
        setIsHovering(false);
        setIsScanned(false);
        
        // Wait 10s before restarting loop
        resetTimeout = setTimeout(runLoop, 10000);
      }, 5500);
    };

    runLoop();

    return () => {
      clearTimeout(scanTimeout);
      clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <div 
      className="relative w-full max-w-[420px] aspect-[3/4] mx-auto perspective-[2000px]"
    >
      <motion.div
        animate={{
          rotateX: isHovering ? 0 : 15,
          rotateY: isHovering ? 0 : -15,
          scale: isHovering ? 1.05 : 1,
          y: isHovering ? -10 : 0
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full relative rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden preserve-3d group"
      >
        {/* Subtle background gradient shift */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        {/* Document Content Skeleton */}
        <div className="absolute inset-0 p-8 flex flex-col gap-6 z-10">
          <div className="flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800 pb-6 relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-zinc-200/50 dark:border-zinc-800/50">
              <FileText className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="flex flex-col gap-3 items-end">
              <div className="w-32 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-zinc-700/50 to-transparent w-1/2" />
              </div>
              <div className="w-20 h-3 rounded-full bg-zinc-100 dark:bg-zinc-900" />
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-5 mt-4">
            <div className="w-full h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
               <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.2 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-zinc-700/40 to-transparent w-1/2" />
            </div>
            <div className="w-full h-4 rounded-full bg-zinc-50 dark:bg-zinc-900 mt-2" />
            <div className="w-5/6 h-4 rounded-full bg-zinc-50 dark:bg-zinc-900" />
            <div className="w-11/12 h-4 rounded-full bg-zinc-50 dark:bg-zinc-900" />
            <div className="w-4/6 h-4 rounded-full bg-zinc-50 dark:bg-zinc-900" />
          </div>

          <div className="mt-auto flex justify-between items-end pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col gap-3 w-full">
               <div className="text-[10px] font-mono text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">Cryptographic Signature</div>
               <div className="w-full h-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center px-4 overflow-hidden relative">
                 <span className="font-mono text-xs text-zinc-300 dark:text-zinc-700 truncate w-full">0x7F9a...3b2E • Verified on-chain</span>
                 <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute right-4 w-2 h-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
               </div>
            </div>
            <div className="ml-4 flex-shrink-0 w-16 h-16 rounded-full border-4 border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative bg-white dark:bg-zinc-950">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[3px] border-dashed border-zinc-200 dark:border-zinc-700 rounded-full" />
              <ShieldCheck className="w-7 h-7 text-zinc-300 dark:text-zinc-700 relative z-10" />
            </div>
          </div>
        </div>

        {/* Idle Scan Line */}
        <motion.div
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          className={`absolute left-0 w-full h-[1px] bg-zinc-300/50 dark:bg-zinc-700/50 z-15 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
        />

        {/* Laser Scanner */}
        <motion.div
          initial={{ top: "-10%", opacity: 0 }}
          animate={{
            top: isHovering ? ["-10%", "110%"] : "-10%",
            opacity: isHovering ? [0, 1, 1, 0] : 0,
          }}
          transition={{ 
            duration: 3, 
            ease: "linear",
            times: [0, 0.1, 0.9, 1]
          }}
          onAnimationComplete={() => {
            if (isHovering) setIsScanned(true);
          }}
          className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_4px_rgba(34,197,94,0.5)] z-20"
        />

        {/* Verification Overlay */}
        <AnimatePresence>
          {isScanned && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md z-30 flex flex-col items-center justify-center gap-6"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                className="w-28 h-28 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center border-4 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)] relative"
              >
                <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping" />
                <CheckCircle2 className="w-14 h-14 text-green-600 dark:text-green-400" />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800"
              >
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Verified</h3>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Blockchain State Confirmed</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";

export function SkeletonAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.1 }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-black/[0.02] to-transparent skew-x-12"
          />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-black/5 animate-pulse mb-6" />
            <div className="w-24 h-4 bg-black/5 rounded mb-4 animate-pulse" />
            <div className="w-16 h-10 bg-black/5 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

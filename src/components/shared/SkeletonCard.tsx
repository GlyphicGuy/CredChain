import { motion } from "framer-motion";

export function SkeletonCard() {
  return (
    <div className="w-full max-w-[420px] aspect-[1/1.4] rounded-[2rem] p-8 border border-border/50 bg-white/50 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between mx-auto">
      {/* Shimmer Effect */}
      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
      />
      
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-2xl bg-black/5 animate-pulse" />
            <div className="w-12 h-12 rounded-2xl bg-black/5 animate-pulse" />
          </div>
          <div className="w-24 h-6 bg-black/5 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 space-y-3 mt-12">
        <div className="w-20 h-4 bg-black/5 rounded animate-pulse" />
        <div className="w-3/4 h-8 bg-black/5 rounded-lg animate-pulse" />
        
        <div className="pt-4 space-y-3">
          <div className="w-24 h-4 bg-black/5 rounded animate-pulse" />
          <div className="w-1/2 h-6 bg-black/5 rounded animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between pt-8 border-t border-black/5 mt-auto">
        <div className="space-y-2">
          <div className="w-16 h-3 bg-black/5 rounded animate-pulse" />
          <div className="w-32 h-4 bg-black/5 rounded animate-pulse" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-black/5 animate-pulse" />
      </div>
    </div>
  );
}

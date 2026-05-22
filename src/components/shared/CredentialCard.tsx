import { ShieldCheck, ShieldAlert, Fingerprint, Building2, GraduationCap } from "lucide-react";

export interface CredentialCardProps {
  title: string;
  issuer: string;
  date: string;
  status: "VALID" | "INVALID" | "REVOKED" | "ISSUED";
}

export function CredentialCard({ title, issuer, date, status }: CredentialCardProps) {
  const isOk = status === "VALID" || status === "ISSUED";
  
  return (
    <div className={`w-full aspect-[1/1.58] rounded-[2rem] p-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] border bg-gradient-to-br ${isOk ? 'from-secondary/90 to-background border-white/20 dark:border-white/5' : 'from-status-revoked/20 to-background border-status-revoked/30'} backdrop-blur-3xl group cursor-pointer`}>
      
      {/* Soft internal glow */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[60px] opacity-40 transition-colors duration-700 ${isOk ? 'bg-primary/30 group-hover:bg-primary/50' : 'bg-status-revoked/30'}`} />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="h-full flex flex-col justify-between relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center backdrop-blur-md">
              {isOk ? <ShieldCheck className={`w-5 h-5 ${isOk ? 'text-primary' : 'text-status-revoked'}`} /> : <ShieldAlert className="w-5 h-5 text-status-revoked" />}
            </div>
            <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center backdrop-blur-md">
              <GraduationCap className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md border ${isOk ? 'bg-status-valid/10 text-status-valid border-status-valid/20' : 'bg-status-revoked/10 text-status-revoked border-status-revoked/20'}`}>
            {isOk ? "Verified Proof" : "Revoked"}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Credential</p>
            <h3 className="text-2xl font-medium tracking-tight text-foreground leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-6 border-t border-border/40">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Issuer</p>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">{issuer || 'Institution'}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Issued On</p>
            <p className="text-sm font-medium text-foreground">{date}</p>
          </div>
        </div>
      </div>
      
      {/* Glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 dark:from-white/0 dark:via-white/0 dark:to-white/5 pointer-events-none" />
    </div>
  );
}

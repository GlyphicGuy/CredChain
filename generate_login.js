const fs = require('fs');
const path = require('path');

const files = {
  'src/app/login/page.tsx': `"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Building2, UserCircle, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const roles = [
    { title: "Institution", desc: "Issue & manage credentials", icon: Building2, link: "/issuer", color: "text-blue-400" },
    { title: "Student", desc: "View & share your wallet", icon: UserCircle, link: "/wallet", color: "text-green-400" },
    { title: "Verifier", desc: "Check credential validity", icon: ShieldCheck, link: "/verify", color: "text-purple-400" },
    { title: "Network Admin", desc: "Manage ecosystem", icon: Settings, link: "/admin", color: "text-gray-400" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_70%)]" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
           <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
               <ShieldCheck className="w-8 h-8 text-primary" />
             </div>
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Select Role</h1>
           <p className="text-muted-foreground">Log in to your CredChain portal.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role, i) => (
            <Link key={i} href={role.link}>
              <Card className="glass-card border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    <role.icon className={\`w-6 h-6 \${role.color}\`} />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{role.title}</CardTitle>
                    <CardDescription className="text-gray-400">{role.desc}</CardDescription>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
`
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content + '\n');
});
console.log('Login portal generated.');

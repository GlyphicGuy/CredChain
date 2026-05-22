const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(portals)/issuer/page.tsx': `"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBadge, ShieldAlert, CheckCircle2, Clock } from "lucide-react";

export default function IssuerDashboard() {
  const stats = [
    { title: "Total Issued", value: "12,450", icon: FileBadge, color: "text-blue-500" },
    { title: "Active Verifications", value: "892", icon: CheckCircle2, color: "text-status-valid" },
    { title: "Revoked", value: "14", icon: ShieldAlert, color: "text-status-revoked" },
    { title: "Processing", value: "5", icon: Clock, color: "text-yellow-500" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Institution Dashboard</h1>
        <p className="text-muted-foreground">Overview of your credential issuance and network trust metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={\`w-4 h-4 \${stat.color}\`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="lg:col-span-2 glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Recent Issuances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <FileBadge className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">B.Sc Computer Science</p>
                      <p className="text-xs text-muted-foreground">Student ID: 2026{i}492</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-status-valid font-medium">Issued</p>
                    <p className="text-xs text-muted-foreground">2 mins ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Network Status</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
               <div className="relative">
                 <div className="absolute inset-0 bg-status-valid blur-xl opacity-20 rounded-full" />
                 <CheckCircle2 className="w-16 h-16 text-status-valid relative z-10" />
               </div>
               <div>
                 <h4 className="text-white font-medium text-lg">Blockchain Synced</h4>
                 <p className="text-sm text-muted-foreground">Latest Block: 18,492,001</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
  'src/app/(portals)/issuer/issue/page.tsx': `"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/shared/UploadZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Hash, Link2, CheckCircle } from "lucide-react";

export default function IssueCredential() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const nextStep = () => {
    if (step === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 3000); // Simulate blockchain hashing
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Issue New Credential</h1>
        <p className="text-muted-foreground">Cryptographically sign and store credential proofs on-chain.</p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between relative mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10 rounded-full" />
        <div className={\`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500\`} style={{ width: \`\${((step - 1) / 2) * 100}%\` }} />
        
        {[
          { num: 1, label: "Upload", icon: Link2 },
          { num: 2, label: "Generate Proof", icon: Hash },
          { num: 3, label: "Issue", icon: ShieldCheck }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-background p-2">
            <div className={\`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors \${step >= s.num ? 'border-primary bg-primary/20 text-primary' : 'border-white/20 bg-card text-muted-foreground'}\`}>
              {step > s.num ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
            </div>
            <span className={\`text-xs font-medium \${step >= s.num ? 'text-white' : 'text-muted-foreground'}\`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card border border-white/5 rounded-3xl p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Recipient Name</label>
                  <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Credential Title</label>
                  <Input placeholder="B.Sc Computer Science" className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div className="pt-4">
                <label className="text-sm font-medium text-gray-300 block mb-2">Credential Document</label>
                <UploadZone />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center space-y-6 w-full py-12">
              {isProcessing ? (
                <>
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Hash className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Generating Cryptographic Proof</h3>
                    <p className="text-muted-foreground max-w-md">Applying SHA-256 hash to document and signing with institution private key...</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Hash className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Ready to Anchor on Blockchain</h3>
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-primary max-w-lg break-all">
                    0x9b4a1...[Hash generated locally. Document stays off-chain.]
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center space-y-6 w-full py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-status-valid blur-3xl opacity-20 rounded-full animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-status-valid/20 border border-status-valid/50 flex items-center justify-center relative z-10">
                  <CheckCircle className="w-12 h-12 text-status-valid" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Credential Issued Successfully!</h3>
                <p className="text-muted-foreground">The proof has been anchored on the CredChain network.</p>
              </div>
              <div className="flex gap-4 pt-6">
                <Button variant="outline" className="glass text-white border-white/20" onClick={() => setStep(1)}>Issue Another</Button>
                <Button className="bg-white text-black hover:bg-gray-200">View in Records</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end pt-4">
        {step < 3 && (
          <Button onClick={nextStep} disabled={isProcessing} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
            {step === 1 ? "Generate Proof" : "Anchor on Blockchain"}
          </Button>
        )}
      </div>
    </div>
  );
}`,
  'src/app/(portals)/issuer/records/page.tsx': `"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MoreVertical, ShieldAlert } from "lucide-react";

export default function IssuerRecords() {
  const records = [
    { id: "1", name: "Alice Johnson", credential: "B.Sc Computer Science", date: "2026-05-20", status: "VALID" },
    { id: "2", name: "Bob Smith", credential: "AWS Cloud Architect", date: "2026-05-18", status: "VALID" },
    { id: "3", name: "Charlie Davis", credential: "M.A. History", date: "2026-04-12", status: "REVOKED" },
    { id: "4", name: "Diana Prince", credential: "Data Science Bootcamp", date: "2026-03-30", status: "VALID" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Issued Credentials</h1>
          <p className="text-muted-foreground">Manage and revoke credentials you have anchored on the network.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search credentials..." className="pl-9 w-[300px] bg-card/50 border-white/10 text-white" />
        </div>
      </div>

      <Card className="glass-card border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Recipient</TableHead>
                <TableHead className="text-muted-foreground">Credential</TableHead>
                <TableHead className="text-muted-foreground">Date Issued</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-medium text-white">{record.name}</TableCell>
                  <TableCell className="text-gray-300">{record.credential}</TableCell>
                  <TableCell className="text-muted-foreground">{record.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={record.status === "VALID" ? "text-status-valid border-status-valid/30 bg-status-valid/10" : "text-status-revoked border-status-revoked/30 bg-status-revoked/10"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}`
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content + '\n');
});
console.log('Issuer portal generated.');

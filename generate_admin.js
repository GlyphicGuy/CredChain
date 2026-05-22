const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(portals)/admin/layout.tsx': `import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}`,
  'src/app/(portals)/admin/page.tsx': `"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Users, FileCode2, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const metrics = [
    { title: "Active Institutions", value: "142", icon: Users },
    { title: "Total Anchored Proofs", value: "1.2M", icon: Shield },
    { title: "Smart Contracts", value: "4 Active", icon: FileCode2 },
    { title: "Network TPS", value: "24.5", icon: Activity },
  ];

  const recentLogs = [
    { id: "tx-1", action: "Contract Upgraded", user: "Admin (0x4a...2f)", time: "10 mins ago", status: "Success" },
    { id: "tx-2", action: "Institution Added", user: "Admin (0x4a...2f)", time: "2 hours ago", status: "Success" },
    { id: "tx-3", action: "Emergency Pause", user: "System", time: "1 day ago", status: "Resolved" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Network Admin</h1>
        <p className="text-muted-foreground">Global ecosystem overview and smart contract management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-white/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <metric.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{metric.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Active Institutions</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
               {['Stanford University', 'Amazon Web Services', 'Google Cloud', 'MIT'].map((inst, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-white font-medium">{inst}</span>
                   <span className="text-xs text-status-valid bg-status-valid/10 px-2 py-1 rounded-full">Verified</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5">
          <CardHeader>
            <CardTitle className="text-white">System Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10">
                  <TableHead className="text-muted-foreground">Action</TableHead>
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5">
                    <TableCell className="text-white font-medium">{log.action}</TableCell>
                    <TableCell className="text-gray-400 text-sm">{log.user}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
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
console.log('Admin portal generated.');

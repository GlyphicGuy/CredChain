const fs = require('fs');
const path = require('path');

const files = {
  'src/app/(public)/layout.tsx': `export default function PublicLayout({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex flex-col">{children}</div>; }`,
  'src/app/(public)/page.tsx': `export default function LandingPage() { return <main className="flex-1 container mx-auto px-4 py-8"><h1>CredChain</h1></main>; }`,
  'src/app/login/page.tsx': `export default function LoginPage() { return <main className="min-h-screen flex items-center justify-center"><h1>Login</h1></main>; }`,
  'src/app/(portals)/layout.tsx': `export default function PortalsLayout({ children }: { children: React.ReactNode }) { return <div className="min-h-screen flex bg-background">{children}</div>; }`,
  'src/app/(portals)/issuer/page.tsx': `export default function IssuerDashboard() { return <div><h1>Issuer Dashboard</h1></div>; }`,
  'src/app/(portals)/issuer/issue/page.tsx': `export default function IssueCredential() { return <div><h1>Issue Credential</h1></div>; }`,
  'src/app/(portals)/issuer/records/page.tsx': `export default function IssuerRecords() { return <div><h1>Issued Credentials</h1></div>; }`,
  'src/app/(portals)/wallet/page.tsx': `export default function WalletDashboard() { return <div><h1>Student Wallet</h1></div>; }`,
  'src/app/(portals)/wallet/history/page.tsx': `export default function WalletHistory() { return <div><h1>Verification History</h1></div>; }`,
  'src/app/(portals)/verify/layout.tsx': `export default function VerifyLayout({ children }: { children: React.ReactNode }) { return <div className="w-full max-w-4xl mx-auto">{children}</div>; }`,
  'src/app/(portals)/verify/page.tsx': `export default function VerifyUpload() { return <div><h1>Verify Credential</h1></div>; }`,
  'src/app/(portals)/verify/result/page.tsx': `export default function VerifyResult() { return <div><h1>Verification Result</h1></div>; }`,
  'src/app/(portals)/admin/page.tsx': `export default function AdminDashboard() { return <div><h1>Admin Dashboard</h1></div>; }`,
};

Object.entries(files).forEach(([filepath, content]) => {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, content + '\n');
});
console.log('Scaffolding complete.');

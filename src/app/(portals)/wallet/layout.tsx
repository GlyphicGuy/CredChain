export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">CredChain</span>
            <span className="text-xs font-medium bg-secondary text-foreground px-2 py-0.5 rounded-full">WALLET</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary" />
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

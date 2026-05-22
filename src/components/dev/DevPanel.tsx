"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DevPanel() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if dev_role cookie exists
    const match = document.cookie.match(/(^| )dev_role=([^;]+)/);
    if (match) setRole(match[2]);
  }, []);

  if (process.env.NEXT_PUBLIC_DEV_MODE !== 'true') return null;

  const handleSetRole = (newRole: string | null) => {
    if (newRole) {
      document.cookie = `dev_role=${newRole}; path=/; max-age=86400`;
      setRole(newRole);
    } else {
      document.cookie = `dev_role=; path=/; max-age=0`;
      setRole(null);
    }
    // Hard reload to clear cache and rerun middleware
    window.location.href = '/';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span>Demo Mode {role ? `(${role})` : ''}</span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 bg-background/95 backdrop-blur-xl p-5 border border-border/50 shadow-2xl rounded-2xl text-sm w-48 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-widest mb-1">Switch Role</h3>
          <Button 
            variant={role === 'institution' ? 'default' : 'secondary'} 
            size="sm" 
            className="w-full justify-start rounded-lg"
            onClick={() => handleSetRole('institution')}
          >
            Institution
          </Button>
          <Button 
            variant={role === 'student' ? 'default' : 'secondary'} 
            size="sm" 
            className="w-full justify-start rounded-lg"
            onClick={() => handleSetRole('student')}
          >
            Student
          </Button>
          <Button 
            variant={role === 'verifier' ? 'default' : 'secondary'} 
            size="sm" 
            className="w-full justify-start rounded-lg"
            onClick={() => handleSetRole('verifier')}
          >
            Verifier
          </Button>
          {role && (
            <Button variant="destructive" size="sm" className="w-full justify-start rounded-lg mt-2" onClick={() => handleSetRole(null)}>
              Reset & Logout
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

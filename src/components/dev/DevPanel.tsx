"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, ScanFace, UserCircle } from "lucide-react";

export function DevPanel() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
    
    if (newRole && newRole.startsWith('student')) {
      window.location.href = '/wallet';
    } else if (newRole === 'institution') {
      window.location.href = '/issuer';
    } else if (newRole === 'verifier') {
      window.location.href = '/verify';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white px-4 py-2 text-xs font-bold uppercase rounded-full tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span>Testnet Sandbox {role ? `(${role})` : ''}</span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-2 bg-background/95 backdrop-blur-xl p-5 border border-border/50 shadow-2xl rounded-2xl text-sm w-56 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-widest mb-1">Switch Role</h3>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button variant={role === 'institution' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('institution')}>
              <Building2 className="w-3 h-3 mr-1" /> Institution
            </Button>
            <Button variant={role === 'verifier' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('verifier')}>
              <ScanFace className="w-3 h-3 mr-1" /> Verifier
            </Button>
            
            <div className="col-span-2 pt-2 border-t border-border/50 mt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-2 block">Student Accounts</span>
            </div>
            
            <Button variant={role === 'student-alice' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('student-alice')}>
              <UserCircle className="w-3 h-3 mr-1" /> Alice
            </Button>
            <Button variant={role === 'student-bob' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('student-bob')}>
              <UserCircle className="w-3 h-3 mr-1" /> Bob
            </Button>
            <Button variant={role === 'student-charlie' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('student-charlie')}>
              <UserCircle className="w-3 h-3 mr-1" /> Charlie
            </Button>
            <Button variant={role === 'student-eve' ? 'default' : 'outline'} className="w-full text-xs h-8" onClick={() => handleSetRole('student-eve')}>
              <UserCircle className="w-3 h-3 mr-1" /> Eve
            </Button>
          </div>
          
          {role && (
            <Button variant="destructive" size="sm" className="w-full justify-start rounded-lg mt-3 h-8 text-xs" onClick={() => handleSetRole(null)}>
              Reset & Logout
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

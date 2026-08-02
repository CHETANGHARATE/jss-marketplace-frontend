'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface VendorGuardProps {
  children: React.ReactNode;
}

export const VendorGuard: React.FC<VendorGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/account?redirect=/vendor');
      } else if (user && user.role !== 'seller' && user.role !== 'admin') {
        router.replace('/seller/register');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-foreground/60">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-wider">Verifying Vendor Portal Credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'seller' && user.role !== 'admin')) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-foreground">Vendor Authorization Required</h2>
        <p className="text-xs text-muted-custom leading-relaxed font-medium">
          Access to the Vendor Management Portal requires an approved Seller account. Redirecting you to store registration...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

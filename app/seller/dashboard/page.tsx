'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/account?redirect=/vendor');
      } else if (user?.role === 'seller' || user?.role === 'admin') {
        router.replace('/vendor');
      } else {
        router.replace('/seller/register');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-foreground/60">
      <Sparkles className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-extrabold uppercase tracking-wider">Redirecting to Vendor Portal...</p>
    </div>
  );
}

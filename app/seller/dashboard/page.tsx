'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { vendorService } from '../../../services/vendorService';
import { Sparkles } from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    async function routeUser() {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.replace('/account?redirect=/seller/dashboard');
        return;
      }

      if (user?.role === 'admin' || user?.is_super_admin) {
        router.replace('/vendor');
        return;
      }

      if (user?.vendor_store) {
        if (user.vendor_store.status === 'active' && user.vendor_store.kyc_status === 'verified') {
          router.replace('/vendor');
        } else {
          router.replace('/seller/application-status');
        }
        return;
      }

      try {
        const store = await vendorService.getStoreSettings();
        if (!isMounted) return;

        if (store && store.status === 'active' && store.kyc_status === 'verified') {
          router.replace('/vendor');
        } else {
          router.replace('/seller/application-status');
        }
      } catch (err: any) {
        if (!isMounted) return;
        const status = err?.response?.status || err?.status;
        if (status === 404) {
          router.replace('/seller/register');
        } else {
          router.replace('/seller/application-status');
        }
      }
    }

    routeUser();

    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-foreground/60">
      <Sparkles className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-extrabold uppercase tracking-wider">Redirecting to Vendor Portal...</p>
    </div>
  );
}

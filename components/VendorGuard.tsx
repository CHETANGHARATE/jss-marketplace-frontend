'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { vendorService } from '../services/vendorService';
import { Sparkles, ShieldAlert, Clock } from 'lucide-react';

interface VendorGuardProps {
  children: React.ReactNode;
}

export const VendorGuard: React.FC<VendorGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [checkingStore, setCheckingStore] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function evaluateAccess() {
      if (authLoading) return;

      if (!isAuthenticated) {
        if (isMounted) {
          setRedirectTarget('/account?redirect=/vendor');
          router.replace('/account?redirect=/vendor');
        }
        return;
      }

      // Platform admins bypass vendor checks
      if (user?.role === 'admin' || user?.is_super_admin) {
        if (isMounted) {
          setIsAuthorized(true);
          setCheckingStore(false);
        }
        return;
      }

      // Check user.vendor_store if already available
      if (user?.vendor_store) {
        const store = user.vendor_store;
        if (store.status === 'active' && store.kyc_status === 'verified') {
          if (isMounted) {
            setIsAuthorized(true);
            setCheckingStore(false);
          }
          return;
        } else {
          // Pending, rejected, or suspended store
          if (isMounted) {
            setRedirectTarget('/seller/application-status');
            router.replace('/seller/application-status');
          }
          return;
        }
      }

      // Otherwise fetch live store status from backend API
      try {
        const store = await vendorService.getStoreSettings();
        if (!isMounted) return;

        if (store && store.status === 'active' && store.kyc_status === 'verified') {
          setIsAuthorized(true);
          setCheckingStore(false);
        } else {
          // Store exists but is pending, rejected, or suspended
          setRedirectTarget('/seller/application-status');
          router.replace('/seller/application-status');
        }
      } catch (err: any) {
        if (!isMounted) return;
        const status = err?.response?.status || err?.status;
        if (status === 404) {
          // No store registered at all
          setRedirectTarget('/seller/register');
          router.replace('/seller/register');
        } else {
          // On other errors (e.g., 403 unapproved), route to application status
          setRedirectTarget('/seller/application-status');
          router.replace('/seller/application-status');
        }
      }
    }

    evaluateAccess();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || checkingStore) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-foreground/60">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-wider">Verifying Vendor Approval & Permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shadow-xs">
          {redirectTarget === '/seller/application-status' ? <Clock className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
        </div>
        <h2 className="text-xl font-black text-foreground">
          {redirectTarget === '/seller/application-status' ? 'Approval Required' : 'Vendor Access Restricted'}
        </h2>
        <p className="text-xs text-muted-custom leading-relaxed font-medium">
          {redirectTarget === '/seller/application-status'
            ? 'Your seller store is awaiting Super Admin verification. Redirecting you to Application Status...'
            : 'Access to the Vendor Management Portal requires an approved Seller account. Redirecting you...'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

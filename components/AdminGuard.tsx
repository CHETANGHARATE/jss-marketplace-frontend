'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminGuard — Client-side role-based access control for all /admin/* routes.
 *
 * Protects against:
 * - Unauthenticated guests → redirects to /account
 * - Authenticated customers/vendors → redirects to /
 * - Only users with role === 'admin' are allowed through
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/account?redirect=/admin');
      return;
    }

    if (user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // While auth state is loading, show a minimal spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  // If user is not admin, render nothing (redirect is in progress)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

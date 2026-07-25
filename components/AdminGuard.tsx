'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminGuard — Client-side role-based access control for all /admin/* routes.
 *
 * Protects against:
 * - Unauthenticated guests → redirects to /admin/login
 * - Authenticated customers/vendors → redirects to /
 * - Bypasses protection on /admin/login to prevent infinite redirect loops
 * - Only users with role === 'admin' are allowed through to admin portal pages
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoading) return;

    // If on /admin/login and user is ALREADY an authenticated admin, send to /admin dashboard
    if (isLoginPage) {
      if (user && user.role === 'admin') {
        router.replace('/admin');
      }
      return;
    }

    // For all other /admin/* routes:
    // If not authenticated, redirect to /admin/login
    if (!user) {
      router.replace('/admin/login');
      return;
    }

    // If authenticated but not an admin, redirect to root homepage
    if (user.role !== 'admin') {
      if (user.role === 'seller') {
        router.replace('/vendor');
      } else {
        router.replace('/account');
      }
    }
  }, [user, isLoading, router, isLoginPage]);

  // Always render login page without loading spinner block
  if (isLoginPage) {
    return <>{children}</>;
  }

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

  // If user is not admin, render nothing while redirect is in progress
  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}

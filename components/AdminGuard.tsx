'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ROUTE_PERMISSION_MAP: { prefix: string; permission: string; moduleName: string }[] = [
  // Products
  { prefix: '/admin/products/create', permission: 'products.create', moduleName: 'Create Product' },
  { prefix: '/admin/products/import', permission: 'products.create', moduleName: 'Bulk Product Import' },
  { prefix: '/admin/products', permission: 'products.view', moduleName: 'Products' },
  { prefix: '/admin/brands', permission: 'brands.view', moduleName: 'Brands' },
  { prefix: '/admin/attribute-templates', permission: 'attributes.view', moduleName: 'Attribute Templates' },

  // Categories
  { prefix: '/admin/categories', permission: 'categories.view', moduleName: 'Categories' },

  // Orders
  { prefix: '/admin/orders', permission: 'orders.view', moduleName: 'Orders' },

  // Customers
  { prefix: '/admin/users', permission: 'customers.view', moduleName: 'Customers' },

  // Inventory
  { prefix: '/admin/inventory', permission: 'inventory.view', moduleName: 'Inventory' },

  // Vendors
  { prefix: '/admin/vendors', permission: 'vendors.view', moduleName: 'Vendors' },

  // Payments
  { prefix: '/admin/payments', permission: 'payments.view', moduleName: 'Payments' },

  // Shipping
  { prefix: '/admin/shipping', permission: 'shipping.view', moduleName: 'Shipping' },

  // Promotions
  { prefix: '/admin/coupons', permission: 'promotions.view', moduleName: 'Coupons' },
  { prefix: '/admin/promotions', permission: 'promotions.view', moduleName: 'Promotions' },
  { prefix: '/admin/flash-sales', permission: 'promotions.view', moduleName: 'Flash Sales' },

  // CMS
  { prefix: '/admin/cms', permission: 'cms.view', moduleName: 'CMS & Content' },

  // Reviews
  { prefix: '/admin/reviews', permission: 'reviews.view', moduleName: 'Reviews & Ratings' },

  // Reports
  { prefix: '/admin/reports', permission: 'reports.view', moduleName: 'Reports & Analytics' },

  // Tax
  { prefix: '/admin/tax', permission: 'tax.view', moduleName: 'Tax & Invoicing' },

  // Suppliers
  { prefix: '/admin/suppliers', permission: 'suppliers.view', moduleName: 'Suppliers & Purchase' },

  // Staff & Roles
  { prefix: '/admin/staff', permission: 'staff.view', moduleName: 'Staff & Roles' },

  // Notifications
  { prefix: '/admin/notifications', permission: 'notifications.view', moduleName: 'Notifications' },

  // Support
  { prefix: '/admin/support', permission: 'support.view', moduleName: 'Support Tickets' },

  // Settings
  { prefix: '/admin/settings', permission: 'settings.view', moduleName: 'Settings' },

  // Security
  { prefix: '/admin/security', permission: 'security.view', moduleName: 'Security & Backup' },

  // B2B
  { prefix: '/admin/business-buyers', permission: 'b2b.view', moduleName: 'B2B Buyers' },
  { prefix: '/admin/credit', permission: 'b2b.view', moduleName: 'Business Credit' },
];

/**
 * AdminGuard — Client-side role-based and permission-based access control for all /admin/* routes.
 *
 * Enforces:
 * 1. Authentication & admin role check.
 * 2. Per-module permission validation against user.permissions.
 * 3. Renders a clean 403 Access Restricted screen if user lacks permission for the current URL.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, can, isSuperAdmin } = useAuth();
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

    // If authenticated but not an admin/staff, redirect out of admin
    if (user.role !== 'admin') {
      if (user.role === 'seller') {
        router.replace('/vendor');
      } else {
        router.replace('/account');
      }
    }
  }, [user, isLoading, router, isLoginPage]);

  // Determine permission requirement for the current path
  const matchedRule = useMemo(() => {
    if (!pathname || pathname === '/admin' || isLoginPage) return null;
    // Find matching rule with longest prefix
    const sorted = [...ROUTE_PERMISSION_MAP].sort((a, b) => b.prefix.length - a.prefix.length);
    return sorted.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/')) || null;
  }, [pathname, isLoginPage]);

  const hasPermission = useMemo(() => {
    if (isSuperAdmin) return true;
    if (!matchedRule) return true;
    return can(matchedRule.permission);
  }, [isSuperAdmin, matchedRule, can]);

  // Determine authorized fallback destination
  const fallbackHref = useMemo(() => {
    if (can('products.view')) return '/admin/products';
    if (can('orders.view')) return '/admin/orders';
    if (can('customers.view')) return '/admin/users';
    if (can('categories.view')) return '/admin/categories';
    return '/admin';
  }, [can]);

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
            Verifying Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  // If user is not admin, render nothing while redirect is in progress
  if (!user || user.role !== 'admin') {
    return null;
  }

  // If user lacks permission for this specific module, show 403 Forbidden Screen
  if (!hasPermission && matchedRule) {
    const displayRole = user.role_slug
      ? user.role_slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Staff';

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6">
        <div className="bg-card border border-border-custom rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-rose-500/20">
              403 — Access Restricted
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              Permission Denied
            </h2>
            <p className="text-xs text-muted-custom leading-relaxed">
              Your staff account is assigned the{' '}
              <strong className="text-foreground">{displayRole}</strong> role,
              which does not have permission to access the{' '}
              <strong className="text-foreground">{matchedRule.moduleName}</strong> module.
            </p>
          </div>

          <div className="p-3.5 bg-background-secondary border border-border-custom/80 rounded-xl text-left text-xs space-y-1">
            <p className="font-bold text-foreground">Required Action / Permission:</p>
            <p className="font-mono text-muted-custom text-[11px]">{matchedRule.permission}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => router.push(fallbackHref)}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Return to Authorized Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

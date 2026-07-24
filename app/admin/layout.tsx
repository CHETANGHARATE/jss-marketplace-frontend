import React from 'react';
import type { Metadata } from 'next';
import { AdminGuard } from '../../components/AdminGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard — JSS Marketplace',
  description: 'Enterprise administration portal for JSS Marketplace. Manage products, orders, vendors, customers, and platform settings.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}

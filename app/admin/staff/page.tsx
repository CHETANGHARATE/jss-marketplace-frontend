'use client';

import React from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UserCheck, Plus, Shield, CheckCircle2, Lock } from 'lucide-react';

export default function AdminStaffPage() {
  const roles = [
    { name: 'Super Admin', usersCount: 2, permissions: 'Full Access across all modules & settings' },
    { name: 'Catalog Manager', usersCount: 4, permissions: 'Products, Categories, Brands & Attributes (Read/Write)' },
    { name: 'Order Manager', usersCount: 5, permissions: 'Orders, Shipping & Customer Support (Read/Write)' },
    { name: 'Accountant', usersCount: 2, permissions: 'Payments, Refunds, Tax & Financial Reports' },
    { name: 'Customer Support', usersCount: 6, permissions: 'Support Tickets & Orders (View Only)' },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Staff & Role-Based Access Control (RBAC)"
        subtitle="Manage administrator accounts, assign module-specific action permissions (View, Create, Edit, Delete, Approve, Export), and monitor activity logs."
        badge="Security & Access"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Staff & Roles' }]}
        actions={
          <button className="px-4 py-2.5 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-2xs">
            <Plus size={16} />
            <span>Add Staff Account</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r, i) => (
          <div key={i} className="bg-card border border-border-custom/80 rounded-3xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                <h4 className="font-black text-base text-foreground">{r.name}</h4>
              </div>
              <span className="px-2.5 py-1 bg-primary/10 text-primary font-black text-xs rounded-full">
                {r.usersCount} Staff Active
              </span>
            </div>
            <p className="text-xs text-muted-custom font-semibold">{r.permissions}</p>
            <div className="pt-2 flex justify-end">
              <button className="px-3 py-1.5 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card">
                Configure Permissions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

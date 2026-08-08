'use client';

import React, { useState } from 'react';
import { useAdminCustomersQuery, useToggleCustomerStatusMutation } from '../../../hooks/useAdmin';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Users, Search, UserX, Shield, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useAdminCustomersQuery({ search });
  const toggleMutation = useToggleCustomerStatusMutation();

  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Accounts Directory"
        subtitle="Search registered marketplace buyers, review contact details, total order spending, loyalty status, and account access."
        badge="Customer Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Customers' }]}
        actions={
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, email, or phone..."
              className="pl-10 pr-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground text-xs font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading customer directory...
        </div>
      ) : customers.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl">
          <Users className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Customers Found</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            No registered buyers matching search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                  <th className="py-3.5 px-4">Customer Profile</th>
                  <th className="py-3.5 px-4">Contact & Email</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-black text-sm">
                          {cust.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="font-black text-foreground block text-xs">{cust.name}</span>
                          <span className="text-[11px] text-muted-custom font-medium">Customer #{cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">{cust.email}</span>
                      <span className="text-[11px] text-muted-custom font-medium">{cust.phone || 'No Phone Registered'}</span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-custom font-medium">
                      {cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-IN') : '2024'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          cust.is_active !== false
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}
                      >
                        {cust.is_active !== false ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleMutation.mutate(cust.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          cust.is_active !== false
                            ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        {cust.is_active !== false ? 'Block Customer' : 'Unblock Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

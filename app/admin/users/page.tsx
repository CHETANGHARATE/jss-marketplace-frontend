'use client';

import React, { useState } from 'react';
import { useAdminCustomersQuery, useToggleCustomerStatusMutation } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Users, Search, UserX } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useAdminCustomersQuery({ search });
  const toggleMutation = useToggleCustomerStatusMutation();

  const customers = data?.data || [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'User Management' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-rose-500" />
              <span>Customer Accounts Directory</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Search registered marketplace buyers, review contact profiles, and toggle account access.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email address, or phone..."
              className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading customer directory...
            </div>
          ) : customers.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Customers Found</h3>
              <p className="text-xs text-foreground/60">No registered buyers matching your search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">Customer Profile</th>
                    <th className="pb-3 px-2">Email</th>
                    <th className="pb-3 px-2">Phone</th>
                    <th className="pb-3 px-2">Joined Date</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-2 flex items-center gap-3">
                        <div className="h-9 w-9 bg-rose-500/10 text-rose-500 font-black rounded-xl flex items-center justify-center text-xs uppercase">
                          {cust.name ? cust.name.slice(0, 2) : 'CU'}
                        </div>
                        <span className="font-bold text-foreground">{cust.name}</span>
                      </td>
                      <td className="py-3.5 px-2 text-foreground/70">{cust.email}</td>
                      <td className="py-3.5 px-2 font-mono text-foreground/60">{cust.phone || 'N/A'}</td>
                      <td className="py-3.5 px-2 text-foreground/50 font-medium">
                        {cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-IN') : 'Recent'}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => toggleMutation.mutate(cust.id)}
                          disabled={toggleMutation.isPending}
                          className="px-3 py-1 bg-muted/40 hover:bg-rose-500/10 hover:text-rose-500 rounded-xl text-[11px] font-bold transition-all inline-flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-500" />
                          <span>Toggle Access</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

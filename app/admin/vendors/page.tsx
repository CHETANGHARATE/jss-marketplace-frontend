'use client';

import React, { useState } from 'react';
import {
  useAdminVendorsQuery,
  useApproveVendorMutation,
  useSuspendVendorMutation
} from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { Store, Search, CheckCircle2, Ban, ShieldCheck } from 'lucide-react';

export default function AdminVendorsPage() {
  const [search, setSearch] = useState<string>('');
  const { data, isLoading } = useAdminVendorsQuery({ search });
  const approveMutation = useApproveVendorMutation();
  const suspendMutation = useSuspendVendorMutation();

  const vendors = data?.data || [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Vendor Management' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Store className="w-6 h-6 text-rose-500" />
              <span>Multi-Vendor Merchant Control</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Approve pending seller applications, inspect store KYCs, and manage store suspensions.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by store name, vendor email, or phone..."
              className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-foreground/40 absolute left-4 top-3.5" />
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading vendor registry...
            </div>
          ) : vendors.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Store className="w-10 h-10 text-foreground/30 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Vendors Found</h3>
              <p className="text-xs text-foreground/60">No multi-vendor merchant stores matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">Storefront</th>
                    <th className="pb-3 px-2">Contact Email</th>
                    <th className="pb-3 px-2">KYC Verification</th>
                    <th className="pb-3 px-2">Commission Rate</th>
                    <th className="pb-3 px-2 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {vendors.map((ven) => (
                    <tr key={ven.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-2 font-bold text-foreground">{ven.store_name}</td>
                      <td className="py-3.5 px-2 text-foreground/70">{ven.store_email || 'N/A'}</td>
                      <td className="py-3.5 px-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>KYC Verified</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-mono font-black text-rose-500">
                        {ven.commission_rate || '10'}%
                      </td>
                      <td className="py-3.5 px-2 text-right space-x-2">
                        <button
                          onClick={() => approveMutation.mutate(ven.id)}
                          disabled={approveMutation.isPending}
                          className="px-3 py-1 bg-emerald-500 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => suspendMutation.mutate(ven.id)}
                          disabled={suspendMutation.isPending}
                          className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-xl text-[11px] font-bold hover:bg-rose-500/20 transition-all inline-flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
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

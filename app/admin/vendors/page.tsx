'use client';

import React, { useState } from 'react';
import {
  useAdminVendorsQuery,
  useAdminVendorStatsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useSuspendVendorMutation,
  useActivateVendorMutation
} from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { useToast } from '../../../components/Toast';
import {
  Store,
  Search,
  CheckCircle2,
  Ban,
  ShieldCheck,
  XCircle,
  RefreshCcw,
  Clock,
  Users,
  AlertTriangle,
  Sparkles,
  Filter
} from 'lucide-react';

export default function AdminVendorsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: statsData, isLoading: isStatsLoading } = useAdminVendorStatsQuery();
  const { data: vendorsRes, isLoading: isVendorsLoading } = useAdminVendorsQuery({
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const approveMutation = useApproveVendorMutation();
  const rejectMutation = useRejectVendorMutation();
  const suspendMutation = useSuspendVendorMutation();
  const activateMutation = useActivateVendorMutation();

  const vendors = vendorsRes?.data || [];
  const stats = statsData || {
    pending_count: 0,
    approved_count: 0,
    suspended_count: 0,
    rejected_count: 0,
    total_count: 0,
  };

  const handleApprove = async (id: number, storeName: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" approved and activated!`, 'Vendor Approved');
    } catch (err: any) {
      toastError(err.message || 'Failed to approve vendor store.', 'Approval Failed');
    }
  };

  const handleReject = async (id: number, storeName: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" application rejected.`, 'Vendor Rejected');
    } catch (err: any) {
      toastError(err.message || 'Failed to reject vendor store.', 'Rejection Failed');
    }
  };

  const handleSuspend = async (id: number, storeName: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" has been suspended.`, 'Vendor Suspended');
    } catch (err: any) {
      toastError(err.message || 'Failed to suspend vendor store.', 'Suspension Failed');
    }
  };

  const handleActivate = async (id: number, storeName: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" reactivated successfully!`, 'Vendor Activated');
    } catch (err: any) {
      toastError(err.message || 'Failed to activate vendor store.', 'Activation Failed');
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'approved' || s === 'active') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          <CheckCircle2 size={12} />
          <span>Approved</span>
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
          <Clock size={12} />
          <span>Pending</span>
        </span>
      );
    }
    if (s === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
          <XCircle size={12} />
          <span>Rejected</span>
        </span>
      );
    }
    if (s === 'suspended') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-700 bg-rose-900/10 border border-rose-800/20 px-2.5 py-0.5 rounded-full">
          <Ban size={12} />
          <span>Suspended</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 bg-slate-500/10 border border-slate-500/20 px-2.5 py-0.5 rounded-full">
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="space-y-8 max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Vendor Management' }]} />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
                <Store className="w-6 h-6 text-rose-500" />
                <span>Multi-Vendor Merchant Control</span>
              </h1>
              <p className="text-xs text-foreground/60 font-medium mt-1">
                Approve pending seller applications, manage vendor store status, and monitor marketplace merchants.
              </p>
            </div>
          </div>

          {/* STEP 11: Top Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-card border border-amber-500/30 rounded-3xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Pending Applications
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {isStatsLoading ? '...' : stats.pending_count}
              </span>
            </div>

            <div className="bg-card border border-emerald-500/30 rounded-3xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Approved Vendors
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {isStatsLoading ? '...' : stats.approved_count}
              </span>
            </div>

            <div className="bg-card border border-rose-500/30 rounded-3xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                Suspended Vendors
              </span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {isStatsLoading ? '...' : stats.suspended_count}
              </span>
            </div>

            <div className="bg-card border border-red-500/30 rounded-3xl p-4 shadow-2xs space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 block">
                Rejected Vendors
              </span>
              <span className="text-2xl font-black text-red-600 dark:text-red-400">
                {isStatsLoading ? '...' : stats.rejected_count}
              </span>
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-4 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-foreground/60 block">
                Total Vendors
              </span>
              <span className="text-2xl font-black text-foreground">
                {isStatsLoading ? '...' : stats.total_count}
              </span>
            </div>
          </div>

          {/* Controls: Search & Filter Tabs */}
          <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Filter Tabs (Step 10) */}
              <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                {[
                  { id: 'all', label: 'All Vendors' },
                  { id: 'pending', label: `Pending (${stats.pending_count})` },
                  { id: 'approved', label: 'Approved' },
                  { id: 'rejected', label: 'Rejected' },
                  { id: 'suspended', label: 'Suspended' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 ${
                      statusFilter === tab.id
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-muted/30 text-foreground/70 hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search store, owner, email..."
                  className="w-full bg-muted/30 border border-border/40 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:outline-none focus:border-rose-500"
                />
                <Search className="w-4 h-4 text-foreground/40 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Vendor Table */}
            {isVendorsLoading ? (
              <div className="py-16 text-center text-xs font-semibold text-foreground/50 animate-pulse flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-rose-500 animate-spin" />
                <span>Loading database vendor records...</span>
              </div>
            ) : vendors.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Store className="w-10 h-10 text-foreground/30 mx-auto" />
                <h3 className="text-base font-bold text-foreground">No Vendors Found</h3>
                <p className="text-xs text-foreground/60">No merchant records matching status filter or query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                      <th className="pb-3 px-3">Store Name</th>
                      <th className="pb-3 px-3">Owner Name</th>
                      <th className="pb-3 px-3">Contact Email</th>
                      <th className="pb-3 px-3">Phone</th>
                      <th className="pb-3 px-3">Applied Date</th>
                      <th className="pb-3 px-3">KYC Status</th>
                      <th className="pb-3 px-3">Vendor Status</th>
                      <th className="pb-3 px-3">Commission</th>
                      <th className="pb-3 px-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {vendors.map((ven) => {
                      const isPending = ven.status === 'pending';
                      const isApproved = ven.status === 'approved' || ven.status === 'active';
                      const isSuspended = ven.status === 'suspended';
                      const isRejected = ven.status === 'rejected';

                      return (
                        <tr key={ven.id} className="hover:bg-muted/20">
                          <td className="py-4 px-3 font-extrabold text-foreground">
                            {ven.store_name}
                          </td>
                          <td className="py-4 px-3 font-semibold text-foreground/80">
                            {ven.owner_name || ven.user?.name || 'Merchant Owner'}
                          </td>
                          <td className="py-4 px-3 text-foreground/70 font-medium">
                            {ven.store_email || 'N/A'}
                          </td>
                          <td className="py-4 px-3 text-foreground/70 font-mono">
                            {ven.store_phone || 'N/A'}
                          </td>
                          <td className="py-4 px-3 text-foreground/60 text-[11px] font-medium">
                            {ven.created_at ? new Date(ven.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
                          <td className="py-4 px-3">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                              ven.kyc_status === 'verified'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : ven.kyc_status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            }`}>
                              <ShieldCheck size={12} />
                              <span className="capitalize">{ven.kyc_status || 'pending'}</span>
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            {renderStatusBadge(ven.status)}
                          </td>
                          <td className="py-4 px-3 font-mono font-black text-rose-500">
                            {ven.commission_rate || 10}%
                          </td>
                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Approve Button */}
                              {(isPending || isRejected || isSuspended) && (
                                <button
                                  onClick={() => handleApprove(ven.id, ven.store_name)}
                                  disabled={approveMutation.isPending || activateMutation.isPending}
                                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                                  title="Approve & Activate Vendor Store"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {/* Reject Button */}
                              {isPending && (
                                <button
                                  onClick={() => handleReject(ven.id, ven.store_name)}
                                  disabled={rejectMutation.isPending}
                                  className="px-3 py-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl text-[11px] font-bold hover:bg-rose-500 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                                  title="Reject Vendor Application"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              )}

                              {/* Suspend Button */}
                              {isApproved && (
                                <button
                                  onClick={() => handleSuspend(ven.id, ven.store_name)}
                                  disabled={suspendMutation.isPending}
                                  className="px-3 py-1.5 bg-rose-900/10 text-rose-700 border border-rose-800/20 rounded-xl text-[11px] font-bold hover:bg-rose-600 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                                  title="Suspend Vendor Store"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  <span>Suspend</span>
                                </button>
                              )}

                              {/* Reactivate Button */}
                              {isSuspended && (
                                <button
                                  onClick={() => handleActivate(ven.id, ven.store_name)}
                                  disabled={activateMutation.isPending}
                                  className="px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50"
                                  title="Reactivate Suspended Vendor Store"
                                >
                                  <RefreshCcw className="w-3.5 h-3.5" />
                                  <span>Reactivate</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

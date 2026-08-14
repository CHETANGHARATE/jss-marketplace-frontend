'use client';

import React, { useState } from 'react';
import {
  useAdminVendorsQuery,
  useAdminVendorStatsQuery,
  useAdminVendorQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useSuspendVendorMutation,
  useActivateVendorMutation
} from '../../../hooks/useAdmin';
import { useToast } from '../../../components/Toast';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import {
  Store,
  Search,
  CheckCircle2,
  Ban,
  ShieldCheck,
  XCircle,
  RefreshCcw,
  Clock,
  Sparkles,
  Eye,
  FileText,
  User,
  Building2,
  CreditCard,
  Package,
  IndianRupee,
  X
} from 'lucide-react';

function formatAddress(addr: any): string {
  if (!addr) return 'N/A';
  if (typeof addr === 'string') return addr;
  if (typeof addr === 'object') {
    const parts = [
      addr.address || addr.line1 || addr.address_line_1,
      addr.city,
      addr.state,
      addr.pincode || addr.postal_code
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  }
  return String(addr);
}

function formatAccountNumber(acc: any): string {
  if (!acc) return 'N/A';
  const str = String(acc).trim();
  if (str.length <= 4) return str;
  return '•••• ' + str.slice(-4);
}

export default function AdminVendorsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'profile' | 'business' | 'bank' | 'docs' | 'products'>('profile');

  const { data: statsData, isLoading: isStatsLoading } = useAdminVendorStatsQuery();
  const { data: vendorsRes, isLoading: isVendorsLoading } = useAdminVendorsQuery({
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { data: vendorDetailData, isLoading: isVendorDetailLoading } = useAdminVendorQuery(
    selectedVendor?.id ?? null,
    !!selectedVendor?.id
  );

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
      toastSuccess(`Vendor store '${storeName}' approved and activated successfully!`);
      if (selectedVendor?.id === id) {
        setSelectedVendor((prev: any) => (prev ? { ...prev, status: 'active', kyc_status: 'verified' } : null));
      }
    } catch (err: any) {
      toastError(err?.response?.data?.message || 'Failed to approve vendor store.');
    }
  };

  const handleReject = async (id: number, storeName: string) => {
    if (!confirm(`Are you sure you want to reject vendor application for '${storeName}'?`)) return;
    try {
      await rejectMutation.mutateAsync(id);
      toastSuccess(`Vendor application for '${storeName}' has been rejected.`);
      if (selectedVendor?.id === id) {
        setSelectedVendor((prev: any) => (prev ? { ...prev, status: 'rejected', kyc_status: 'rejected' } : null));
      }
    } catch (err: any) {
      toastError(err?.response?.data?.message || 'Failed to reject vendor store.');
    }
  };

  const handleSuspend = async (id: number, storeName: string) => {
    if (!confirm(`Are you sure you want to suspend vendor store '${storeName}'? Their products will be hidden.`)) return;
    try {
      await suspendMutation.mutateAsync(id);
      toastSuccess(`Vendor store '${storeName}' has been suspended.`);
      if (selectedVendor?.id === id) {
        setSelectedVendor((prev: any) => (prev ? { ...prev, status: 'suspended' } : null));
      }
    } catch (err: any) {
      toastError(err?.response?.data?.message || 'Failed to suspend vendor store.');
    }
  };

  const handleActivate = async (id: number, storeName: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toastSuccess(`Vendor store '${storeName}' reactivated successfully!`);
      if (selectedVendor?.id === id) {
        setSelectedVendor((prev: any) => (prev ? { ...prev, status: 'active' } : null));
      }
    } catch (err: any) {
      toastError(err?.response?.data?.message || 'Failed to activate vendor store.');
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            <CheckCircle2 size={12} />
            <span>Active</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            <Clock size={12} />
            <span>Pending Review</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 bg-rose-900/10 text-rose-700 border border-rose-800/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            <Ban size={12} />
            <span>Suspended</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 border border-red-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            <XCircle size={12} />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
            <span>{status || 'Unknown'}</span>
          </span>
        );
    }
  };

  const vendorDetail = vendorDetailData?.store || selectedVendor;
  const catalogStats = vendorDetailData?.catalog;
  const financialStats = vendorDetailData?.financial;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Multi-Vendor Store Management"
        subtitle="Review seller registration applications, verify KYC PAN/GST documents, monitor store performance, and manage store access."
        badge="Vendor Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Vendors' }]}
      />

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-rose-500 text-white shadow-2xs'
                    : 'bg-muted/30 text-foreground/70 hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
                  <th className="pb-3 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {vendors.map((ven: any) => {
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
                        {ven.store_email || ven.user?.email || 'N/A'}
                      </td>
                      <td className="py-4 px-3 text-foreground/70 font-mono">
                        {ven.store_phone || ven.user?.phone || 'N/A'}
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
                      <td className="py-4 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Application Details Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVendor(ven);
                              setActiveModalTab('profile');
                            }}
                            className="px-2.5 py-1.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-[11px] rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="View Full Seller Application & KYC Documents"
                          >
                            <Eye size={13} className="text-primary" />
                            <span>View</span>
                          </button>

                          {/* Approve Button */}
                          {(isPending || isRejected || isSuspended) && (
                            <button
                              type="button"
                              onClick={() => handleApprove(ven.id, ven.store_name)}
                              disabled={approveMutation.isPending || activateMutation.isPending}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-600 transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
                              title="Approve & Activate Vendor Store"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleReject(ven.id, ven.store_name)}
                              disabled={rejectMutation.isPending}
                              className="px-3 py-1.5 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl text-[11px] font-bold hover:bg-rose-500 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
                              title="Reject Vendor Application"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Suspend Button */}
                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => handleSuspend(ven.id, ven.store_name)}
                              disabled={suspendMutation.isPending}
                              className="px-3 py-1.5 bg-rose-900/10 text-rose-700 border border-rose-800/20 rounded-xl text-[11px] font-bold hover:bg-rose-600 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
                              title="Suspend Vendor Store"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </button>
                          )}

                          {/* Reactivate Button */}
                          {isSuspended && (
                            <button
                              type="button"
                              onClick={() => handleActivate(ven.id, ven.store_name)}
                              disabled={activateMutation.isPending}
                              className="px-3 py-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl text-[11px] font-bold hover:bg-blue-500 hover:text-white transition-all inline-flex items-center gap-1 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
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

      {/* Application & KYC Documents Inspection Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border border-border-custom rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  Seller Application Inspection
                </span>
                <h3 className="text-xl font-black text-foreground">{vendorDetail.store_name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                className="p-2 text-muted-custom hover:text-foreground rounded-xl hover:bg-background-secondary cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-border-custom/60">
              {[
                { id: 'profile', label: '1. Profile & Contact', icon: User },
                { id: 'business', label: '2. Business & GST', icon: Building2 },
                { id: 'bank', label: '3. Bank & Payouts', icon: CreditCard },
                { id: 'docs', label: '4. KYC Documents', icon: FileText },
                { id: 'products', label: '5. Catalog & Products', icon: Package },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      activeModalTab === tab.id
                        ? 'bg-rose-500 text-white shadow-2xs'
                        : 'bg-background-secondary text-muted-custom hover:text-foreground'
                    }`}
                  >
                    <Icon size={13} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. Basic Info */}
            {activeModalTab === 'profile' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User size={15} className="text-primary" />
                  <span>Personal Profile & Identity</span>
                </h4>
                <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-custom font-medium block">Owner Name:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.owner_name || vendorDetail.user?.name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Contact Email:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.store_email || vendorDetail.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Contact Phone:</span>
                    <span className="font-mono font-bold text-foreground">
                      {vendorDetail.store_phone || vendorDetail.user?.phone || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">PAN Number:</span>
                    <span className="font-mono font-extrabold uppercase text-foreground">
                      {vendorDetail.kyc_documents?.pan_number || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">City / State:</span>
                    <span className="font-bold text-foreground">
                      {formatAddress(vendorDetail.address)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Store Status:</span>
                    <span className="font-bold text-foreground capitalize">
                      {vendorDetail.status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Business Details */}
            {activeModalTab === 'business' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 size={15} className="text-emerald-500" />
                  <span>Business Operations & GSTIN</span>
                </h4>
                <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-custom font-medium block">Business Type:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.kyc_documents?.business_details?.business_type || 'Sole Proprietorship'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Primary Category:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.kyc_documents?.business_details?.primary_category || 'General Merchant'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">GSTIN:</span>
                    <span className="font-mono font-extrabold uppercase text-foreground">
                      {vendorDetail.kyc_documents?.business_details?.gstin || 'N/A (Exempt)'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-muted-custom font-medium block">Operating Address:</span>
                    <span className="font-bold text-foreground">
                      {formatAddress(vendorDetail.address)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Bank Details */}
            {activeModalTab === 'bank' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={15} className="text-indigo-500" />
                  <span>Bank Account & Settlement Information</span>
                </h4>
                <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-custom font-medium block">Account Holder:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.kyc_documents?.bank_details?.account_holder_name || vendorDetail.owner_name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Bank Name:</span>
                    <span className="font-bold text-foreground">
                      {vendorDetail.kyc_documents?.bank_details?.bank_name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Account Number:</span>
                    <span className="font-mono font-bold text-foreground">
                      {formatAccountNumber(vendorDetail.kyc_documents?.bank_details?.account_number)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">IFSC Code:</span>
                    <span className="font-mono font-extrabold uppercase text-foreground">
                      {vendorDetail.kyc_documents?.bank_details?.ifsc_code || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Account Type:</span>
                    <span className="font-bold text-foreground capitalize">
                      {vendorDetail.kyc_documents?.bank_details?.account_type || 'Current / Savings'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-custom font-medium block">Commission Rate:</span>
                    <span className="font-bold text-foreground font-mono">
                      {financialStats?.commission_rate ?? vendorDetail.commission_rate ?? 10}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Uploaded Documents */}
            {activeModalTab === 'docs' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={15} className="text-amber-500" />
                  <span>Submitted KYC Documents</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'PAN Card Copy', url: vendorDetail.kyc_documents?.documents?.pan_card },
                    { label: 'GST / ID Proof', url: vendorDetail.kyc_documents?.documents?.id_proof },
                    { label: 'Address Proof', url: vendorDetail.kyc_documents?.documents?.address_proof },
                    { label: 'Cancelled Cheque', url: vendorDetail.kyc_documents?.documents?.bank_proof },
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 bg-background-secondary rounded-2xl border border-border-custom space-y-2 text-center">
                      <span className="text-[10px] font-bold text-muted-custom block">{doc.label}</span>
                      {doc.url ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary hover:underline"
                        >
                          <Eye size={12} />
                          <span>View Copy</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-muted-custom italic">Not Uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Products Breakdown */}
            {activeModalTab === 'products' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Package size={15} className="text-indigo-500" />
                  <span>Vendor Catalog & Listed Products</span>
                </h4>
                {isVendorDetailLoading ? (
                  <div className="py-8 text-center text-xs font-bold text-muted-custom animate-pulse">
                    Loading catalog data...
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-background-secondary rounded-2xl border border-border-custom text-center">
                        <span className="text-[10px] font-bold text-muted-custom block">Total Products</span>
                        <span className="text-lg font-black text-foreground">{catalogStats?.total_products || 0}</span>
                      </div>
                      <div className="p-3 bg-background-secondary rounded-2xl border border-border-custom text-center">
                        <span className="text-[10px] font-bold text-emerald-600 block">Active Products</span>
                        <span className="text-lg font-black text-emerald-600">{catalogStats?.active_products || 0}</span>
                      </div>
                      <div className="p-3 bg-background-secondary rounded-2xl border border-border-custom text-center">
                        <span className="text-[10px] font-bold text-amber-600 block">Pending Review</span>
                        <span className="text-lg font-black text-amber-600">{catalogStats?.pending_products || 0}</span>
                      </div>
                    </div>

                    {(!catalogStats?.recent_products || catalogStats.recent_products.length === 0) ? (
                      <div className="p-4 bg-background-secondary rounded-2xl text-center text-xs text-muted-custom font-semibold">
                        This vendor has not published any products yet.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {catalogStats.recent_products.map((p: any) => (
                          <div
                            key={p.id}
                            className="p-2.5 bg-background-secondary rounded-xl border border-border-custom/80 flex items-center justify-between text-xs"
                          >
                            <span className="font-bold text-foreground truncate max-w-xs">{p.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-emerald-600 font-bold">₹{Number(p.base_price || 0).toLocaleString('en-IN')}</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-black">
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(vendorDetail.status === 'pending' || vendorDetail.status === 'rejected' || vendorDetail.status === 'suspended') && (
                  <button
                    type="button"
                    onClick={() => handleApprove(vendorDetail.id, vendorDetail.store_name)}
                    className="px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>Approve Store</span>
                  </button>
                )}
                {vendorDetail.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleReject(vendorDetail.id, vendorDetail.store_name)}
                    className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    <span>Reject Application</span>
                  </button>
                )}
                {(vendorDetail.status === 'active' || vendorDetail.status === 'approved') && (
                  <button
                    type="button"
                    onClick={() => handleSuspend(vendorDetail.id, vendorDetail.store_name)}
                    className="px-4 py-2 bg-rose-900/10 text-rose-700 border border-rose-800/20 font-bold text-xs rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Ban size={14} />
                    <span>Suspend Store</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                className="px-5 py-2 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

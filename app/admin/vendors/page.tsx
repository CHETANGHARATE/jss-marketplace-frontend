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
  X
} from 'lucide-react';

export default function AdminVendorsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

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
      if (selectedVendor?.id === id) setSelectedVendor(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to approve vendor store.', 'Approval Failed');
    }
  };

  const handleReject = async (id: number, storeName: string) => {
    try {
      await rejectMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" application rejected.`, 'Vendor Rejected');
      if (selectedVendor?.id === id) setSelectedVendor(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to reject vendor store.', 'Rejection Failed');
    }
  };

  const handleSuspend = async (id: number, storeName: string) => {
    try {
      await suspendMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" has been suspended.`, 'Vendor Suspended');
      if (selectedVendor?.id === id) setSelectedVendor(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to suspend vendor store.', 'Suspension Failed');
    }
  };

  const handleActivate = async (id: number, storeName: string) => {
    try {
      await activateMutation.mutateAsync(id);
      toastSuccess(`Vendor "${storeName}" reactivated successfully!`, 'Vendor Activated');
      if (selectedVendor?.id === id) setSelectedVendor(null);
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
    <div className="space-y-6">
      <AdminPageHeader
        title="Multi-Vendor Merchant Control & KYC"
        subtitle="Approve pending seller store applications, perform KYC verification, configure vendor commission rates, and manage store status."
        badge="Vendor Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Vendors' }]}
        actions={
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor store or email..."
              className="pl-10 pr-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground text-xs font-semibold rounded-xl focus:outline-none"
            />
          </div>
        }
      />

      {/* Top Statistics Cards */}
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
                            onClick={() => setSelectedVendor(ven)}
                            className="px-2.5 py-1.5 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-[11px] rounded-xl transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="View Full Seller Application & KYC Documents"
                          >
                            <Eye size={13} className="text-primary" />
                            <span>View</span>
                          </button>

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

      {/* Application & KYC Documents Inspection Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border border-border-custom rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border-custom">
              <div>
                <span className="text-[10px] font-black uppercase text-primary tracking-wider">
                  Seller Application Inspection
                </span>
                <h3 className="text-xl font-black text-foreground">{selectedVendor.store_name}</h3>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-2 text-muted-custom hover:text-foreground rounded-xl hover:bg-background-secondary"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1. Basic Info */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User size={15} className="text-primary" />
                <span>1. Personal Information</span>
              </h4>
              <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-custom font-medium block">Owner Name:</span>
                  <span className="font-bold text-foreground">{selectedVendor.owner_name || selectedVendor.user?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Contact Email:</span>
                  <span className="font-bold text-foreground">{selectedVendor.store_email || selectedVendor.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Contact Phone:</span>
                  <span className="font-mono font-bold text-foreground">{selectedVendor.store_phone || selectedVendor.user?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">PAN Number:</span>
                  <span className="font-mono font-extrabold uppercase text-foreground">
                    {selectedVendor.kyc_documents?.pan_number || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Gender / DOB:</span>
                  <span className="font-bold text-foreground capitalize">
                    {selectedVendor.kyc_documents?.gender || 'N/A'} • {selectedVendor.kyc_documents?.dob || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">City / State:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.address?.city || selectedVendor.city || 'N/A'}, {selectedVendor.address?.state || selectedVendor.state || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Business Details */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={15} className="text-emerald-500" />
                <span>2. Business Details</span>
              </h4>
              <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-custom font-medium block">Business Type:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.kyc_documents?.business_details?.business_type || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Primary Category:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.kyc_documents?.business_details?.primary_category || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">GSTIN:</span>
                  <span className="font-mono font-extrabold uppercase text-foreground">
                    {selectedVendor.kyc_documents?.business_details?.gstin || 'N/A (Exempt)'}
                  </span>
                </div>
                <div className="col-span-3">
                  <span className="text-muted-custom font-medium block">Operating Address:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.address?.address || selectedVendor.address || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Bank Details */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={15} className="text-indigo-500" />
                <span>3. Bank Details</span>
              </h4>
              <div className="p-4 bg-background-secondary rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-custom font-medium block">Account Holder:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.kyc_documents?.bank_details?.account_holder_name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Bank Name:</span>
                  <span className="font-bold text-foreground">
                    {selectedVendor.kyc_documents?.bank_details?.bank_name || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Account Number:</span>
                  <span className="font-mono font-bold text-foreground">
                    {selectedVendor.kyc_documents?.bank_details?.account_number
                      ? '•••• ' + selectedVendor.kyc_documents.bank_details.account_number.slice(-4)
                      : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">IFSC Code:</span>
                  <span className="font-mono font-extrabold uppercase text-foreground">
                    {selectedVendor.kyc_documents?.bank_details?.ifsc_code || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-custom font-medium block">Account Type:</span>
                  <span className="font-bold text-foreground capitalize">
                    {selectedVendor.kyc_documents?.bank_details?.account_type || 'Savings'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Uploaded Documents */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={15} className="text-amber-500" />
                <span>4. Submitted Verification Documents</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { label: 'PAN Card Copy', url: selectedVendor.kyc_documents?.documents?.pan_card },
                  { label: 'GST / ID Proof', url: selectedVendor.kyc_documents?.documents?.id_proof },
                  { label: 'Address Proof', url: selectedVendor.kyc_documents?.documents?.address_proof },
                  { label: 'Cancelled Cheque', url: selectedVendor.kyc_documents?.documents?.bank_proof },
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

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border-custom flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-5 py-2 bg-background-secondary border border-border-custom hover:bg-card text-foreground font-bold text-xs rounded-xl"
              >
                Close
              </button>
              {(selectedVendor.status === 'pending' || selectedVendor.status === 'rejected') && (
                <button
                  onClick={() => handleApprove(selectedVendor.id, selectedVendor.store_name)}
                  className="px-5 py-2 bg-emerald-500 text-white font-black text-xs rounded-xl hover:bg-emerald-600"
                >
                  Approve Application
                </button>
              )}
              {selectedVendor.status === 'pending' && (
                <button
                  onClick={() => handleReject(selectedVendor.id, selectedVendor.store_name)}
                  className="px-5 py-2 bg-rose-500 text-white font-black text-xs rounded-xl hover:bg-rose-600"
                >
                  Reject Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

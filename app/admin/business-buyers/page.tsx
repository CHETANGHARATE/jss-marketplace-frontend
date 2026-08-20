'use client';

import React, { useEffect, useState } from 'react';
import { b2bService, BusinessAccount } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Eye,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminBusinessBuyersPage() {
  const [accounts, setAccounts] = useState<BusinessAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<BusinessAccount | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const { success, error: toastError, info } = useToast();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getAdminBusinessBuyers(statusFilter || undefined);
      setAccounts(data || []);
    } catch (err) {
      console.error('Failed to load business buyers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [statusFilter]);

  const handleVerify = async (status: 'verified' | 'rejected' | 'changes_required') => {
    if (!selectedAccount) return;
    setUpdating(true);

    try {
      const updated = await b2bService.verifyBusinessBuyer(
        selectedAccount.id,
        status,
        status !== 'verified' ? rejectionReason : undefined
      );

      success(`Business application updated to ${status}.`, 'KYC Status Updated');
      setSelectedAccount(null);
      setRejectionReason('');
      fetchAccounts();
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to update verification status', 'Error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <span>Business Buyer Verification & KYC</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Review GSTIN, PAN, and corporate documents for B2B wholesale access.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-border px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="changes_required">Changes Required</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading business applications...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No business accounts found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-secondary border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Business Name & Trade</th>
                  <th className="px-6 py-4">Entity Type</th>
                  <th className="px-6 py-4">GSTIN & PAN</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <strong className="block font-bold text-foreground">{acc.legal_business_name}</strong>
                      {acc.trade_name && <span className="text-[11px] text-muted-foreground">Trade: {acc.trade_name}</span>}
                    </td>
                    <td className="px-6 py-4">{acc.business_type}</td>
                    <td className="px-6 py-4 font-mono">
                      <div>GST: <strong>{acc.gstin || 'N/A'}</strong></div>
                      <div>PAN: {acc.pan || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{acc.contact_person}</div>
                      <div className="text-[11px] text-muted-foreground">{acc.business_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          acc.status === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : acc.status === 'rejected'
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {acc.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAccount(acc)}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2 font-black text-base text-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>KYC Application Review</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-background-secondary p-4 rounded-2xl border border-border/50">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Legal Business Name</span>
                  <span className="font-bold text-foreground">{selectedAccount.legal_business_name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Entity Type</span>
                  <span className="font-bold text-foreground">{selectedAccount.business_type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">GSTIN</span>
                  <span className="font-mono font-bold text-primary">{selectedAccount.gstin || 'Not Provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">PAN</span>
                  <span className="font-mono font-bold text-foreground">{selectedAccount.pan || 'Not Provided'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">Registered Address</span>
                <p className="text-foreground">{selectedAccount.registered_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Contact Person</span>
                  <span className="font-bold text-foreground">{selectedAccount.contact_person}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">Email & Phone</span>
                  <span className="text-foreground">{selectedAccount.business_email} • {selectedAccount.business_phone}</span>
                </div>
              </div>
            </div>

            {/* Rejection / Note Input */}
            <div className="space-y-1.5">
              <label className="text-foreground/80 block font-bold">Admin Remarks / Reason (for Reject or Changes)</label>
              <textarea
                rows={2}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Specify reason if rejecting or requesting corrections..."
                className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <button
                type="button"
                disabled={updating}
                onClick={() => handleVerify('changes_required')}
                className="px-4 py-2.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 font-bold rounded-xl transition-colors"
              >
                Request Changes
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleVerify('rejected')}
                className="px-4 py-2.5 bg-red-600/10 text-red-600 hover:bg-red-600/20 font-bold rounded-xl transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleVerify('verified')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                {updating ? <Sparkles className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Approve & Verify</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

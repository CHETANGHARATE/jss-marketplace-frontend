'use client';

import React, { useEffect, useState } from 'react';
import { b2bService, BusinessCreditAccount } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  X,
  Edit,
  RotateCcw,
} from 'lucide-react';

export default function AdminCreditManagementPage() {
  const [accounts, setAccounts] = useState<BusinessCreditAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Limit Approval Modal
  const [editingAccount, setEditingAccount] = useState<BusinessCreditAccount | null>(null);
  const [creditLimit, setCreditLimit] = useState<number>(100000);
  const [dueDays, setDueDays] = useState<number>(30);
  const [accountStatus, setAccountStatus] = useState<string>('active');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  // Repayment Modal
  const [repaymentAccount, setRepaymentAccount] = useState<BusinessCreditAccount | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState<number>(10000);
  const [refId, setRefId] = useState<string>('');
  const [repaymentNotes, setRepaymentNotes] = useState<string>('');
  const [recording, setRecording] = useState(false);

  const { success, error: toastError, info } = useToast();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getAdminCreditAccounts(statusFilter || undefined);
      setAccounts(data || []);
    } catch (err) {
      console.error('Failed to load credit accounts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [statusFilter]);

  const handleApproveLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    setUpdating(true);

    try {
      await b2bService.approveCreditLimit(editingAccount.id, {
        credit_limit: Number(creditLimit),
        repayment_due_days: Number(dueDays),
        status: accountStatus,
        admin_notes: adminNotes,
      });

      success('Business credit limit & terms updated successfully.', 'Credit Limit Set');
      setEditingAccount(null);
      fetchAccounts();
    } catch (err: any) {
      toastError('Failed to update credit limit.', 'Error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRecordRepayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repaymentAccount) return;
    setRecording(true);

    try {
      await b2bService.recordCreditRepayment(
        repaymentAccount.id,
        Number(repaymentAmount),
        refId,
        repaymentNotes
      );

      success('Repayment recorded and credit limit restored.', 'Repayment Recorded');
      setRepaymentAccount(null);
      fetchAccounts();
    } catch (err: any) {
      toastError('Failed to record repayment.', 'Error');
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span>Business Credit & Pay-Later Underwriting</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage revolving trade credit limits, Net repayment terms, and record customer repayments.
          </p>
        </div>

        {/* Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-card border border-border px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
        >
          <option value="">All Credit Accounts</option>
          <option value="active">Active</option>
          <option value="pending">Pending Underwriting</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
            Loading credit accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No credit accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background-secondary border-b border-border/60 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-4">Buyer / Entity</th>
                  <th className="px-6 py-4">Credit Limit</th>
                  <th className="px-6 py-4">Available Credit</th>
                  <th className="px-6 py-4">Used Credit</th>
                  <th className="px-6 py-4">Terms</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium text-foreground">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <strong className="block font-bold text-foreground">
                        {acc.user?.business_account?.legal_business_name || acc.user?.name || 'Customer Account'}
                      </strong>
                      <span className="text-[11px] text-muted-foreground">{acc.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 font-bold font-mono">
                      ₹{Number(acc.credit_limit).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{Number(acc.available_credit).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-bold font-mono text-amber-600 dark:text-amber-400">
                      ₹{Number(acc.used_credit).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-semibold">Net-{acc.repayment_due_days} Days</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          acc.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}
                      >
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAccount(acc);
                          setCreditLimit(acc.credit_limit);
                          setDueDays(acc.repayment_due_days);
                          setAccountStatus(acc.status);
                        }}
                        className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Limit</span>
                      </button>

                      {acc.used_credit > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setRepaymentAccount(acc);
                            setRepaymentAmount(acc.used_credit);
                          }}
                          className="px-3 py-1.5 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Repayment</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Limit Modal */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2 font-black text-base text-foreground">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Adjust Credit Limit & Terms</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApproveLimit} className="space-y-4 font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Credit Limit (₹) *</label>
                <input
                  type="number"
                  step={5000}
                  required
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Repayment Due Cycle (Days) *</label>
                <select
                  value={dueDays}
                  onChange={(e) => setDueDays(parseInt(e.target.value, 10))}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value={15}>Net-15 Days</option>
                  <option value={30}>Net-30 Days</option>
                  <option value={45}>Net-45 Days</option>
                  <option value={60}>Net-60 Days</option>
                  <option value={90}>Net-90 Days</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Account Status *</label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Repayment Modal */}
      {repaymentAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2 font-black text-base text-foreground">
                <RotateCcw className="w-5 h-5 text-emerald-500" />
                <span>Record Repayment Receipt</span>
              </div>
              <button
                type="button"
                onClick={() => setRepaymentAccount(null)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordRepayment} className="space-y-4 font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">
                  Repayment Amount (₹) * <span className="text-muted-custom font-normal">(Outstanding: ₹{repaymentAccount.used_credit})</span>
                </label>
                <input
                  type="number"
                  step={1}
                  required
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Bank UTR / Transaction Reference ID</label>
                <input
                  type="text"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  placeholder="e.g. UTR123456789"
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setRepaymentAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
                >
                  Confirm Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

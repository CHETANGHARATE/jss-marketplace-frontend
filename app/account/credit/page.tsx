'use client';

import React, { useEffect, useState } from 'react';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, BusinessCreditAccount } from '@/services/b2bService';
import { useToast } from '@/components/Toast';
import {
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from 'lucide-react';

export default function BusinessCreditPage() {
  const [account, setAccount] = useState<BusinessCreditAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [requestedLimit, setRequestedLimit] = useState(100000);
  const [turnover, setTurnover] = useState('₹50 Lakhs - ₹1 Crore');
  const [notes, setNotes] = useState('');
  const [applying, setApplying] = useState(false);

  const { success, error: toastError, info } = useToast();

  const fetchCreditAccount = async () => {
    setLoading(true);
    try {
      const data = await b2bService.getCreditAccount();
      setAccount(data);
    } catch (err) {
      console.error('Failed to load credit account', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditAccount();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);

    try {
      await b2bService.applyForCredit({
        requested_limit: Number(requestedLimit),
        business_turnover: turnover,
        notes,
      });

      success('Credit limit application submitted! Our underwriting team will review your account.', 'Application Submitted');
      setIsApplyModalOpen(false);
      fetchCreditAccount();
    } catch (err: any) {
      toastError(err.response?.data?.message || 'Failed to submit credit application', 'Error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Business Trade Credit (Pay-Later)' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          {/* Credit Overview Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-emerald-800/40 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                  <CreditCard size={13} />
                  <span>JSS Trade Pay-Later</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Commercial Credit Account</h1>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all self-start sm:self-auto"
              >
                {account?.status === 'active' ? 'Request Limit Increase' : 'Apply for Credit'}
              </button>
            </div>

            {/* Credit Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 font-bold block uppercase">Approved Limit</span>
                <span className="text-2xl font-black text-white block">
                  ₹{Number(account?.credit_limit || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Net-{account?.repayment_due_days || 30} Days Term
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 font-bold block uppercase">Available Credit</span>
                <span className="text-2xl font-black text-emerald-400 block">
                  ₹{Number(account?.available_credit || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">Ready for Instant Checkout</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-xs text-slate-400 font-bold block uppercase">Used / Outstanding</span>
                <span className="text-2xl font-black text-amber-400 block">
                  ₹{Number(account?.used_credit || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block">Pay before due cycle</span>
              </div>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h2 className="text-lg font-extrabold text-foreground">Credit Ledger & Transaction History</h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                Loading credit ledger...
              </div>
            ) : !account?.transactions || account.transactions.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <CreditCard className="w-10 h-10 mx-auto text-muted-foreground/40" />
                <h3 className="font-bold text-sm text-foreground">No Credit Transactions Recorded</h3>
                <p className="text-xs text-muted-foreground">
                  Your credit adjustments, B2B order deductions, and repayments will appear in this ledger.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {account.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-background-secondary border border-border/50 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'repayment' || tx.type === 'credit_assigned'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {tx.type === 'repayment' || tx.type === 'credit_assigned' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground capitalize">{tx.type.replace(/_/g, ' ')}</h4>
                        <span className="text-[11px] text-muted-foreground">{tx.notes || 'Internal adjustment'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-black text-sm block ${
                          tx.type === 'repayment' || tx.type === 'credit_assigned'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground'
                        }`}
                      >
                        {tx.type === 'order_deduction' ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Bal: ₹{Number(tx.balance_after).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Apply Credit Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <div className="flex items-center gap-2 text-foreground font-black text-base">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                <span>Apply for Business Trade Credit</span>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Requested Credit Limit (₹) *</label>
                <input
                  type="number"
                  required
                  min={5000}
                  step={5000}
                  value={requestedLimit}
                  onChange={(e) => setRequestedLimit(parseInt(e.target.value, 10) || 10000)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Annual Business Turnover</label>
                <select
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                  className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Under ₹25 Lakhs">Under ₹25 Lakhs</option>
                  <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                  <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                  <option value="₹1 Crore - ₹5 Crores">₹1 Crore - ₹5 Crores</option>
                  <option value="₹5 Crores+">₹5 Crores+</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/80 block">Notes for Underwriting Team (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Expected monthly procurement volume, preferred payment cycle..."
                  className="w-full bg-background border border-border p-3 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary resize-none font-normal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  {applying ? <Sparkles className="w-4 h-4 animate-spin" /> : <span>Submit Application</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

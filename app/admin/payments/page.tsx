'use client';

import React, { useState } from 'react';
import { useAdminPaymentsQuery, useRefundPaymentMutation } from '../../../hooks/useAdmin';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import {
  CreditCard,
  RefreshCw,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  Hash
} from 'lucide-react';
import { useToast } from '../../../components/Toast';

export default function AdminPaymentsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isFetching } = useAdminPaymentsQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
  });

  const refundMutation = useRefundPaymentMutation();
  const payments = data?.data || [];
  const meta = data?.meta;

  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [refundPaymentTarget, setRefundPaymentTarget] = useState<any | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('Customer cancellation / return');

  const handleOpenRefundModal = (payment: any) => {
    setRefundPaymentTarget(payment);
    setRefundAmount(Number(payment.amount));
    setRefundReason('Customer cancellation / return');
  };

  const handleExecuteRefund = () => {
    if (!refundPaymentTarget || refundAmount <= 0) return;

    refundMutation.mutate(
      {
        order_id: refundPaymentTarget.order_id,
        amount: refundAmount,
        reason: refundReason,
      },
      {
        onSuccess: () => {
          toastSuccess(`Refund of ₹${refundAmount.toLocaleString()} initiated successfully via Razorpay.`);
          setRefundPaymentTarget(null);
          refetch();
        },
        onError: (err: any) => {
          toastError(err?.response?.data?.message || err.message || 'Refund processing failed.');
        },
      }
    );
  };

  const statusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'captured':
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Captured</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/10 text-purple-600 border border-purple-500/20">
            <RotateCcw className="w-3 h-3" />
            <span>Refunded</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/10 text-rose-600 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-500/10 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Gateways & Transaction Log"
        subtitle="Live Razorpay orders, webhook reconciliation, transaction status, and instant gateway refunds."
        badge="Payment Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]}
        actions={
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        }
      />

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border-custom/80 rounded-2xl p-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-custom" />
          <input
            type="text"
            placeholder="Search by Payment #, Txn ID, Order #, or Customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-background text-xs rounded-xl border border-border-custom/60 focus:outline-hidden focus:border-primary text-foreground placeholder:text-muted-custom"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All', value: '' },
            { label: 'Captured', value: 'captured' },
            { label: 'Pending', value: 'pending' },
            { label: 'Refunded', value: 'refunded' },
            { label: 'Failed', value: 'failed' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.value
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background-secondary text-muted-custom hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading payment gateway transactions...
        </div>
      ) : payments.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl">
          <CreditCard className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Transactions Found</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            {search || statusFilter
              ? 'No payment records matched your current search filters.'
              : 'Payment transactions captured via Razorpay, UPI, Cards, and COD will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                  <th className="py-3.5 px-4">Payment #</th>
                  <th className="py-3.5 px-4">Gateway Txn ID</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Gateway</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60 font-medium">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      {p.payment_number || `PAY-${p.id}`}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/80 max-w-[140px] truncate">
                      {p.transaction_id || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{p.order?.order_number || p.order_id}
                    </td>
                    <td className="py-3.5 px-4 text-foreground">
                      <div className="font-bold text-xs truncate max-w-[140px]">{p.user?.name || 'Customer'}</div>
                      <div className="text-[11px] text-muted-custom truncate max-w-[140px]">{p.user?.email || ''}</div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-foreground">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 uppercase font-bold text-[11px] text-muted-custom">
                      {p.gateway || 'razorpay'}
                    </td>
                    <td className="py-3.5 px-4">
                      {statusBadge(p.status)}
                    </td>
                    <td className="py-3.5 px-4 text-muted-custom text-[11px] whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPayment(p)}
                          className="p-1.5 hover:bg-background-secondary text-muted-custom hover:text-foreground rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {p.status === 'captured' && (
                          <button
                            onClick={() => handleOpenRefundModal(p)}
                            className="px-2.5 py-1 text-[11px] font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-4 py-3 border-t border-border-custom/60 flex items-center justify-between text-xs">
              <span className="text-muted-custom font-medium">
                Page {meta.current_page} of {meta.last_page} ({meta.total} records)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-background-secondary rounded-lg font-bold disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= meta.last_page}
                  onClick={() => setPage((prev) => Math.min(meta.last_page, prev + 1))}
                  className="px-3 py-1 bg-background-secondary rounded-lg font-bold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment Details Drawer / Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card text-foreground w-full max-w-lg border border-border-custom/80 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-custom/60">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-base font-black">Payment Details</h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 hover:bg-background-secondary rounded-lg text-muted-custom hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-background-secondary rounded-2xl">
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Payment Number</div>
                  <div className="font-mono font-bold text-primary mt-0.5">{selectedPayment.payment_number}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Status</div>
                  <div className="mt-0.5">{statusBadge(selectedPayment.status)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Order Number</div>
                  <div className="font-mono font-bold text-foreground mt-0.5">#{selectedPayment.order?.order_number || selectedPayment.order_id}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Amount</div>
                  <div className="font-bold text-sm text-foreground mt-0.5">₹{Number(selectedPayment.amount).toLocaleString('en-IN')} {selectedPayment.currency}</div>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-background-secondary rounded-2xl">
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Gateway & Transaction ID</div>
                  <div className="font-mono text-foreground font-semibold mt-0.5">{selectedPayment.gateway?.toUpperCase()}: {selectedPayment.transaction_id || 'Not Assigned'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black text-muted-custom">Customer</div>
                  <div className="text-foreground font-semibold mt-0.5">{selectedPayment.user?.name} ({selectedPayment.user?.email})</div>
                </div>
                {selectedPayment.paid_at && (
                  <div>
                    <div className="text-[10px] uppercase font-black text-muted-custom">Paid At</div>
                    <div className="text-foreground font-semibold mt-0.5">{new Date(selectedPayment.paid_at).toLocaleString('en-IN')}</div>
                  </div>
                )}
                {selectedPayment.error_description && (
                  <div>
                    <div className="text-[10px] uppercase font-black text-rose-500">Error Details</div>
                    <div className="text-rose-500 font-semibold mt-0.5">{selectedPayment.error_description} ({selectedPayment.error_code})</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-background-secondary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process Refund Modal */}
      {refundPaymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card text-foreground w-full max-w-md border border-border-custom/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-black">Process Razorpay Refund</h3>
            </div>

            <p className="text-xs text-muted-custom">
              You are issuing a refund for Order #{refundPaymentTarget.order?.order_number}. The refund will be credited back to the customer's original payment method via Razorpay.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Refund Amount (Max: ₹{Number(refundPaymentTarget.amount).toLocaleString('en-IN')})
                </label>
                <input
                  type="number"
                  min="1"
                  max={Number(refundPaymentTarget.amount)}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-background text-foreground border border-border-custom/80 rounded-xl font-bold focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-foreground mb-1">
                  Refund Reason
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="State the reason for this refund..."
                  className="w-full px-3.5 py-2 bg-background text-foreground border border-border-custom/80 rounded-xl text-xs focus:outline-hidden focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end pt-3">
              <button
                type="button"
                onClick={() => setRefundPaymentTarget(null)}
                className="px-4 py-2 border border-border-custom/80 rounded-xl text-xs font-bold hover:bg-background-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRefund}
                disabled={refundMutation.isPending || refundAmount <= 0}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {refundMutation.isPending ? 'Processing Refund...' : `Refund ₹${refundAmount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

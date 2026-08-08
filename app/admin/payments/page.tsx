'use client';

import React from 'react';
import { useAdminPaymentsQuery } from '../../../hooks/useAdmin';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { CreditCard, DollarSign, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminPaymentsPage() {
  const { data, isLoading, refetch } = useAdminPaymentsQuery();
  const payments = data?.data || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Gateways & Transaction Log"
        subtitle="Track digital payment captures (UPI, Cards, Net Banking), COD collection reconciliation, gateway transactions, and refund statuses."
        badge="Payment Operations"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]}
        actions={
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl hover:bg-card flex items-center gap-1.5"
          >
            <RefreshCw size={15} />
            <span>Refresh Transactions</span>
          </button>
        }
      />

      {isLoading ? (
        <div className="py-16 text-center text-xs font-bold text-muted-custom animate-pulse">
          Loading payment gateway transactions...
        </div>
      ) : payments.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-card border border-border-custom/80 rounded-3xl">
          <CreditCard className="w-12 h-12 text-muted-custom/40 mx-auto" />
          <h3 className="text-base font-black text-foreground">No Transactions Captured</h3>
          <p className="text-xs text-muted-custom font-medium max-w-sm mx-auto">
            Payment transactions captured via UPI, Razorpay/PhonePe, and COD will be listed here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border-custom/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-border-custom/60 bg-background-secondary text-muted-custom uppercase text-[10px] tracking-wider font-black">
                  <th className="py-3.5 px-4">Transaction Reference</th>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Payment Gateway</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-custom/60">
                {payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-background-secondary/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-primary">
                      {p.transaction_id || `TXN-${p.id}`}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      #{p.order?.order_number || p.order_id}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-foreground font-bold">
                      {p.payment_method || 'Online Gateway'}
                    </td>
                    <td className="py-3.5 px-4 font-black text-foreground">
                      ₹{p.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500">
                        {p.status || 'Success'}
                      </span>
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

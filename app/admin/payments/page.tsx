'use client';

import React from 'react';
import { useAdminPaymentsQuery } from '../../../hooks/useAdmin';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AdminSidebar } from '../../../components/AdminSidebar';
import { CreditCard } from 'lucide-react';

export default function AdminPaymentsPage() {
  const { data, isLoading } = useAdminPaymentsQuery();
  const payments = data?.data || [];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }, { label: 'Payment Audit' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AdminSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-rose-500" />
              <span>Payment Gateway Audit Log</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Track real-time digital payment captures, COD authorizations, and gateway settlement logs.
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
              Loading payment transactions...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-xs text-foreground/50 bg-muted/20 rounded-2xl">
              No payment transactions captured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                    <th className="pb-3 px-2">Payment ID</th>
                    <th className="pb-3 px-2">Order Ref</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Gateway</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-muted/20">
                      <td className="py-3.5 px-2 font-mono font-bold text-rose-500">{pay.payment_id}</td>
                      <td className="py-3.5 px-2 font-mono text-foreground/70">#{pay.order_number}</td>
                      <td className="py-3.5 px-2 font-black text-foreground">₹{pay.amount?.toLocaleString()}</td>
                      <td className="py-3.5 px-2 font-bold uppercase text-[10px] text-foreground/60">
                        {pay.provider}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            pay.status === 'captured'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : pay.status === 'failed'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right text-foreground/50 font-medium">
                        {new Date(pay.created_at).toLocaleDateString('en-IN')}
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

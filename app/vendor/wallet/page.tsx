'use client';

import React from 'react';
import { useVendorWalletQuery, useVendorSettlementsQuery } from '../../../hooks/useVendor';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { VendorSidebar } from '../../../components/VendorSidebar';
import { Wallet } from 'lucide-react';

export default function VendorWalletPage() {
  const { data: wallet, isLoading: isWalletLoading } = useVendorWalletQuery();
  const { data: settlements = [], isLoading: isSettlementsLoading } = useVendorSettlementsQuery();

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Vendor Portal', href: '/vendor' }, { label: 'Wallet & Settlements' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <VendorSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              <span>Vendor Wallet & Payout Settlements</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Monitor earnings, platform commissions, and automated bank payouts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-primary text-primary-foreground rounded-3xl shadow-md space-y-2">
              <span className="text-xs font-bold uppercase opacity-80 block">Available Wallet Balance</span>
              <span className="text-3xl font-black block">
                ₹{wallet?.balance ? wallet.balance.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] font-semibold opacity-70 block">Ready for settlement payout</span>
            </div>

            <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-foreground/60 uppercase block">Pending Settlement</span>
              <span className="text-3xl font-black text-amber-500 block">
                ₹{wallet?.pending_balance ? wallet.pending_balance.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] font-semibold text-foreground/40 block">Escrow pending order delivery</span>
            </div>

            <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-foreground/60 uppercase block">Total Withdrawn Payouts</span>
              <span className="text-3xl font-black text-emerald-600 block">
                ₹{wallet?.total_withdrawn ? wallet.total_withdrawn.toLocaleString() : '0'}
              </span>
              <span className="text-[10px] font-semibold text-foreground/40 block">Total lifetime payouts</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Settlement Transaction Ledger</h3>

            {isSettlementsLoading ? (
              <div className="py-12 text-center text-xs text-foreground/50 animate-pulse">
                Loading settlement history...
              </div>
            ) : settlements.length === 0 ? (
              <div className="py-12 text-center text-xs text-foreground/50 bg-muted/20 rounded-2xl">
                No payout settlement records generated yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/40 text-foreground/50 uppercase text-[10px]">
                      <th className="pb-3 px-2">Settlement Ref</th>
                      <th className="pb-3 px-2">Gross Sales</th>
                      <th className="pb-3 px-2">Commission Fee</th>
                      <th className="pb-3 px-2">Net Payout</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {settlements.map((set) => (
                      <tr key={set.id} className="hover:bg-muted/20">
                        <td className="py-3.5 px-2 font-mono font-bold text-primary">#{set.settlement_number}</td>
                        <td className="py-3.5 px-2">₹{set.amount?.toLocaleString()}</td>
                        <td className="py-3.5 px-2 text-rose-500">-₹{set.commission_fee?.toLocaleString()}</td>
                        <td className="py-3.5 px-2 font-black text-emerald-600">₹{set.net_amount?.toLocaleString()}</td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              set.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-amber-500/10 text-amber-600'
                            }`}
                          >
                            {set.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right text-foreground/50 font-medium">
                          {new Date(set.created_at).toLocaleDateString('en-IN')}
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
    </div>
  );
}

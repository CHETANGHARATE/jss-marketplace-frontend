'use client';

import React, { useState } from 'react';
import { useLoyaltyQuery, useRedeemPointsMutation } from '../../../hooks/useLoyalty';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AccountSidebar } from '../../../components/AccountSidebar';
import { Gift, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoyaltyRewardsPage() {
  const { data: loyalty, isLoading } = useLoyaltyQuery();
  const redeemMutation = useRedeemPointsMutation();

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(100);
  const [successNotice, setSuccessNotice] = useState<boolean>(false);

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    redeemMutation.mutate(pointsToRedeem, {
      onSuccess: () => {
        setSuccessNotice(true);
        setTimeout(() => setSuccessNotice(false), 3000);
      },
    });
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Account Dashboard', href: '/account' }, { label: 'Loyalty Rewards' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Gift className="w-6 h-6 text-primary" />
              <span>Customer Loyalty Rewards</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Earn reward points on every order and redeem them for instant discount vouchers.
            </p>
          </div>

          {successNotice && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-600 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Points redeemed successfully! Check your cart for the applied discount.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground rounded-3xl shadow-md space-y-2">
              <span className="text-xs font-bold uppercase opacity-80 block">Available Reward Points</span>
              <span className="text-3xl font-black block">
                {loyalty?.available_points || 0} PTS
              </span>
              <span className="text-[10px] font-semibold opacity-70 block">
                Valued at ₹{loyalty?.points_value_in_currency || 0}
              </span>
            </div>

            <div className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-bold text-foreground/60 uppercase block">Membership Tier</span>
              <span className="text-2xl font-black text-amber-500 flex items-center gap-1.5 pt-1">
                <Award className="w-5 h-5 fill-current" />
                <span>{loyalty?.tier_name || 'VIP Gold'}</span>
              </span>
              <span className="text-[10px] font-semibold text-foreground/40 block">Earn 2x points per ₹100 spent</span>
            </div>

            <form onSubmit={handleRedeem} className="p-6 bg-muted/20 border border-border/40 rounded-3xl space-y-3">
              <span className="text-xs font-bold text-foreground/70 block">Redeem Points for Cash Voucher</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={50}
                  step={50}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                  className="flex-1 bg-card border border-border/40 rounded-xl px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={redeemMutation.isPending}
                  className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1"
                >
                  {redeemMutation.isPending ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : 'Redeem'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Points Ledger History</h3>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
                Loading points history...
              </div>
            ) : !loyalty?.history || loyalty.history.length === 0 ? (
              <div className="py-8 text-center text-xs text-foreground/50 bg-muted/20 rounded-2xl">
                No reward point transactions logged yet. Place orders to start earning points!
              </div>
            ) : (
              <div className="space-y-3">
                {loyalty.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-card border border-border/40 rounded-2xl text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground block">{item.description}</span>
                      <span className="text-[10px] text-foreground/40 font-semibold block">
                        {new Date(item.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <span
                      className={`font-black text-sm ${
                        item.type === 'earned' ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {item.type === 'earned' ? `+${item.points}` : `-${item.points}`} PTS
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

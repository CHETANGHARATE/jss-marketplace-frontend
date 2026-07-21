'use client';

import React, { useState } from 'react';
import { useReferralQuery } from '../../../hooks/useReferral';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { AccountSidebar } from '../../../components/AccountSidebar';
import { Share2, Copy, CheckCircle2, DollarSign, Users } from 'lucide-react';

export default function ReferralProgramPage() {
  const { data: referral, isLoading } = useReferralQuery();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const code = referral?.referral_code || 'JSS-REF-892';
  const url = referral?.shareable_url || 'http://localhost:3000/register?ref=JSS-REF-892';

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Account Dashboard', href: '/account' }, { label: 'Refer & Earn' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <div className="flex-1 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 min-w-0 w-full">
          <div className="pb-4 border-b border-border/40">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Share2 className="w-6 h-6 text-primary" />
              <span>Refer Friends & Earn Cash Rewards</span>
            </h1>
            <p className="text-xs text-foreground/60 font-medium mt-1">
              Invite friends to shop on JSS Marketplace. Earn ₹250 for every friend who makes their first purchase!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-3">
              <span className="text-xs font-bold text-foreground/60 uppercase block">Your Unique Referral Code</span>
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-border/40 font-mono font-black text-lg text-primary">
                <span>{code}</span>
                <button
                  onClick={() => handleCopy(code, 'code')}
                  className="p-1.5 text-foreground/40 hover:text-primary transition-colors"
                >
                  {copiedType === 'code' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-3">
              <span className="text-xs font-bold text-foreground/60 uppercase block">Shareable Invitation Link</span>
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-border/40 font-mono font-semibold text-xs text-foreground truncate">
                <span className="truncate">{url}</span>
                <button
                  onClick={() => handleCopy(url, 'url')}
                  className="p-1.5 text-foreground/40 hover:text-primary transition-colors shrink-0 ml-2"
                >
                  {copiedType === 'url' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-1">
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-2xl font-black text-foreground block">{referral?.total_referrals || 0}</span>
              <span className="text-xs font-bold text-foreground/60 block">Friends Invited</span>
            </div>

            <div className="p-5 bg-card border border-border/40 rounded-3xl shadow-sm space-y-1">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-black text-emerald-600 block">
                ₹{referral?.total_earnings ? referral.total_earnings.toLocaleString() : '0'}
              </span>
              <span className="text-xs font-bold text-foreground/60 block">Total Reward Cash Earned</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Referral Activity History</h3>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
                Loading referral history...
              </div>
            ) : !referral?.history || referral.history.length === 0 ? (
              <div className="py-8 text-center text-xs text-foreground/50 bg-muted/20 rounded-2xl">
                No friends referred yet. Share your invitation link above to start earning!
              </div>
            ) : (
              <div className="space-y-3">
                {referral.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-card border border-border/40 rounded-2xl text-xs"
                  >
                    <div>
                      <span className="font-bold text-foreground block">{item.referee_name}</span>
                      <span className="text-[10px] text-foreground/40 font-semibold block">
                        Joined on {new Date(item.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">+₹{item.reward_amount}</span>
                      <span className="text-[10px] font-bold uppercase text-emerald-600">{item.status}</span>
                    </div>
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

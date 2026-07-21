'use client';

import React from 'react';
import { useFlashSalesQuery } from '../../hooks/useFlashSales';
import { useCampaignsQuery } from '../../hooks/usePromotions';
import { useCouponsQuery } from '../../hooks/useCoupons';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { FlashSaleBanner } from '../../components/FlashSaleBanner';
import { Tag, Sparkles, Copy, CheckCircle2 } from 'lucide-react';

export default function PromotionsPage() {
  const { data: flashSales = [] } = useFlashSalesQuery();
  const { data: campaigns = [], isLoading: isCampaignsLoading } = useCampaignsQuery();
  const { data: coupons = [], isLoading: isCouponsLoading } = useCouponsQuery();

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const defaultFlashSale = flashSales[0] || {
    id: 1,
    title: 'Mega Summer Super Sale 2026',
    banner_image: '',
    discount_percentage: 50,
    starts_at: '',
    ends_at: '',
    products: [],
  };

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: 'Promotional Deals & Campaigns' }]} />

      <FlashSaleBanner sale={defaultFlashSale} />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Active Promo Coupons</h2>
        </div>

        {isCouponsLoading ? (
          <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
            Loading active coupon offers...
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-xs text-foreground/50 py-4">No active promo coupons available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-5 bg-card border border-dashed border-primary/40 rounded-3xl shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-primary text-base uppercase tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {coupon.type === 'percentage' ? `${coupon.discount_amount}% OFF` : `₹${coupon.discount_amount} OFF`}
                  </span>
                </div>

                <p className="text-xs text-foreground/60 font-medium">
                  Min order: ₹{coupon.min_order_amount?.toLocaleString()}
                </p>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="w-full py-2 bg-muted/40 hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Promo Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Active Marketplace Campaigns</h2>
        </div>

        {isCampaignsLoading ? (
          <div className="py-8 text-center text-xs text-foreground/50 animate-pulse">
            Loading active campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 bg-muted/20 border border-border/40 rounded-3xl text-center text-xs text-foreground/50">
            No active seasonal campaigns running right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-6 bg-card border border-border/40 rounded-3xl shadow-sm space-y-3 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                    {camp.discount_badge}
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground/50">Code: {camp.code}</span>
                </div>

                <h3 className="text-lg font-bold text-foreground">{camp.title}</h3>
                <p className="text-xs text-foreground/70">{camp.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

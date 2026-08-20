'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { b2bService, BuyerRequirement } from '@/services/b2bService';
import {
  Building2,
  ShieldCheck,
  Percent,
  FileText,
  CreditCard,
  Truck,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  ChevronRight,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';

export default function WholesaleHubPage() {
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    b2bService
      .getRequirements()
      .then((res) => setRequirements(res || []))
      .catch(() => setRequirements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black rounded-full uppercase tracking-wider">
              <Building2 size={13} />
              <span>JSS Business & Wholesale</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black rounded-full">
              <ShieldCheck size={13} />
              <span>Verified Enterprise Suppliers</span>
            </span>
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              India's Modern B2B & Wholesale Commerce Engine
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Source directly from verified manufacturers. Access tiered wholesale pricing, submit custom RFQs, issue legally binding Purchase Orders, and unlock JSS Trade Pay-Later credit limits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/account/business"
              className="px-6 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-black rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <span>Register Business Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/account/rfq"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-black rounded-2xl transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Custom RFQ</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-white">40%+</span>
              <span className="text-xs text-slate-400 block font-semibold">Tier Volume Discounts</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
              <span className="text-xs text-slate-400 block font-semibold">GST Input Tax Credit</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-orange-400">Net 30-90</span>
              <span className="text-xs text-slate-400 block font-semibold">Commercial Credit Terms</span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-blue-400">Escrow</span>
              <span className="text-xs text-slate-400 block font-semibold">Payment Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'B2B Wholesale Hub' }]} />

        {/* Feature Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Complete Enterprise B2B Capability</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything high-volume commercial buyers and suppliers need for seamless procurement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-card border border-border/60 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Percent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Dynamic Volume Tier Pricing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated multi-tier pricing tables calculate volume discounts live. Enforces product-specific Minimum Order Quantities (MOQ).
              </p>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Multi-Supplier RFQ & Bidding</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Post customized procurement specifications. Verified manufacturers compete with real-time quotations, lead times, and multi-round counter offers.
              </p>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-3xl space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">JSS Trade Credit (Pay-Later)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Qualified business accounts receive revolving credit limits with automated Net-30 to Net-90 repayment terms and atomic checkout ledger deductions.
              </p>
            </div>
          </div>
        </section>

        {/* Live Marketplace Buyer Requirements */}
        <section className="p-6 sm:p-8 bg-card border border-border/60 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">Open Buyer Requirements</h2>
              <p className="text-xs text-muted-foreground">
                Live bulk purchase requests currently open for supplier bidding.
              </p>
            </div>

            <Link
              href="/account/requirements"
              className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Post Your Requirement</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">Loading open requirements...</div>
          ) : requirements.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Megaphone className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">No active buyer requirements right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.slice(0, 6).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-background-secondary border border-border/60 space-y-2 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">#{req.requirement_number}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full">
                      {req.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{req.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>
                  <div className="flex items-center justify-between text-xs font-semibold pt-1">
                    <span>
                      Qty: <strong className="text-foreground">{req.quantity.toLocaleString('en-IN')} units</strong>
                    </span>
                    {req.target_price && (
                      <span className="text-primary font-black">
                        Target: ₹{Number(req.target_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="p-8 sm:p-12 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to scale your enterprise procurement?</h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Complete our fast 2-minute business KYC verification to unlock volume wholesale pricing across 50,000+ commercial products.
            </p>
          </div>

          <Link
            href="/account/business"
            className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-2xl shadow-lg transition-all shrink-0 self-start md:self-auto flex items-center gap-2"
          >
            <span>Start Business Verification</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

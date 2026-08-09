import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FooterPageLayout } from '../../components/FooterPageLayout';
import {
  Store,
  TrendingUp,
  ShieldCheck,
  Package,
  CreditCard,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become a Seller | JSS Marketplace',
  description: 'Sell your products to millions of buyers across India. Low commissions, fast settlements, and dedicated seller support.',
};

export default function BecomeSellerPage() {
  const steps = [
    { step: '01', title: 'Register Account', desc: 'Provide your business details, email, mobile number, and valid GSTIN.' },
    { step: '02', title: 'List Your Products', desc: 'Upload your product catalog using our intuitive seller dashboard or bulk Excel tool.' },
    { step: '03', title: 'Receive & Fulfill Orders', desc: 'Get notified when customers order. Pack the items and prepare for courier pickup.' },
    { step: '04', title: 'Direct Bank Settlement', desc: 'Receive payments directly in your registered bank account according to settlement schedules.' }
  ];

  return (
    <FooterPageLayout
      title="Grow Your Business with JSS Marketplace"
      subtitle="Connect directly with millions of buyers across India and scale your brand effortlessly."
      categoryName="Seller Portal"
    >
      <div className="space-y-12">

        {/* 1. Hero Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">National Reach</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Expand your customer base from regional markets to metro cities and tier-2/tier-3 towns nationwide.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Transparent Settlements</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Enjoy clear commission structures, regular bank payout cycles, and real-time sales reporting.
            </p>
          </div>

          <div className="bg-card border border-border-custom p-6 rounded-3xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Headphones size={20} />
            </div>
            <h3 className="font-extrabold text-base text-foreground">Dedicated Support</h3>
            <p className="text-xs text-muted-custom leading-relaxed">
              Get personalized assistance for cataloging, order handling, and GST invoicing compliance.
            </p>
          </div>
        </div>

        {/* 2. 4-Step Process */}
        <section className="bg-card border border-border-custom p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">How Selling Works</h2>
            <p className="text-xs text-muted-custom">Start selling on JSS Marketplace in 4 easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="p-5 bg-muted/30 border border-border-custom rounded-2xl space-y-2 relative">
                <span className="text-xs font-black text-primary uppercase">{s.step}</span>
                <h4 className="font-extrabold text-sm text-foreground">{s.title}</h4>
                <p className="text-xs text-muted-custom leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl text-center space-y-5">
          <h2 className="text-xl sm:text-3xl font-black">Ready to Become a Verified Seller?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Register your business today and start listing products on India's premier multi-vendor marketplace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/seller/register"
              className="bg-primary hover:bg-primary-hover text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Start Selling Now</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/seller/login"
              className="bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase px-8 py-3.5 rounded-2xl border border-slate-700 transition-all"
            >
              <span>Existing Seller Login</span>
            </Link>
          </div>
        </section>

      </div>
    </FooterPageLayout>
  );
}

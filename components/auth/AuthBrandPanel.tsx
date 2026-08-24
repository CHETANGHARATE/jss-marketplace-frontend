'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Zap,
  RefreshCw,
  Award,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Users,
  Package,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

export const TRUST_STATS = [
  { value: '10,000+', label: 'Happy Customers', icon: Users },
  { value: '5,000+', label: 'Verified Products', icon: Package },
  { value: '100%', label: 'GST Verified Sellers', icon: CheckCircle2 },
  { value: '24x7', label: 'Marketplace Support', icon: Headphones },
];

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative h-full w-full flex flex-col justify-between space-y-6">
      
      {/* Background Subtle E-Commerce Ambient Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="relative z-10 space-y-5">
        <BrandLogo variant="header" size="lg" />

        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-amber-800 text-xs font-black tracking-wide shadow-2xs">
            <Sparkles size={14} className="animate-pulse text-amber-600" />
            <span>Shop More. Save More...!</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-700 to-indigo-600">
              JSS Marketplace
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-600 max-w-md leading-relaxed">
            India's Trusted Multi-Vendor Marketplace delivering authentic products from GSTIN verified sellers directly to your doorstep.
          </p>
        </div>
      </div>

      {/* Middle Interactive Visual Composition */}
      <div className="relative z-10 my-6 py-6 border-y border-slate-200/70 grid grid-cols-1 gap-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-primary mb-1">
          Why Shop on JSS Marketplace?
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-white/80 hover:bg-blue-50/60 p-3.5 rounded-2xl border border-slate-200/70 hover:border-blue-300 transition-all group shadow-2xs">
            <div className="p-2 bg-blue-50 text-primary rounded-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-blue-100">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Verified Sellers</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-black">GSTIN</span>
              </h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">Only GST & compliance verified manufacturers & distributors.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 hover:bg-amber-50/60 p-3.5 rounded-2xl border border-slate-200/70 hover:border-amber-300 transition-all group shadow-2xs">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0 border border-amber-100">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Secure Payments</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">Safe and protected marketplace transactions with Razorpay & UPI.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 hover:bg-emerald-50/60 p-3.5 rounded-2xl border border-slate-200/70 hover:border-emerald-300 transition-all group shadow-2xs">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 border border-emerald-100">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Delivery</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">Express dispatch across 25,000+ PIN codes with real-time tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 hover:bg-purple-50/60 p-3.5 rounded-2xl border border-slate-200/70 hover:border-purple-300 transition-all group shadow-2xs">
            <div className="p-2 bg-purple-50 text-purple-700 rounded-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 border border-purple-100">
              <RefreshCw size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Easy Returns</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">Simple return and hassle-free replacement policy.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/80 hover:bg-rose-50/60 p-3.5 rounded-2xl border border-slate-200/70 hover:border-rose-300 transition-all group shadow-2xs">
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all shrink-0 border border-rose-100">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Buyer Protection</h4>
              <p className="text-[11px] text-slate-500 font-medium leading-snug">100% authentic product guarantee or full money refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Reusable Trust Stats Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {TRUST_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white/90 p-3 rounded-2xl border border-slate-200/80 text-center space-y-0.5 shadow-2xs">
              <Icon size={16} className="text-primary mx-auto mb-1" />
              <div className="text-base font-black text-slate-900 leading-tight">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

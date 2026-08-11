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

export const TRUST_STATS = [
  { value: '10,000+', label: 'Happy Customers', icon: Users },
  { value: '5,000+', label: 'Verified Products', icon: Package },
  { value: '100%', label: 'GST Verified Sellers', icon: CheckCircle2 },
  { value: '24x7', label: 'Marketplace Support', icon: Headphones },
];

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A58CA] text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden shadow-2xl rounded-3xl border border-slate-800">
      
      {/* Background Subtle E-Commerce Ornaments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="relative z-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0A58CA] to-[#0284C7] p-2.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform border border-blue-400/30">
            <ShoppingBag className="w-full h-full text-white" />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>JSSSolutions</span>
              <span className="text-[#F97316]">Marketplace</span>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-300">India's Trusted B2B & B2C Platform</p>
          </div>
        </Link>

        <div className="space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-black tracking-wide">
            <Sparkles size={14} className="animate-pulse" />
            <span>Shop More. Save More...!</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-amber-300">
              JSS Marketplace
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-300 max-w-md leading-relaxed">
            India's Trusted Multi-Vendor Marketplace delivering authentic products from GSTIN verified sellers directly to your doorstep.
          </p>
        </div>
      </div>

      {/* Middle Interactive Visual Composition */}
      <div className="relative z-10 my-6 py-6 border-y border-white/10 grid grid-cols-1 gap-3.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
          Why Shop on JSS Marketplace?
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Verified Sellers</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-black">GSTIN</span>
              </h4>
              <p className="text-[11px] text-slate-300 leading-snug">Only GST & compliance verified manufacturers & distributors.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Secure Payments</h4>
              <p className="text-[11px] text-slate-300 leading-snug">Safe and protected marketplace transactions with Razorpay & UPI.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Fast Delivery</h4>
              <p className="text-[11px] text-slate-300 leading-snug">Express dispatch across 25,000+ PIN codes with real-time tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl group-hover:scale-110 transition-transform shrink-0">
              <RefreshCw size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Easy Returns</h4>
              <p className="text-[11px] text-slate-300 leading-snug">Simple return and hassle-free replacement policy.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 hover:border-blue-400/40 transition-all group">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl group-hover:scale-110 transition-transform shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Buyer Protection</h4>
              <p className="text-[11px] text-slate-300 leading-snug">100% authentic product guarantee or full money refund.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Reusable Trust Stats Strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {TRUST_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center space-y-0.5">
              <Icon size={16} className="text-amber-400 mx-auto mb-1" />
              <div className="text-base font-black text-white leading-tight">{stat.value}</div>
              <div className="text-[10px] font-semibold text-slate-300 leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

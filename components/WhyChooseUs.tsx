'use client';

import React from 'react';
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  RotateCcw,
  IndianRupee,
  MapPin,
  Headset,
  Star,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BenefitCard {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  accentColor: string;
  titleColor: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  bottomGradient: string;
  bottomGlow: string;
}

const benefits: BenefitCard[] = [
  // ─── Row 1: Cards 1–4 ───
  {
    id: 'secure-payments',
    icon: ShieldCheck,
    titleKey: 'home.why_secure_payments',
    descKey: 'home.why_secure_desc',
    accentColor: '#2563eb',
    titleColor: '#1d4ed8',
    iconBg: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
    iconBorder: 'rgba(37, 99, 235, 0.25)',
    iconColor: '#2563eb',
    bottomGradient: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
    bottomGlow: 'rgba(37, 99, 235, 0.35)',
  },
  {
    id: 'fast-delivery',
    icon: Truck,
    titleKey: 'home.why_fast_delivery',
    descKey: 'home.why_fast_desc',
    accentColor: '#ea580c',
    titleColor: '#c2410c',
    iconBg: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)',
    iconBorder: 'rgba(234, 88, 12, 0.25)',
    iconColor: '#ea580c',
    bottomGradient: 'linear-gradient(90deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
    bottomGlow: 'rgba(234, 88, 12, 0.35)',
  },
  {
    id: 'verified-sellers',
    icon: BadgeCheck,
    titleKey: 'home.why_verified_sellers',
    descKey: 'home.why_verified_desc',
    accentColor: '#16a34a',
    titleColor: '#15803d',
    iconBg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
    iconBorder: 'rgba(22, 163, 74, 0.25)',
    iconColor: '#16a34a',
    bottomGradient: 'linear-gradient(90deg, #15803d 0%, #16a34a 50%, #4ade80 100%)',
    bottomGlow: 'rgba(22, 163, 74, 0.35)',
  },
  {
    id: 'quality-products',
    icon: PackageCheck,
    titleKey: 'home.why_quality_products',
    descKey: 'home.why_quality_desc',
    accentColor: '#7c3aed',
    titleColor: '#6d28d9',
    iconBg: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 100%)',
    iconBorder: 'rgba(124, 58, 237, 0.25)',
    iconColor: '#7c3aed',
    bottomGradient: 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #a78bfa 100%)',
    bottomGlow: 'rgba(124, 58, 237, 0.35)',
  },

  // ─── Row 2: Cards 5–8 ───
  {
    id: 'easy-returns',
    icon: RotateCcw,
    titleKey: 'home.why_easy_returns',
    descKey: 'home.why_easy_returns_desc',
    accentColor: '#e11d48',
    titleColor: '#be123c',
    iconBg: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%)',
    iconBorder: 'rgba(225, 29, 72, 0.25)',
    iconColor: '#e11d48',
    bottomGradient: 'linear-gradient(90deg, #be123c 0%, #e11d48 50%, #fb7185 100%)',
    bottomGlow: 'rgba(225, 29, 72, 0.35)',
  },
  {
    id: 'direct-pricing',
    icon: IndianRupee,
    titleKey: 'home.why_direct_pricing',
    descKey: 'home.why_direct_pricing_desc',
    accentColor: '#d97706',
    titleColor: '#b45309',
    iconBg: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
    iconBorder: 'rgba(217, 119, 6, 0.25)',
    iconColor: '#d97706',
    bottomGradient: 'linear-gradient(90deg, #b45309 0%, #d97706 50%, #fcd34d 100%)',
    bottomGlow: 'rgba(217, 119, 6, 0.35)',
  },
  {
    id: 'made-in-india',
    icon: MapPin,
    titleKey: 'home.why_made_in_india',
    descKey: 'home.why_made_in_india_desc',
    accentColor: '#0d9488',
    titleColor: '#0f766e',
    iconBg: 'linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%)',
    iconBorder: 'rgba(13, 148, 136, 0.25)',
    iconColor: '#0d9488',
    bottomGradient: 'linear-gradient(90deg, #0f766e 0%, #0d9488 50%, #2dd4bf 100%)',
    bottomGlow: 'rgba(13, 148, 136, 0.35)',
  },
  {
    id: 'dedicated-support',
    icon: Headset,
    titleKey: 'home.why_dedicated_support',
    descKey: 'home.why_dedicated_support_desc',
    accentColor: '#1d4ed8',
    titleColor: '#1e40af',
    iconBg: 'linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%)',
    iconBorder: 'rgba(29, 78, 216, 0.25)',
    iconColor: '#1d4ed8',
    bottomGradient: 'linear-gradient(90deg, #1e40af 0%, #1d4ed8 50%, #60a5fa 100%)',
    bottomGlow: 'rgba(29, 78, 216, 0.35)',
  },
];

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative rounded-3xl overflow-hidden pt-12 pb-0 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#f8faff] via-white to-[#f0fdf4]/20 dark:from-[#0B132B] dark:via-[#0F172A] dark:to-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* ── Background Dotted Pattern & Corner Radial Accents ── */}
      <div className="absolute top-4 left-4 w-32 h-32 opacity-25 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" fill="none">
          <pattern id="dot-pattern-left" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" className="fill-blue-600" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-left)" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-32 h-32 opacity-25 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" fill="none">
          <pattern id="dot-pattern-right" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" className="fill-blue-600" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-right)" />
        </svg>
      </div>

      {/* Decorative leaf branch left & right */}
      <div className="absolute top-1/3 -left-4 w-16 h-32 opacity-40 dark:opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 60 120" className="w-full h-full text-emerald-500 fill-current" opacity="0.6">
          <path d="M0,60 Q30,40 50,10 Q25,30 0,60 M0,60 Q35,65 55,45 Q25,60 0,60 M0,60 Q30,85 50,110 Q25,80 0,60" />
        </svg>
      </div>
      <div className="absolute top-1/3 -right-4 w-16 h-32 opacity-40 dark:opacity-20 pointer-events-none hidden lg:block rotate-180">
        <svg viewBox="0 0 60 120" className="w-full h-full text-emerald-500 fill-current" opacity="0.6">
          <path d="M0,60 Q30,40 50,10 Q25,30 0,60 M0,60 Q35,65 55,45 Q25,60 0,60 M0,60 Q30,85 50,110 Q25,80 0,60" />
        </svg>
      </div>

      {/* ── Section Header ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5 relative z-10">
        {/* Top Gold Pill Badge */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-500/30 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
          <Star size={13} className="fill-amber-500 text-amber-500" />
          <span>{t('home.excellence') || 'MARKETPLACE EXCELLENCE'}</span>
        </div>

        {/* Main Heading: "Why Choose JSS Marketplace?" */}
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
          Why Choose <span className="text-[#2563eb]">JSS</span> Marketplace?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
          {t('home.why_choose_sub') ||
            "India's most trusted direct-from-source multi-vendor platform for retail & wholesale buyers."}
        </p>

        {/* Decorative Separator: Blue lines + green floral sprigs + central star */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {/* Left subtle blue line */}
          <span className="h-[1px] w-12 sm:w-16 bg-blue-300/70 dark:bg-blue-500/30 rounded-full" />
          
          {/* Left leaf sprig */}
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2C6.5 2 2 6.5 2 12c4-1 7-4 8-8 1 4 4 7 8 8-1-5.5-5.5-10-6-10z" />
            </svg>
          </div>

          {/* Central blue 5-point star */}
          <div className="text-blue-600 dark:text-blue-400">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          {/* Right leaf sprig */}
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 rotate-180">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2C6.5 2 2 6.5 2 12c4-1 7-4 8-8 1 4 4 7 8 8-1-5.5-5.5-10-6-10z" />
            </svg>
          </div>

          {/* Right subtle blue line */}
          <span className="h-[1px] w-12 sm:w-16 bg-blue-300/70 dark:bg-blue-500/30 rounded-full" />
        </div>
      </div>

      {/* ── 8 Benefit Cards (4 in Row 1, 4 in Row 2) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative z-10 mt-10 mb-12">
        {benefits.map((b) => {
          const Icon = b.icon;
          const title = t(b.titleKey);
          const desc = t(b.descKey);

          return (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-6.5 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group justify-between"
            >
              {/* Top Large Circular Icon Container */}
              <div
                className="w-16 sm:w-[68px] h-16 sm:h-[68px] rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm border"
                style={{
                  background: b.iconBg,
                  borderColor: b.iconBorder,
                  color: b.iconColor,
                }}
              >
                <Icon size={32} strokeWidth={2.2} />
              </div>

              {/* Title */}
              <h3
                className="font-black text-base sm:text-lg mb-2 tracking-tight transition-colors"
                style={{ color: b.titleColor }}
              >
                {title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal flex-1">
                {desc}
              </p>

              {/* Curved 3D Colored Bottom Accent Bar (matching reference style) */}
              <div
                className="w-[88%] h-2.5 rounded-t-full mt-5 transition-all duration-300 group-hover:h-3 group-hover:w-[94%]"
                style={{
                  background: b.bottomGradient,
                  boxShadow: `0 4px 12px ${b.bottomGlow}`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── Trust Quote Message ── */}
      <div className="relative z-10 text-center flex items-center justify-center gap-2 mb-4">
        {/* Left leaf sprig */}
        <div className="text-emerald-600 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C6.5 2 2 6.5 2 12c4-1 7-4 8-8 1 4 4 7 8 8-1-5.5-5.5-10-6-10z" />
          </svg>
        </div>

        <p className="font-serif italic text-lg sm:text-2xl text-[#1e40af] dark:text-[#93c5fd] font-bold tracking-wide">
          {t('home.why_trust_quote') || 'Aapka Vishwas, Hamari Pehchan. 💙'}
        </p>

        {/* Right leaf sprig */}
        <div className="text-emerald-600 dark:text-emerald-400 rotate-180">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 2C6.5 2 2 6.5 2 12c4-1 7-4 8-8 1 4 4 7 8 8-1-5.5-5.5-10-6-10z" />
          </svg>
        </div>
      </div>

      {/* ── Indian Landmark Skyline Illustration Banner ── */}
      <div className="relative w-full max-w-5xl mx-auto -mb-1 overflow-hidden z-10 pointer-events-none">
        <img
          src="/decor/indian_landmarks_skyline.jpg"
          alt="Indian Heritage Landmarks"
          className="w-full h-auto object-contain max-h-[140px] sm:max-h-[180px] lg:max-h-[220px] mx-auto filter drop-shadow-xs dark:opacity-85 dark:brightness-95"
          loading="lazy"
        />
      </div>

      {/* ── Flowing Indian Tricolor Wave Ribbon (Saffron / White / Green) ── */}
      <div className="w-full relative h-4 sm:h-5 overflow-hidden z-20 -mx-4 sm:-mx-8 lg:-mx-12">
        <svg
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Saffron Layer */}
          <path
            d="M0,25 Q300,5 600,20 T1200,10 L1200,40 L0,40 Z"
            fill="#FF9933"
          />
          {/* White Layer */}
          <path
            d="M0,28 Q300,12 600,25 T1200,18 L1200,40 L0,40 Z"
            fill="#FFFFFF"
            className="dark:fill-slate-800"
          />
          {/* Green Layer */}
          <path
            d="M0,32 Q300,18 600,30 T1200,24 L1200,40 L0,40 Z"
            fill="#138808"
          />
        </svg>
      </div>
    </section>
  );
};

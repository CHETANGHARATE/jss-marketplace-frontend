'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BenefitCard {
  id: string;
  title: string;
  titleKey: string;
  desc: string;
  descKey: string;
  titleColor: string;
  iconBg: string;
  iconBorder: string;
  dividerColor: string;
  bottomGradient: string;
  bottomGlow: string;
  renderIcon: () => React.ReactNode;
}

const benefits: BenefitCard[] = [
  // ─── Row 1: Cards 1–4 ───
  {
    id: 'secure-payments',
    title: 'Secure Payments',
    titleKey: 'home.why_secure_payments',
    desc: 'Your payments are safely held in escrow until your order is delivered & verified.',
    descKey: 'home.why_secure_desc',
    titleColor: '#1565D8',
    iconBg: '#EFF6FF',
    iconBorder: '#BFDBFE',
    dividerColor: '#3B82F6',
    bottomGradient: 'linear-gradient(90deg, #1565D8 0%, #3B82F6 100%)',
    bottomGlow: 'rgba(21, 101, 216, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <path d="M24 4L8 10V22C8 32.5 14.8 42.2 24 44C33.2 42.2 40 32.5 40 22V10L24 4Z" fill="url(#shieldGrad)" />
        <path d="M24 16C21.8 16 20 17.8 20 20V23H19C17.9 23 17 23.9 17 25V33C17 34.1 17.9 35 19 35H29C30.1 35 31 34.1 31 33V25C31 23.9 30.1 23 29 23H28V20C28 17.8 26.2 16 24 16ZM24 18C25.1 18 26 18.9 26 20V23H22V20C22 18.9 22.9 18 24 18Z" fill="white" />
      </svg>
    ),
  },
  {
    id: 'fast-delivery',
    title: 'Fast & Reliable Delivery',
    titleKey: 'home.why_fast_delivery',
    desc: 'Real-time shipment tracking with express dispatch across 25,000+ PIN codes in India.',
    descKey: 'home.why_fast_desc',
    titleColor: '#EA580C',
    iconBg: '#FFF7ED',
    iconBorder: '#FED7AA',
    dividerColor: '#F97316',
    bottomGradient: 'linear-gradient(90deg, #EA580C 0%, #F97316 100%)',
    bottomGlow: 'rgba(234, 88, 12, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <path d="M4 18H10 M2 24H8 M4 30H10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="12" y="12" width="20" height="20" rx="2" fill="url(#truckGrad)" />
        <path d="M32 18H38.5L43 24.5V32H32V18Z" fill="url(#truckGrad)" />
        <path d="M33 20H37.5L40.5 24H33V20Z" fill="white" opacity="0.9" />
        <circle cx="19" cy="34" r="4.5" fill="#334155" />
        <circle cx="19" cy="34" r="2" fill="white" />
        <circle cx="36" cy="34" r="4.5" fill="#334155" />
        <circle cx="36" cy="34" r="2" fill="white" />
      </svg>
    ),
  },
  {
    id: 'verified-sellers',
    title: 'Verified Sellers',
    titleKey: 'home.why_verified_sellers',
    desc: 'All sellers are KYC, GST & business verified for your complete peace of mind.',
    descKey: 'home.why_verified_desc',
    titleColor: '#16A34A',
    iconBg: '#F0FDF4',
    iconBorder: '#BBF7D0',
    dividerColor: '#22C55E',
    bottomGradient: 'linear-gradient(90deg, #16A34A 0%, #22C55E 100%)',
    bottomGlow: 'rgba(22, 163, 74, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="verifiedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
        </defs>
        <path d="M24 4L27.5 8.5L33 7.5L34.5 13L40 14.5L39.5 20.5L44 24L39.5 27.5L40 33.5L34.5 35L33 40.5L27.5 39.5L24 44L20.5 39.5L15 40.5L13.5 35L8 33.5L8.5 27.5L4 24L8.5 20.5L8 14.5L13.5 13L15 7.5L20.5 8.5L24 4Z" fill="url(#verifiedGrad)" />
        <circle cx="24" cy="24" r="14" fill="white" opacity="0.25" />
        <path d="M17 24.5L22 29.5L31 19.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'quality-products',
    title: 'Quality Products',
    titleKey: 'home.why_quality_products',
    desc: 'Every item is inspected and dispatched directly from source with 100% authenticity.',
    descKey: 'home.why_quality_desc',
    titleColor: '#9333EA',
    iconBg: '#FAF5FF',
    iconBorder: '#E9D5FF',
    dividerColor: '#A855F7',
    bottomGradient: 'linear-gradient(90deg, #9333EA 0%, #A855F7 100%)',
    bottomGlow: 'rgba(147, 51, 234, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
          <linearGradient id="boxTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#9333EA" />
          </linearGradient>
        </defs>
        <path d="M24 6L38 14V30L24 38L10 30V14L24 6Z" fill="url(#boxGrad)" />
        <path d="M24 6L38 14L24 22L10 14L24 6Z" fill="url(#boxTopGrad)" />
        <path d="M24 22V38L10 30V14L24 22Z" fill="#7E22CE" opacity="0.6" />
        <circle cx="35" cy="33" r="8" fill="#1565D8" />
        <path d="M32 33L34.5 35.5L38.5 30.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },

  // ─── Row 2: Cards 5–8 ───
  {
    id: 'easy-returns',
    title: 'Easy Returns & Refunds',
    titleKey: 'home.why_easy_returns',
    desc: 'Hassle-free returns & easy refunds with a transparent policy you can trust.',
    descKey: 'home.why_easy_returns_desc',
    titleColor: '#E11D48',
    iconBg: '#FFF1F2',
    iconBorder: '#FECDD3',
    dividerColor: '#F43F5E',
    bottomGradient: 'linear-gradient(90deg, #E11D48 0%, #F43F5E 100%)',
    bottomGlow: 'rgba(225, 29, 72, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="returnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <path d="M24 8C15.2 8 8 15.2 8 24C8 32.8 15.2 40 24 40C31.5 40 37.8 34.8 39.5 27.8" stroke="url(#returnGrad)" strokeWidth="4" strokeLinecap="round" />
        <path d="M12 4L8 8.5L13.5 12" stroke="url(#returnGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="18" width="12" height="12" rx="2" fill="url(#returnGrad)" />
        <path d="M18 22H30 M24 18V30" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'direct-pricing',
    title: 'Best Value & Direct Pricing',
    titleKey: 'home.why_direct_pricing',
    desc: 'Buy directly from manufacturers, farmers & brands – no middlemen, just the best prices.',
    descKey: 'home.why_direct_pricing_desc',
    titleColor: '#D97706',
    iconBg: '#FEFCE8',
    iconBorder: '#FEF08A',
    dividerColor: '#F59E0B',
    bottomGradient: 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)',
    bottomGlow: 'rgba(217, 119, 6, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="18" fill="url(#coinGrad)" />
        <circle cx="24" cy="24" r="15" fill="none" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="24" y="32" textAnchor="middle" fontSize="23" fontWeight="900" fill="white" fontFamily="sans-serif">₹</text>
      </svg>
    ),
  },
  {
    id: 'made-in-india',
    title: 'Local & Made in India',
    titleKey: 'home.why_made_in_india',
    desc: 'Empowering local businesses, MSMEs, farmers & women entrepreneurs across India.',
    descKey: 'home.why_made_in_india_desc',
    titleColor: '#0D9488',
    iconBg: '#F0FDFA',
    iconBorder: '#99F6E4',
    dividerColor: '#14B8A6',
    bottomGradient: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)',
    bottomGlow: 'rgba(13, 148, 136, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="indiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="18" fill="#CCFBF1" />
        <path d="M24 10L27 15L31 16L30 20L33 23L31 28L27 34L24 38L21 34L17 28L15 23L18 20L17 16L21 15L24 10Z" fill="url(#indiaGrad)" />
        <circle cx="24" cy="22" r="3" fill="#F43F5E" />
      </svg>
    ),
  },
  {
    id: 'dedicated-support',
    title: 'Dedicated Support',
    titleKey: 'home.why_dedicated_support',
    desc: 'Our support team is always ready to assist you with any order or product queries.',
    descKey: 'home.why_dedicated_support_desc',
    titleColor: '#1565D8',
    iconBg: '#EFF6FF',
    iconBorder: '#BFDBFE',
    dividerColor: '#3B82F6',
    bottomGradient: 'linear-gradient(90deg, #1565D8 0%, #2563EB 100%)',
    bottomGlow: 'rgba(21, 101, 216, 0.4)',
    renderIcon: () => (
      <svg viewBox="0 0 48 48" className="w-11 h-11 drop-shadow-xs" fill="none">
        <defs>
          <linearGradient id="headsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <path d="M12 24C12 17.4 17.4 12 24 12C30.6 12 36 17.4 36 24V28C36 30.2 34.2 32 32 32H30V22H34V24C34 18.5 29.5 14 24 14C18.5 14 14 18.5 14 24V22H18V32H16C13.8 32 12 30.2 12 28V24Z" fill="url(#headsetGrad)" />
        <path d="M30 32V35C30 36.7 28.7 38 27 38H24" stroke="url(#headsetGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="38" r="2" fill="#1D4ED8" />
        <rect x="12" y="22" width="6" height="10" rx="3" fill="#1D4ED8" />
        <rect x="30" y="22" width="6" height="10" rx="3" fill="#1D4ED8" />
      </svg>
    ),
  },
];

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative rounded-3xl lg:rounded-[36px] overflow-hidden pt-12 pb-0 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-[#f8faff] via-white to-[#f0fdf4]/25 dark:from-[#0B132B] dark:via-[#0F172A] dark:to-[#0B132B] border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      
      {/* ── Background Dotted Pattern & Corner Radial Accents ── */}
      <div className="absolute top-4 left-4 w-36 h-36 opacity-30 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" fill="none">
          <pattern id="dot-pattern-left" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" className="fill-blue-500" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-left)" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 w-36 h-36 opacity-30 dark:opacity-10 pointer-events-none">
        <svg width="100%" height="100%" fill="none">
          <pattern id="dot-pattern-right" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" className="fill-blue-500" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-right)" />
        </svg>
      </div>

      {/* ── Side Decorative Leaf Branches ── */}
      <div className="absolute top-1/3 -left-4 w-20 h-40 opacity-40 dark:opacity-20 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 60 120" className="w-full h-full text-emerald-500 fill-current" opacity="0.6">
          <path d="M0,60 Q30,40 50,10 Q25,30 0,60 M0,60 Q35,65 55,45 Q25,60 0,60 M0,60 Q30,85 50,110 Q25,80 0,60" />
        </svg>
      </div>
      <div className="absolute top-1/3 -right-4 w-20 h-40 opacity-40 dark:opacity-20 pointer-events-none hidden lg:block -scale-x-100">
        <svg viewBox="0 0 60 120" className="w-full h-full text-emerald-500 fill-current" opacity="0.6">
          <path d="M0,60 Q30,40 50,10 Q25,30 0,60 M0,60 Q35,65 55,45 Q25,60 0,60 M0,60 Q30,85 50,110 Q25,80 0,60" />
        </svg>
      </div>

      {/* ── Inner Content Container (with horizontal padding) ── */}
      <div className="px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 relative z-10">
          {/* Top Gold Pill Badge (Matching Image 1) */}
          <div className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-400/70 dark:border-amber-500/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-2xs">
            <Star size={13} className="fill-amber-500 text-amber-500" />
            <span>{t('home.excellence') || 'MARKETPLACE EXCELLENCE'}</span>
          </div>

          {/* Main Heading: "Why Choose JSS Marketplace?" */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            Why Choose <span className="text-[#1565D8]">JSS</span> Marketplace?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            {t('home.why_choose_sub') ||
              "India's most trusted direct-from-source multi-vendor platform for retail & wholesale buyers."}
          </p>

          {/* Decorative Separator: Green leaf laurels + blue lines + central blue star (Matching Image 1) */}
          <div className="flex items-center justify-center gap-3 pt-1.5">
            {/* Left Laurel */}
            <svg viewBox="0 0 32 20" className="w-6 h-4 text-emerald-500 fill-current">
              <path d="M2,10 Q14,2 24,0 Q18,8 2,10 M2,10 Q16,10 26,8 Q18,14 2,10 M2,10 Q14,16 22,20 Q16,16 2,10" />
            </svg>

            {/* Left Line */}
            <span className="h-[1.5px] w-12 sm:w-16 bg-blue-300/80 dark:bg-blue-500/30 rounded-full" />
            
            {/* Central Blue Star */}
            <div className="text-[#1565D8] dark:text-blue-400">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>

            {/* Right Line */}
            <span className="h-[1.5px] w-12 sm:w-16 bg-blue-300/80 dark:bg-blue-500/30 rounded-full" />

            {/* Right Laurel (flipped) */}
            <svg viewBox="0 0 32 20" className="w-6 h-4 text-emerald-500 fill-current -scale-x-100">
              <path d="M2,10 Q14,2 24,0 Q18,8 2,10 M2,10 Q16,10 26,8 Q18,14 2,10 M2,10 Q14,16 22,20 Q16,16 2,10" />
            </svg>
          </div>
        </div>

        {/* ── 8 Feature Cards (4 in Row 1, 4 in Row 2 — Matching Image 1) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative z-10 mt-7 sm:mt-9 mb-1 sm:mb-2">
          {benefits.map((b) => {
            const title = t(b.titleKey) || b.title;
            const desc = t(b.descKey) || b.desc;

            return (
              <div
                key={b.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[28px] p-6 sm:p-7 flex flex-col items-center text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group justify-between"
              >
                {/* Top Large Circular Icon Container */}
                <div
                  className="w-20 h-20 sm:w-[84px] sm:h-[84px] rounded-full flex items-center justify-center mb-4 sm:mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs border"
                  style={{
                    background: b.iconBg,
                    borderColor: b.iconBorder,
                  }}
                >
                  {b.renderIcon()}
                </div>

                {/* Title */}
                <h3
                  className="font-black text-base sm:text-[17px] mb-1.5 tracking-tight transition-colors"
                  style={{ color: b.titleColor }}
                >
                  {title}
                </h3>

                {/* Decorative mini divider under title */}
                <div
                  className="w-7 h-0.5 rounded-full mb-3 opacity-60 transition-all duration-300 group-hover:w-10"
                  style={{ backgroundColor: b.dividerColor }}
                />

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium flex-1 pb-4">
                  {desc}
                </p>

                {/* Full-width Rounded Bottom Accent Strip (Matching Image 1) */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-3.5 sm:h-4 w-full transition-all duration-300 group-hover:h-4.5"
                  style={{
                    background: b.bottomGradient,
                    boxShadow: `0 -2px 10px ${b.bottomGlow}`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Indian Landmark Skyline Banner (Scaled & Snug at Bottom to eliminate all gaps) ── */}
      <div className="w-full relative overflow-hidden z-10 pointer-events-none mt-0 sm:mt-1 -mb-3 sm:-mb-5 lg:-mb-7 leading-none">
        <img
          src="/decor/indian_landmarks_skyline.png"
          alt="Indian Heritage Landmarks"
          className="w-[108%] sm:w-[106%] lg:w-[105%] max-w-none -ml-[4%] sm:-ml-[3%] lg:-ml-[2.5%] h-auto object-cover object-top block mx-auto filter drop-shadow-xs dark:opacity-90 dark:brightness-95"
          loading="lazy"
        />
      </div>
    </section>
  );
};

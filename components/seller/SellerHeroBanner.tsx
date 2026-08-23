'use client';

import React from 'react';
import Image from 'next/image';
import {
  FileText,
  Percent,
  Headphones,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';

interface SellerHeroBannerProps {
  onStartSellingClick?: () => void;
}

export const SellerHeroBanner: React.FC<SellerHeroBannerProps> = ({ onStartSellingClick }) => {
  const sellerCategories = [
    {
      title: 'Farmers',
      subtitle: 'Direct farm-to-table produce',
      badgeColor: 'bg-emerald-700 text-white',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/40 to-emerald-900/10',
      image: '/images/seller/farmer.jpg',
      fallbackIcon: '🌾',
    },
    {
      title: 'Manufacturers',
      subtitle: 'Bulk supply & direct sourcing',
      badgeColor: 'bg-emerald-700 text-white',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/40 to-emerald-900/10',
      image: '/images/seller/manufacturer.jpg',
      fallbackIcon: '🏭',
    },
    {
      title: 'Home Business',
      subtitle: 'Handmade faral & handicrafts',
      badgeColor: 'bg-emerald-700 text-white',
      borderColor: 'border-emerald-500/30',
      bgGlow: 'from-emerald-950/40 to-emerald-900/10',
      image: '/images/seller/home_business.jpg',
      fallbackIcon: '🏡',
    },
    {
      title: 'Women Entrepreneurs',
      subtitle: 'Empowering local women creators',
      badgeColor: 'bg-purple-900 text-white',
      borderColor: 'border-purple-500/30',
      bgGlow: 'from-purple-950/40 to-purple-900/10',
      image: '/images/seller/woman_entrepreneur.jpg',
      fallbackIcon: '👩‍💼',
    },
  ];

  const benefits = [
    {
      icon: FileText,
      title: 'Easy Registration',
      subtitle: 'Quick & simple process',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Percent,
      title: 'Low Commission',
      subtitle: 'Best in the industry',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      subtitle: '24/7 seller support',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Secure',
      subtitle: 'Trusted by thousands',
      iconBg: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <section className="space-y-4 w-full">
      {/* Top Banner Card inspired by Reference Image 1 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-background to-teal-50/40 dark:from-slate-900 dark:via-background dark:to-emerald-950/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Subheading, CTA, Stats */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} className="text-emerald-500 animate-pulse" />
                <span>India Shops Here</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-[1.15]">
                GROW YOUR BUSINESS WITH{' '}
                <span className="text-emerald-600 dark:text-emerald-400 block">JSS MARKETPLACE</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-custom font-medium leading-relaxed">
                Join thousands of sellers across Maharashtra and grow your business online with low commissions, fast settlements, and nationwide logistics.
              </p>
            </div>

            {/* Action CTA & Stats */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onStartSellingClick}
                  className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <span>Start Selling Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Statistics Row matching Reference Image 1 */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-500/20">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">
                    5,000+
                  </span>
                  <span className="text-[11px] font-bold text-muted-custom block">Active Sellers</span>
                </div>
                <div className="border-l border-emerald-500/20 pl-3">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">
                    10L+
                  </span>
                  <span className="text-[11px] font-bold text-muted-custom block">Happy Customers</span>
                </div>
                <div className="border-l border-emerald-500/20 pl-3">
                  <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block tracking-tight">
                    20,000+
                  </span>
                  <span className="text-[11px] font-bold text-muted-custom block">Products Listed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Seller Type Cards matching Reference Image 1 */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {sellerCategories.map((cat, idx) => (
              <div
                key={idx}
                className={`relative group rounded-2xl overflow-hidden border ${cat.borderColor} bg-card shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-56 sm:h-64`}
              >
                {/* Background Image / Gradient Fallback */}
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/40 z-0">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.bgGlow} via-black/40 to-transparent`} />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 p-3 flex justify-between items-start">
                  <span className="text-2xl drop-shadow-md">{cat.fallbackIcon}</span>
                </div>

                {/* Bottom Label Bar matching Reference Image 1 */}
                <div className="relative z-10 p-2.5">
                  <div
                    className={`${cat.badgeColor} py-2 px-3 rounded-xl font-black text-xs sm:text-xs text-center shadow-md tracking-tight truncate`}
                  >
                    {cat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Benefit Strip matching Reference Image 1 */}
      <div className="bg-card border border-border-custom/80 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-background-secondary/60 transition-colors">
              <div className={`w-11 h-11 rounded-2xl ${b.iconBg} flex items-center justify-center shrink-0 border border-current/10 font-bold`}>
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-foreground truncate">{b.title}</h4>
                <p className="text-[11px] font-medium text-muted-custom truncate">{b.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

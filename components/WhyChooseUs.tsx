'use client';

import React from 'react';
import { Lock, Truck, BadgeCheck, CheckCircle2, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Feature {
  number: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
  iconClass: string;    // Tailwind: bg + text, both light & dark
  accentColor: string;  // hex for the accent line (static, fine in both modes)
  decorClass: string;   // Tailwind for decorative blob in card corner
}

const features: Feature[] = [
  {
    number: '01',
    icon: Lock,
    titleKey: 'home.why_secure_payments',
    descKey: 'home.why_secure_desc',
    iconClass: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
    accentColor: '#3b82f6',
    decorClass: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-500/10 dark:to-blue-500/5',
  },
  {
    number: '02',
    icon: Truck,
    titleKey: 'home.why_fast_delivery',
    descKey: 'home.why_fast_desc',
    iconClass: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
    accentColor: '#f97316',
    decorClass: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/10 dark:to-orange-500/5',
  },
  {
    number: '03',
    icon: BadgeCheck,
    titleKey: 'home.why_trusted_sellers',
    descKey: 'home.why_trusted_desc',
    iconClass: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    accentColor: '#8b5cf6',
    decorClass: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-500/10 dark:to-purple-500/5',
  },
  {
    number: '04',
    icon: CheckCircle2,
    titleKey: 'home.why_quality_products',
    descKey: 'home.why_quality_desc',
    iconClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    accentColor: '#22c55e',
    decorClass: 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-500/10 dark:to-emerald-500/5',
  },
];

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative rounded-3xl overflow-hidden py-12 px-6 sm:px-10 bg-gradient-to-br from-blue-50 via-purple-50/60 to-orange-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-blue-100 dark:border-slate-700/60 shadow-sm">

      {/* Decorative blobs — visible in light, subtle in dark */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-40 dark:opacity-5 pointer-events-none bg-blue-200" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-30 dark:opacity-5 pointer-events-none bg-purple-200" />

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="text-center mb-10 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
          <Star size={12} fill="currentColor" />
          {t('home.excellence')}
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {t('home.why_choose_title')}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto font-medium">
          {t('home.why_choose_sub')}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="h-0.5 w-8 bg-blue-300 dark:bg-blue-500/50 rounded-full" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span className="h-0.5 w-8 bg-blue-300 dark:bg-blue-500/50 rounded-full" />
        </div>
      </div>

      {/* ── Cards Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.number}
              className="bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Top-right decorative corner blob */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-50 dark:opacity-30 pointer-events-none ${feat.decorClass}`}
              />

              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-600/50 shadow-sm ${feat.iconClass}`}
              >
                <Icon size={28} />
              </div>

              {/* Title */}
              <h3 className="font-black text-sm text-slate-800 dark:text-white mb-1">
                {t(feat.titleKey)}
              </h3>

              {/* Accent line */}
              <div className="w-8 h-0.5 rounded-full mb-3" style={{ background: feat.accentColor }} />

              {/* Description */}
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {t(feat.descKey)}
              </p>

              {/* Large muted number watermark */}
              <span
                className="absolute bottom-3 left-4 text-4xl font-black opacity-[0.07] dark:opacity-[0.12] leading-none select-none"
                style={{ color: feat.accentColor }}
              >
                {feat.number}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

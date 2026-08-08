'use client';

import React from 'react';
import { Lock, Truck, BadgeCheck, CheckCircle2, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const features = [
  {
    number: '01',
    icon: Lock,
    titleKey: 'footer.shipping_title',
    title: 'Secure Payments',
    description: 'Your payments are safely held in escrow until your order is delivered & verified.',
    iconColor: '#3b82f6',
    iconBgLight: '#eff6ff',
    iconBgDark: 'rgba(59, 130, 246, 0.2)',
    numberColor: '#3b82f6',
    accentColor: '#3b82f6',
    decorBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
  },
  {
    number: '02',
    icon: Truck,
    titleKey: 'footer.returns_title',
    title: 'Fast Delivery',
    description: 'Real-time shipment tracking with express dispatch across 25,000+ PIN codes in India.',
    iconColor: '#f97316',
    iconBgLight: '#fff7ed',
    iconBgDark: 'rgba(249, 115, 22, 0.2)',
    numberColor: '#f97316',
    accentColor: '#f97316',
    decorBg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
  },
  {
    number: '03',
    icon: BadgeCheck,
    titleKey: 'footer.guarantee_title',
    title: 'Trusted Sellers',
    description: 'Buy directly from GSTIN & compliance-verified manufacturers, farmers, and distributors.',
    iconColor: '#8b5cf6',
    iconBgLight: '#f5f3ff',
    iconBgDark: 'rgba(139, 92, 246, 0.2)',
    numberColor: '#8b5cf6',
    accentColor: '#8b5cf6',
    decorBg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
  },
  {
    number: '04',
    icon: CheckCircle2,
    titleKey: 'footer.support_title',
    title: 'Quality Products',
    description: 'Every item is inspected and dispatched directly from source with 100% authenticity.',
    iconColor: '#22c55e',
    iconBgLight: '#f0fdf4',
    iconBgDark: 'rgba(34, 197, 94, 0.2)',
    numberColor: '#22c55e',
    accentColor: '#22c55e',
    decorBg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
  },
];

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative rounded-3xl overflow-hidden py-12 px-6 sm:px-10 bg-gradient-to-br from-blue-50/70 via-purple-50/50 to-orange-50/50 dark:from-[#0b1329] dark:via-[#131f37] dark:to-[#0b1329] border border-border-custom/40 dark:border-border-custom/80 shadow-xs">
      {/* Floating decorative blobs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-30 dark:opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #bfdbfe, transparent)' }} />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-30 dark:opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #ddd6fe, transparent)' }} />

      {/* Header */}
      <div className="text-center mb-10 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest">
          <Star size={12} fill="currentColor" />
          {t('home.excellence')}
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
          {t('home.why_choose_title')}
        </h2>
        <p className="text-sm text-muted-custom max-w-lg mx-auto font-medium">
          {t('home.why_choose_sub')}
        </p>
        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="h-0.5 w-8 bg-blue-300 dark:bg-blue-500/40 rounded-full" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-400" />
          <span className="h-0.5 w-8 bg-blue-300 dark:bg-blue-500/40 rounded-full" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.number}
              className="bg-white dark:bg-card border border-border-custom/60 dark:border-border-custom/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Top blob decoration */}
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-40 dark:opacity-20 pointer-events-none"
                style={{ background: feat.decorBg }}
              />

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xs border border-border-custom/30 dark:border-border-custom/60"
                style={{
                  color: feat.iconColor,
                  backgroundColor: 'var(--icon-bg)',
                }}
                ref={(el) => {
                  if (el) {
                    const isDark = document.documentElement.classList.contains('dark');
                    el.style.backgroundColor = isDark ? feat.iconBgDark : feat.iconBgLight;
                  }
                }}
              >
                <Icon size={28} />
              </div>

              {/* Title */}
              <h3 className="font-black text-sm text-foreground mb-1">{t(feat.titleKey) || feat.title}</h3>

              {/* Accent line */}
              <div className="w-8 h-0.5 rounded-full mb-3" style={{ background: feat.accentColor }} />

              {/* Description */}
              <p className="text-xs text-muted-custom leading-relaxed font-normal">
                {feat.description}
              </p>

              {/* Large muted number at bottom */}
              <span
                className="absolute bottom-3 left-4 text-4xl font-black opacity-10 dark:opacity-20 leading-none select-none"
                style={{ color: feat.numberColor }}
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

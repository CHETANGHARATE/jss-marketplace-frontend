'use client';

import React from 'react';
import { ShieldCheck, Tag, RefreshCw, Headphones } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HomeServiceStrip: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: ShieldCheck,
      titleKey: 'home.trust_authentic',
      defaultTitle: '100% AUTHENTIC',
      descKey: 'home.trust_authentic_sub',
      defaultDesc: 'Verified products from trusted sellers',
      iconClass: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
    },
    {
      icon: Tag,
      titleKey: 'home.trust_best_prices',
      defaultTitle: 'BEST PRICES',
      descKey: 'home.trust_best_prices_sub',
      defaultDesc: 'Competitive marketplace pricing',
      iconClass: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
    },
    {
      icon: RefreshCw,
      titleKey: 'home.trust_easy_returns',
      defaultTitle: 'EASY RETURNS',
      descKey: 'home.trust_easy_returns_sub',
      defaultDesc: 'Simple return & replacement process',
      iconClass: 'bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200/80 dark:border-orange-500/30',
    },
    {
      icon: Headphones,
      titleKey: 'home.trust_support',
      defaultTitle: '24X7 SUPPORT',
      descKey: 'home.trust_support_sub',
      defaultDesc: 'Dedicated customer assistance',
      iconClass: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
    },
  ];

  return (
    <section className="bg-white dark:bg-[#0B132B] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs transition-colors">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          const title = t(svc.titleKey) !== svc.titleKey ? t(svc.titleKey) : svc.defaultTitle;
          const desc = t(svc.descKey) !== svc.descKey ? t(svc.descKey) : svc.defaultDesc;

          return (
            <div
              key={i}
              className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {/* Desktop Icon Container (48–56px x 48–56px) & Icon (24–30px) */}
              <div
                className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center mb-4 border shadow-2xs ${svc.iconClass}`}
              >
                <Icon size={26} />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
                {title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-[220px]">
                {desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

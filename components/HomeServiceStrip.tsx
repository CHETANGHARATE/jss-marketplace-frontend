'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const HomeServiceStrip: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: ShieldCheck,
      label: t('home.service_secure_payment'),
      sub: t('home.service_secure_payment_sub'),
      colorClass: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-500/30',
    },
    {
      icon: RefreshCw,
      label: t('home.service_easy_returns'),
      sub: t('home.service_easy_returns_sub'),
      colorClass: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/30',
    },
    {
      icon: Truck,
      label: t('home.service_free_shipping'),
      sub: t('home.service_free_shipping_sub'),
      colorClass: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/30',
    },
    {
      icon: Headphones,
      label: t('home.service_support'),
      sub: t('home.service_support_sub'),
      colorClass: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-500/30',
    },
    {
      icon: Award,
      label: t('home.service_trusted_vendors'),
      sub: t('home.service_trusted_vendors_sub'),
      colorClass: 'bg-pink-50 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-200/80 dark:border-pink-500/30',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs transition-colors">
      <div className="flex flex-wrap items-center justify-around gap-4 py-5 px-4">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div key={i} className="flex items-center gap-3.5 min-w-[140px] flex-1 justify-center">
              <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs ${svc.colorClass}`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">{svc.label}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">{svc.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

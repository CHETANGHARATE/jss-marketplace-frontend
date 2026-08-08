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
      colorClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: RefreshCw,
      label: t('home.service_easy_returns'),
      sub: t('home.service_easy_returns_sub'),
      colorClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: Truck,
      label: t('home.service_free_shipping'),
      sub: t('home.service_free_shipping_sub'),
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Headphones,
      label: t('home.service_support'),
      sub: t('home.service_support_sub'),
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      bgClass: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      icon: Award,
      label: t('home.service_trusted_vendors'),
      sub: t('home.service_trusted_vendors_sub'),
      colorClass: 'text-pink-600 dark:text-pink-400',
      bgClass: 'bg-pink-50 dark:bg-pink-900/20',
    },
  ];

  return (
    <section className="bg-card dark:bg-card border border-border-custom/60 rounded-2xl shadow-sm">
      <div className="flex flex-wrap items-center justify-around gap-4 py-5 px-4">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div key={i} className="flex items-center gap-3 min-w-[140px] flex-1 justify-center">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${svc.bgClass} ${svc.colorClass}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground leading-tight">{svc.label}</div>
                <div className="text-[11px] text-muted-custom font-medium leading-tight mt-0.5">{svc.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

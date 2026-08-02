'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones, Award } from 'lucide-react';

const services = [
  {
    icon: ShieldCheck,
    label: '100% Secure Payment',
    sub: 'Safe & Trusted Transactions',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    icon: RefreshCw,
    label: 'Easy Returns',
    sub: '7 Days Return Policy',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    icon: Truck,
    label: 'Free Shipping',
    sub: 'On Orders Above ₹499',
    color: '#22c55e',
    bg: '#f0fdf4',
  },
  {
    icon: Headphones,
    label: '24/7 Support',
    sub: 'Dedicated Support',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    icon: Award,
    label: 'Trusted Vendors',
    sub: 'Quality Assured',
    color: '#ec4899',
    bg: '#fdf2f8',
  },
];

export const HomeServiceStrip: React.FC = () => {
  return (
    <section className="w-full bg-white dark:bg-card border-y border-border-custom/60 py-6 px-4 sm:px-8 lg:px-12 shadow-xs">
      <div className="flex flex-wrap items-center justify-around gap-6">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div key={i} className="flex items-center gap-3 min-w-[140px] flex-1 justify-center">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: svc.bg, color: svc.color }}
              >
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

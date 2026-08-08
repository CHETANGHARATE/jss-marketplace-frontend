'use client';

import React from 'react';
import { ApiCategory } from '../types/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { Layers, ShieldCheck, Sparkles } from 'lucide-react';

interface CategoryHeaderProps {
  category: ApiCategory;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const { language, t } = useLanguage();
  const categoryName = getLocalizedText(category.name, language);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-8 sm:p-12 mb-8 shadow-md">
      {/* Background Gradient Blends */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 border border-primary/30 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider">
            <Layers size={13} className="text-primary" />
            <span>{t('home.official_catalog')}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-extrabold rounded-full">
            <ShieldCheck size={13} />
            <span>{t('home.verified_source')}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
          {categoryName}
        </h1>

        {category.description && (
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
            {getLocalizedText(category.description, language)}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1 text-accent">
              <Sparkles size={14} />
              {t('home.direct_manufacturer_pricing')}
            </span>
            <span>•</span>
            <span>{t('home.genuine_escrow')}</span>
        </div>
      </div>
    </div>
  );
}

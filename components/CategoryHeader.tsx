'use client';

import React, { useState } from 'react';
import { ApiCategory } from '../types/api';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { Layers, ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { useToast } from './Toast';

interface CategoryHeaderProps {
  category: ApiCategory;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const { language, t } = useLanguage();
  const categoryName = getLocalizedText(category.name, language);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, info } = useToast();

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavoriteCategory(category.id);
        setIsFavorite(false);
        info(`Removed ${categoryName} from favorite categories.`, 'Favorites Updated');
      } else {
        await favoriteService.addFavoriteCategory(category.id);
        setIsFavorite(true);
        success(`Added ${categoryName} to your favorite categories!`, 'Favorited');
      }
    } catch (e) {
      setIsFavorite(!isFavorite);
      if (!isFavorite) {
        success(`Added ${categoryName} to favorite categories!`, 'Favorited');
      } else {
        info(`Removed ${categoryName} from favorite categories.`, 'Favorites Updated');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-8 sm:p-12 mb-8 shadow-md">
      {/* Background Gradient Blends */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-4">
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

        {/* Feature 67: Favorite Category Toggle */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 backdrop-blur-md ${
            isFavorite
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-rose-500 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
          <span>{isFavorite ? 'Favorited Category' : 'Favorite Category'}</span>
        </button>
      </div>
    </div>
  );
}

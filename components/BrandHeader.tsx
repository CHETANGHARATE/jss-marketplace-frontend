'use client';

import React, { useState } from 'react';
import { ApiBrand } from '../types/api';
import { ShieldCheck, Heart } from 'lucide-react';
import { favoriteService } from '../services/favoriteService';
import { useToast } from './Toast';

interface BrandHeaderProps {
  brand: ApiBrand;
}

export function BrandHeader({ brand }: BrandHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, info } = useToast();

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavoriteBrand(brand.id);
        setIsFavorite(false);
        info(`Removed ${brand.name} from favorite brands.`, 'Favorites Updated');
      } else {
        await favoriteService.addFavoriteBrand(brand.id);
        setIsFavorite(true);
        success(`Added ${brand.name} to your favorite brands!`, 'Favorited');
      }
    } catch (e) {
      // Toggle local fallback
      setIsFavorite(!isFavorite);
      if (!isFavorite) {
        success(`Added ${brand.name} to favorite brands!`, 'Favorited');
      } else {
        info(`Removed ${brand.name} from favorite brands.`, 'Favorites Updated');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-muted/40 border border-border/40 p-8 sm:p-10 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        {brand.logo && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-card rounded-2xl p-3 shadow-md border border-border/50 flex items-center justify-center shrink-0">
            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
          </div>
        )}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Brand Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="text-sm text-foreground/70 max-w-xl line-clamp-2">
              {brand.description}
            </p>
          )}
        </div>
      </div>

      {/* Feature 66: Favorite Brand Toggle */}
      <button
        type="button"
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0 ${
          isFavorite
            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
            : 'bg-card text-foreground/80 border border-border hover:border-rose-500 hover:text-rose-500'
        }`}
      >
        <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        <span>{isFavorite ? 'Favorited Brand' : 'Favorite Brand'}</span>
      </button>
    </div>
  );
}

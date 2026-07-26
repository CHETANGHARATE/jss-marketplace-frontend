'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GlassWater,
  Flower2,
  Paintbrush,
  Sparkles,
  Footprints,
  Utensils,
  Flame,
  Shirt,
  Gem,
  Sprout,
  Car,
  Home,
  Landmark,
  Gift,
  Baby,
  Droplet,
  Cookie,
  Moon,
  PartyPopper,
  Laptop,
  ChevronRight,
  Grid,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

// Map icon strings to components — one entry per official category
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GlassWater,
  Flower2,
  Paintbrush,
  Sparkles,
  Footprints,
  Utensils,
  Flame,
  Shirt,
  Gem,
  Sprout,
  Car,
  Home,
  Landmark,
  Gift,
  Baby,
  Droplet,
  Cookie,
  Moon,
  PartyPopper,
  Laptop
};

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const { t } = useLanguage();
  const [showAllModal, setShowAllModal] = useState(false);

  // Show top 10 popular categories on the homepage grid
  const popularCategories = categories.slice(0, 10);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Grid size={14} />
            <span>Marketplace Directory</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
            {t('home.popular_categories')}
          </h2>
          <p className="text-xs text-muted-custom mt-1 font-medium">
            Explore top handpicked categories from verified manufacturers and artisans.
          </p>
        </div>

        <button
          onClick={() => setShowAllModal(true)}
          className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 px-4 py-2.5 rounded-xl transition-all w-max"
        >
          <span>Explore All 20 Categories</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Popular Categories Grid (Clean Minimal Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
        {popularCategories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sprout;

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col items-center text-center p-5 bg-card border border-border-custom hover:border-primary rounded-2xl shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-foreground group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                <IconComponent size={24} />
              </div>

              <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {t(cat.name)}
              </h3>

              <span className="text-[10px] text-muted-custom mt-1 font-semibold">
                Explore Items →
              </span>
            </Link>
          );
        })}
      </div>

      {/* Explore All 20 Categories Full Modal / Drawer */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-zoom-in">
          <div className="bg-card text-card-foreground border border-border-custom rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-border-custom pb-4">
              <div>
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <Grid className="text-primary" size={20} />
                  <span>All 20 Product Categories</span>
                </h3>
                <p className="text-xs text-muted-custom mt-0.5">
                  Complete official category catalog of JSS Marketplace
                </p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-2 rounded-xl text-muted-custom hover:text-foreground hover:bg-background-secondary border border-border-custom transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => {
                const IconComponent = iconMap[cat.icon] || Sprout;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setShowAllModal(false)}
                    className="flex items-center gap-3 p-3.5 bg-background-secondary border border-border-custom hover:border-primary rounded-2xl transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-card border border-border-custom text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <IconComponent size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-muted-custom block">
                        #{idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                        {t(cat.name)}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border-custom text-center">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-6 py-2.5 bg-background-secondary hover:bg-card border border-border-custom rounded-xl text-xs font-bold text-foreground transition-all"
              >
                Close Catalog Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

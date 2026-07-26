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
  ArrowRight,
  Grid,
  ChevronDown,
  ChevronUp
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
  const [isExpanded, setIsExpanded] = useState(false);

  // Top 10 by default; expand to all 20 when toggled
  const displayedCategories = isExpanded ? categories.slice(0, 20) : categories.slice(0, 10);

  return (
    <section id="categories" className="space-y-8 scroll-mt-24">
      {/* Category Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-custom pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Grid size={14} />
            <span>Marketplace Catalog</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
            Explore Marketplace Categories
          </h2>
          <p className="text-xs text-muted-custom mt-1 font-medium max-w-xl">
            Browse verified multi-vendor products across all 20 official marketplace categories.
          </p>
        </div>

        <div className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3.5 py-1.5 rounded-xl w-max">
          {categories.length} Categories Available
        </div>
      </div>

      {/* Grid Displaying Top 10 (or expanded 20) Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {displayedCategories.map((cat, idx) => {
          const IconComponent = iconMap[cat.icon] || Sprout;

          return (
            <Link
              key={cat.id || idx}
              href={`/category/${cat.id}`}
              className="group bg-card text-card-foreground border border-border-custom hover:border-primary rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Row: Icon & Category Index Tag */}
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <IconComponent size={22} />
                  </div>
                  <span className="text-[10px] font-black text-muted-custom bg-background-secondary border border-border-custom px-2 py-0.5 rounded-md">
                    #{idx + 1}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                    {t(cat.name)}
                  </h3>
                  <p className="text-[11px] text-muted-custom line-clamp-2 mt-1 leading-relaxed font-normal">
                    {t(cat.description)}
                  </p>
                </div>
              </div>

              {/* Card Footer: Subcategories / Product Count & Explore CTA */}
              <div className="pt-4 mt-4 border-t border-border-custom/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-custom">
                  {cat.subcategories && cat.subcategories.length > 0
                    ? `${cat.subcategories.length} Subcategories`
                    : '100+ Products'}
                </span>
                
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* In-Homepage Expand Toggle: View All 20 Categories / Show Fewer */}
      {categories.length > 10 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 px-6 py-3 rounded-2xl transition-all shadow-xs"
          >
            <span>{isExpanded ? 'Show Fewer Categories' : 'View All Categories'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  );
};

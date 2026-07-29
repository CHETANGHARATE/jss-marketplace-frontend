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
  ChevronUp,
  Layers
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
    <section id="categories" className="space-y-8 sm:space-y-10 scroll-mt-24">
      {/* Category Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-custom/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
            <Grid size={12} />
            <span>Marketplace Catalog</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight mt-1">
            Explore Popular Categories
          </h2>
          <p className="text-xs sm:text-sm text-muted-custom mt-1 font-medium max-w-xl">
            Browse verified multi-vendor products across all official marketplace categories direct from source.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 text-xs font-black px-4 py-2 rounded-2xl w-max shadow-2xs">
          <Layers size={14} />
          <span>{categories.length} Categories Available</span>
        </div>
      </div>

      {/* Grid Displaying Top 10 (or expanded 20) Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
        {displayedCategories.map((cat, idx) => {
          const IconComponent = iconMap[cat.icon] || Sprout;
          const subcats = cat.subcategories || (cat as any).children || [];

          const getSubName = (sub: any): string => {
            if (!sub) return '';
            if (typeof sub === 'string') return sub;
            if (typeof sub.name === 'string') return sub.name;
            if (typeof sub.name === 'object' && sub.name !== null) {
              return sub.name.en || sub.name.hi || sub.name.mr || Object.values(sub.name)[0] || '';
            }
            return '';
          };

          return (
            <Link
              key={cat.id || idx}
              href={`/category/${cat.id}`}
              className="group bg-card text-card-foreground border border-border-custom/80 hover:border-primary/60 rounded-3xl p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Row: Icon & Category Index Tag */}
                <div className="flex items-center justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-2xs">
                    <IconComponent size={24} />
                  </div>
                  <span className="text-[10px] font-black text-muted-custom bg-background-secondary border border-border-custom/80 px-2.5 py-1 rounded-xl">
                    #{idx + 1}
                  </span>
                </div>

                {/* Title & Subcategories List */}
                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    {t(cat.name)}
                  </h3>

                  {subcats.length > 0 ? (
                    <div className="mt-2.5 space-y-1">
                      <ul className="space-y-1 text-xs font-medium text-muted-custom">
                        {subcats.slice(0, 4).map((sub: any, subIdx: number) => (
                          <li key={sub.id || sub.slug || subIdx} className="flex items-center gap-1.5 truncate">
                            <span className="text-primary font-black text-xs leading-none">•</span>
                            <span className="truncate group-hover:text-foreground transition-colors">
                              {getSubName(sub)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {subcats.length > 4 && (
                        <span className="inline-block text-[11px] font-bold text-primary mt-1 hover:underline">
                          + {subcats.length - 4} More
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-custom line-clamp-2 mt-1.5 leading-relaxed font-normal">
                      {t(cat.description)}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer: Subcategories / Product Count & Explore CTA */}
              <div className="pt-4 mt-4 border-t border-border-custom/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted-custom">
                  {subcats.length > 0
                    ? `${subcats.length} Subcategories`
                    : '100+ Products'}
                </span>
                
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-primary group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* In-Homepage Expand Toggle: View All 20 Categories / Show Fewer */}
      {categories.length > 10 && (
        <div className="flex justify-center pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2.5 text-xs font-black text-primary bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 px-7 py-3.5 rounded-2xl transition-all shadow-xs active:scale-95"
          >
            <span>{isExpanded ? 'Show Fewer Categories' : 'View All 20 Categories'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </section>
  );
};

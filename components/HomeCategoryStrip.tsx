'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Category } from '../types';

// Category icon map using emoji images for visual matching
const categoryConfig: Record<string, { emoji: string; color: string; bg: string }> = {
  juices_syrups:          { emoji: '🍹', color: '#f97316', bg: '#fff7ed' },
  religious_pooja_items:  { emoji: '🪔', color: '#a855f7', bg: '#faf5ff' },
  cosmetics:              { emoji: '💄', color: '#ec4899', bg: '#fdf2f8' },
  beauty_personal_care:   { emoji: '🧴', color: '#f43f5e', bg: '#fff1f2' },
  footwear:               { emoji: '👟', color: '#3b82f6', bg: '#eff6ff' },
  pickles:                { emoji: '🫙', color: '#84cc16', bg: '#f7fee7' },
  masale_spices:          { emoji: '🌶️', color: '#ef4444', bg: '#fef2f2' },
  fashion:                { emoji: '👗', color: '#ec4899', bg: '#fdf2f8' },
  jewellery:              { emoji: '💍', color: '#f59e0b', bg: '#fffbeb' },
  agriculture:            { emoji: '🚜', color: '#22c55e', bg: '#f0fdf4' },
  auto_accessories:       { emoji: '🚗', color: '#6366f1', bg: '#eef2ff' },
  local_homemade:         { emoji: '🏡', color: '#f97316', bg: '#fff7ed' },
  pooja_spiritual:        { emoji: '🙏', color: '#a855f7', bg: '#faf5ff' },
  gifts_handicrafts:      { emoji: '🎁', color: '#f43f5e', bg: '#fff1f2' },
  baby_kids:              { emoji: '🧸', color: '#f59e0b', bg: '#fffbeb' },
  oil:                    { emoji: '🫒', color: '#84cc16', bg: '#f7fee7' },
  papad_kurdai:           { emoji: '🍘', color: '#f97316', bg: '#fff7ed' },
  astro_stone:            { emoji: '💎', color: '#6366f1', bg: '#eef2ff' },
  diwali_faral:           { emoji: '🪔', color: '#ef4444', bg: '#fef2f2' },
  electronics:            { emoji: '💻', color: '#3b82f6', bg: '#eff6ff' },
};

const defaultConfig = { emoji: '🛍️', color: '#6366f1', bg: '#eef2ff' };

interface Props {
  categories: Category[];
}

const getName = (name: any): string => {
  if (!name) return '';
  if (typeof name === 'string') {
    // Strip 'cat.' prefix for display
    return name.replace(/^cat\./, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  if (typeof name === 'object') {
    return name.en || name.hi || name.mr || Object.values(name)[0] || '';
  }
  return '';
};

export const HomeCategoryStrip: React.FC<Props> = ({ categories }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const displayCats = categories.slice(0, 20);

  return (
    <section className="bg-white dark:bg-card border border-border-custom/60 rounded-2xl shadow-sm overflow-hidden">
      <div className="relative flex items-center">
        {/* Scroll Left */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 z-10 w-10 h-full flex items-center justify-center bg-gradient-to-r from-white dark:from-card to-transparent shrink-0 text-muted-custom hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-12"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayCats.map((cat) => {
            const id = (cat as any).slug || cat.id;
            const cfg = categoryConfig[cat.id] || defaultConfig;
            const label = getName(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/category/${id}`}
                className="flex flex-col items-center gap-2 px-3 py-1 hover:opacity-90 transition-all group shrink-0"
                style={{ scrollSnapAlign: 'start', minWidth: '72px' }}
              >
                {/* Circular Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-transparent group-hover:border-current transition-all"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.emoji}
                </div>
                {/* Label */}
                <span className="text-[11px] font-semibold text-center text-foreground leading-tight max-w-[72px]">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* View All */}
          <Link
            href="/search"
            className="flex flex-col items-center gap-2 px-3 py-1 hover:opacity-90 transition-all shrink-0"
            style={{ minWidth: '72px' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm bg-gray-100 dark:bg-background-secondary text-blue-600 dark:text-primary">
              <Grid3X3 size={24} />
            </div>
            <span className="text-[11px] font-semibold text-center text-blue-600 dark:text-primary leading-tight max-w-[72px]">
              View All
            </span>
          </Link>
        </div>

        {/* Scroll Right */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 z-10 w-10 h-full flex items-center justify-center bg-gradient-to-l from-white dark:from-card to-transparent shrink-0 text-muted-custom hover:text-foreground transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

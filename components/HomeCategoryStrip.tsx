'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Category } from '../types';

// Premium high-res category product image mapping
const categoryImageMap: Record<string, string> = {
  juices_syrups:          'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
  religious_pooja_items:  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=500&q=80',
  cosmetics:              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  beauty_personal_care:   'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80',
  footwear:               'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
  pickles:                'https://images.unsplash.com/photo-1589135233689-d58b30f89839?auto=format&fit=crop&w=500&q=80',
  masale_spices:          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
  fashion:                'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80',
  jewellery:              'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80',
  agriculture:            'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=500&q=80',
  auto_accessories:       'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80',
  local_homemade:         'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
  pooja_spiritual:        'https://images.unsplash.com/photo-1604537529478-05d04588c227?auto=format&fit=crop&w=500&q=80',
  gifts_handicrafts:      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80',
  baby_kids:              'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80',
  oil:                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
  papad_kurdai:           'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
  astro_stone:            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80',
  diwali_faral:           'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=500&q=80',
  electronics:            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
};

const defaultImage = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=500&q=80';

interface Props {
  categories: Category[];
}

const getName = (name: any): string => {
  if (!name) return '';
  if (typeof name === 'string') {
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
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  const displayCats = categories.slice(0, 20);

  return (
    <section className="w-full bg-white dark:bg-card border-y border-border-custom/60 py-6 overflow-hidden">
      <div className="relative flex items-center">
        {/* Scroll Left */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white/90 dark:bg-card/90 border border-border-custom shadow-lg text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2 px-12 sm:px-16"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayCats.map((cat) => {
            const id = (cat as any).slug || cat.id;
            const imgUrl = (cat as any).image || categoryImageMap[cat.id] || categoryImageMap[id] || defaultImage;
            const label = getName(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/category/${id}`}
                className="flex flex-col items-center group shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Large Circular Category Image Card */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-gray-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-md group-hover:shadow-2xl group-hover:shadow-primary/25 group-hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-primary relative flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={label}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Category Name */}
                <span className="text-xs sm:text-sm font-extrabold text-center text-foreground group-hover:text-primary transition-colors max-w-[110px] sm:max-w-[130px] mt-3 line-clamp-2 leading-snug">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* View All */}
          <Link
            href="/search"
            className="flex flex-col items-center group shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:shadow-2xl group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-white">
              <Grid3X3 size={32} />
              <span className="text-xs font-black uppercase tracking-wider mt-1.5">View All</span>
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-center text-primary mt-3 leading-snug">
              All Categories
            </span>
          </Link>
        </div>

        {/* Scroll Right */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white/90 dark:bg-card/90 border border-border-custom shadow-lg text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};

'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

// Unique high-res category product image map (No duplicate images)
const categoryImageMap: Record<string, string> = {
  juices_syrups:          'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
  religious_pooja_items:  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=500&q=80',
  cosmetics:              'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  beauty_personal_care:   '/cat-beauty.jpg',
  footwear:               '/cat-footwear.jpg',
  pickles:                'https://images.unsplash.com/photo-1589135233689-d58b30f89839?auto=format&fit=crop&w=500&q=80',
  masale_spices:          '/cat-spices.jpg',
  fashion:                '/cat-fashion.jpg',
  jewellery:              '/cat-jewellery.jpg',
  agriculture:            '/cat-agriculture.jpg',
  auto_accessories:       'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80',
  local_homemade:         'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
  pooja_spiritual:        'https://images.unsplash.com/photo-1604537529478-05d04588c227?auto=format&fit=crop&w=500&q=80',
  gifts_handicrafts:      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80',
  baby_kids:              'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=80',
  oil:                    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
  papad_kurdai:           'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
  astro_stone:            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80',
  diwali_faral:           'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=500&q=80',
  electronics:            '/cat-electronics.jpg',
  home_kitchen:           '/cat-kitchen.jpg',
  books:                  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
  sports:                 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80',
  furniture:              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
  groceries:              'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80',
  pet_supplies:           'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
  health:                 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80',
};

const defaultCategoryImages = [
  'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1589135233689-d58b30f89839?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80',
];

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
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  // Show all categories directly without trimming
  const displayCats = categories;

  return (
    <section className="bg-card border border-border-custom/80 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
      <div className="relative flex items-center">
        {/* Scroll Left */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-1 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-card/90 border border-border-custom shadow-md text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Categories */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-10 sm:px-12"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayCats.map((cat, idx) => {
            const id = (cat as any).slug || cat.id;
            const imgUrl = (cat as any).image
              || categoryImageMap[cat.id]
              || categoryImageMap[id]
              || defaultCategoryImages[idx % defaultCategoryImages.length];
            const label = getName(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/category/${id}`}
                className="flex flex-col items-center group shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Circular Category Image Card */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-gray-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-primary relative flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={label}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Category Name */}
                <span className="text-xs font-bold text-center text-foreground group-hover:text-primary transition-colors max-w-[96px] sm:max-w-[112px] mt-2.5 line-clamp-2 leading-tight">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Scroll Right */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-1 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-card/90 border border-border-custom shadow-md text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

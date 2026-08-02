'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Category } from '../types';

// Pastel background tint per category matching reference e-commerce UI
const categoryBgMap: Record<string, string> = {
  juices_syrups:          '#fff7ed', // Soft Amber
  'juices-syrups':        '#fff7ed',
  religious_pooja_items:  '#fffbeb', // Soft Yellow/Gold
  'religious-pooja-items': '#fffbeb',
  cosmetics:              '#fdf2f8', // Soft Pink
  beauty_personal_care:   '#fff1f2', // Soft Rose
  'beauty-personal-care': '#fff1f2',
  footwear:               '#eff6ff', // Soft Blue
  pickles:                '#fef2f2', // Soft Red
  masale_spices:          '#fff7ed', // Soft Orange
  'masale-spices':        '#fff7ed',
  fashion:                '#fdf2f8', // Soft Pink
  jewellery:              '#fffbeb', // Soft Gold
  agriculture:            '#f0fdf4', // Soft Mint
  auto_accessories:       '#eef2ff', // Soft Indigo
  'auto-accessories':     '#eef2ff',
  local_homemade:         '#fff7ed', // Soft Amber
  'local-homemade':       '#fff7ed',
  pooja_spiritual:        '#faf5ff', // Soft Purple
  'pooja-spiritual':      '#faf5ff',
  gifts_handicrafts:      '#fdf2f8', // Soft Pink
  'gifts-handicrafts':    '#fdf2f8',
  baby_kids:              '#fefce8', // Soft Yellow
  'baby-kids':            '#fefce8',
  oil:                    '#f7fee7', // Soft Lime
  papad_kurdai:           '#fff7ed', // Soft Amber
  'papad-kurdai':         '#fff7ed',
  astro_stone:            '#f5f3ff', // Soft Violet
  'astro-stone':          '#f5f3ff',
  diwali_faral:           '#fffbeb', // Soft Gold
  'diwali-faral':         '#fffbeb',
  electronics:            '#f0f9ff', // Soft Sky Blue
  home_kitchen:           '#f8fafc', // Soft Slate
  'home-kitchen':         '#f8fafc',
  furniture:              '#fff7ed', // Soft Amber
  books:                  '#eff6ff', // Soft Blue
  sports:                 '#f0fdf4', // Soft Green
  groceries:              '#f0fdf4', // Soft Green
  pet_supplies:           '#f0fdf4', // Soft Green
  'pet-supplies':         '#f0fdf4',
  health:                 '#ecfeff', // Soft Cyan
};

// Transparent PNG cutout photo map matching reference UI (all local PNG assets)
const categoryImageMap: Record<string, string> = {
  'juices-syrups':          '/categories/juices.png',
  'juices_syrups':          '/categories/juices.png',
  'religious-pooja-items':  '/categories/pooja.png',
  'religious_pooja_items':  '/categories/pooja.png',
  'cosmetics':              '/categories/cosmetics.png',
  'beauty-personal-care':   '/categories/beauty.png',
  'beauty_personal_care':   '/categories/beauty.png',
  'footwear':               '/categories/footwear.png',
  'pickles':                '/categories/pickles.png',
  'masale-spices':          '/categories/spices.png',
  'masale_spices':          '/categories/spices.png',
  'fashion':                '/categories/fashion.png',
  'jewellery':              '/categories/jewellery.png',
  'agriculture':            '/categories/agriculture.png',
  'auto-accessories':       '/categories/auto.webp',
  'auto_accessories':       '/categories/auto.webp',
  'local-homemade':         '/categories/homemade.webp',
  'local_homemade':         '/categories/homemade.webp',
  'pooja-spiritual':        '/categories/pooja.png',
  'pooja_spiritual':        '/categories/pooja.png',
  'gifts-handicrafts':      '/categories/gifts.webp',
  'gifts_handicrafts':      '/categories/gifts.webp',
  'baby-kids':              '/categories/baby.webp',
  'baby_kids':              '/categories/baby.webp',
  'oil':                    '/categories/oil.webp',
  'papad-kurdai':           '/categories/papad.webp',
  'papad_kurdai':           '/categories/papad.webp',
  'astro-stone':            '/categories/astro.webp',
  'astro_stone':            '/categories/astro.webp',
  'diwali-faral':           '/categories/diwali.webp',
  'diwali_faral':           '/categories/diwali.webp',
  'electronics':            '/categories/electronics.webp',
  'home-kitchen':           '/categories/kitchen.webp',
  'home_kitchen':           '/categories/kitchen.webp',
  'furniture':              '/categories/furniture.webp',
  'books':                  '/categories/books.webp',
  'sports':                 '/categories/sports.webp',
  'groceries':              '/categories/groceries.webp',
  'pet-supplies':           '/categories/pet.webp',
  'pet_supplies':           '/categories/pet.webp',
  'health':                 '/categories/health.webp',

  // Numeric IDs (1 to 20 from DB)
  '1':                      '/categories/juices.png',
  '2':                      '/categories/pooja.png',
  '3':                      '/categories/cosmetics.png',
  '4':                      '/categories/beauty.png',
  '5':                      '/categories/footwear.png',
  '6':                      '/categories/pickles.png',
  '7':                      '/categories/spices.png',
  '8':                      '/categories/fashion.png',
  '9':                      '/categories/jewellery.png',
  '10':                     '/categories/agriculture.png',
};

const defaultCategoryImages = [
  '/categories/juices.png',
  '/categories/cosmetics.png',
  '/categories/pickles.png',
  '/categories/footwear.png',
  '/categories/fashion.png',
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

  const displayCats = categories;

  return (
    <section className="bg-card border border-border-custom/80 rounded-3xl p-4 sm:p-5 shadow-xs overflow-hidden">
      <div className="relative flex items-center">
        {/* Scroll Left */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="absolute left-0 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-card border border-border-custom/80 shadow-md text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Categories Grid/Strip */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1 px-8 sm:px-10"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayCats.map((cat, idx) => {
            const id = (cat as any).slug || cat.id;
            const slug = String((cat as any).slug || '').toLowerCase();
            const idStr = String(cat.id).toLowerCase();
            const slugUnderscore = slug.replace(/-/g, '_');

            // FORCE local transparent PNG cutout, ignoring API cat.image completely
            const imgUrl = categoryImageMap[slug]
              || categoryImageMap[idStr]
              || categoryImageMap[slugUnderscore]
              || `/categories/${slug.split('-')[0]}.png`
              || defaultCategoryImages[idx % defaultCategoryImages.length];

            const bgTint = categoryBgMap[slug] || categoryBgMap[slugUnderscore] || categoryBgMap[idStr] || '#f8fafc';
            const label = getName(cat.name);

            return (
              <Link
                key={cat.id}
                href={`/category/${id}`}
                className="flex flex-col items-center group shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Pastel Rounded Card container with transparent PNG cutout matching reference UI */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-2.5 shadow-2xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-black/5 relative overflow-hidden"
                  style={{ backgroundColor: bgTint }}
                >
                  <img
                    src={imgUrl}
                    alt={label}
                    className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Category Name */}
                <span className="text-[11px] sm:text-xs font-bold text-center text-foreground group-hover:text-primary transition-colors max-w-[88px] sm:max-w-[100px] mt-2 line-clamp-2 leading-tight">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* View All Button Card matching reference image */}
          <Link
            href="/categories"
            className="flex flex-col items-center group shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-2.5 shadow-2xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-black/5 bg-slate-50 relative overflow-hidden text-blue-600">
              <Grid3X3 size={26} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-center text-foreground group-hover:text-primary transition-colors max-w-[88px] sm:max-w-[100px] mt-2 line-clamp-1 leading-tight">
              View All
            </span>
          </Link>
        </div>

        {/* Scroll Right */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="absolute right-0 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-card border border-border-custom/80 shadow-md text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

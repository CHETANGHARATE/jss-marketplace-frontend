'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

// Pastel background tint per category matching reference e-commerce UI
const categoryBgMap: Record<string, string> = {
  juices_syrups:          '#fff7ed', // Soft Amber
  religious_pooja_items:  '#fffbeb', // Soft Yellow/Gold
  cosmetics:              '#fdf2f8', // Soft Pink
  beauty_personal_care:   '#fff1f2', // Soft Rose
  footwear:               '#eff6ff', // Soft Blue
  pickles:                '#fef2f2', // Soft Red
  masale_spices:          '#fff7ed', // Soft Orange
  fashion:                '#fdf2f8', // Soft Pink
  jewellery:              '#fffbeb', // Soft Gold
  agriculture:            '#f0fdf4', // Soft Mint
  auto_accessories:       '#eef2ff', // Soft Indigo
  local_homemade:         '#fff7ed', // Soft Amber
  pooja_spiritual:        '#faf5ff', // Soft Purple
  gifts_handicrafts:      '#fdf2f8', // Soft Pink
  baby_kids:              '#fefce8', // Soft Yellow
  oil:                    '#f7fee7', // Soft Lime
  papad_kurdai:           '#fff7ed', // Soft Amber
  astro_stone:            '#f5f3ff', // Soft Violet
  diwali_faral:           '#fffbeb', // Soft Gold
  electronics:            '#f0f9ff', // Soft Sky Blue
  home_kitchen:           '#f8fafc', // Soft Slate
  furniture:              '#fff7ed', // Soft Amber
  books:                  '#eff6ff', // Soft Blue
  sports:                 '#f0fdf4', // Soft Green
  groceries:              '#f0fdf4', // Soft Green
  pet_supplies:           '#f0fdf4', // Soft Green
  health:                 '#ecfeff', // Soft Cyan
};

// Studio product cutout photo map matching reference UI (all local assets)
const categoryImageMap: Record<string, string> = {
  // Slugs with hyphens (from Backend API) & underscores (from Mock)
  'juices-syrups':          '/categories/juices.webp',
  'juices_syrups':          '/categories/juices.webp',
  'religious-pooja-items':  '/categories/pooja.webp',
  'religious_pooja_items':  '/categories/pooja.webp',
  'cosmetics':              '/categories/cosmetics.webp',
  'beauty-personal-care':   '/categories/beauty.webp',
  'beauty_personal_care':   '/categories/beauty.webp',
  'footwear':               '/categories/footwear.webp',
  'pickles':                '/categories/pickles.webp',
  'masale-spices':          '/categories/spices.webp',
  'masale_spices':          '/categories/spices.webp',
  'fashion':                '/categories/fashion.webp',
  'jewellery':              '/categories/jewellery.webp',
  'agriculture':            '/categories/agriculture.webp',
  'auto-accessories':       '/categories/auto.webp',
  'auto_accessories':       '/categories/auto.webp',
  'local-homemade':         '/categories/homemade.webp',
  'local_homemade':         '/categories/homemade.webp',
  'pooja-spiritual':        '/categories/pooja.webp',
  'pooja_spiritual':        '/categories/pooja.webp',
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
  '1':                      '/categories/juices.webp',
  '2':                      '/categories/pooja.webp',
  '3':                      '/categories/cosmetics.webp',
  '4':                      '/categories/beauty.webp',
  '5':                      '/categories/footwear.webp',
  '6':                      '/categories/pickles.webp',
  '7':                      '/categories/spices.webp',
  '8':                      '/categories/fashion.webp',
  '9':                      '/categories/jewellery.webp',
  '10':                     '/categories/agriculture.webp',
  '11':                     '/categories/auto.webp',
  '12':                     '/categories/homemade.webp',
  '13':                     '/categories/gifts.webp',
  '14':                     '/categories/baby.webp',
  '15':                     '/categories/oil.webp',
  '16':                     '/categories/papad.webp',
  '17':                     '/categories/astro.webp',
  '18':                     '/categories/diwali.webp',
  '19':                     '/categories/electronics.webp',
  '20':                     '/categories/kitchen.webp',
};

const defaultCategoryImages = [
  '/categories/juices.webp',
  '/categories/cosmetics.webp',
  '/categories/pickles.webp',
  '/categories/auto.webp',
  '/categories/homemade.webp',
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

  // Filter out extra categories "Beauty & Care" and "Agriculture & Seeds" from homepage category strip
  const displayCats = categories.filter(cat => {
    const name = getName(cat.name).toLowerCase().trim();
    const slug = String((cat as any).slug || '').toLowerCase().trim();
    const isBeautyCare = name === 'beauty & care' || name === 'beauty care' || slug === 'beauty-care' || slug === 'beauty_care';
    const isAgriSeeds = name === 'agriculture & seeds' || name === 'agriculture seeds' || slug === 'agriculture-seeds' || slug === 'agriculture_seeds';
    return !isBeautyCare && !isAgriSeeds;
  });

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

            // FORCE local /categories/*.webp image, ignoring API cat.image completely
            const imgUrl = categoryImageMap[slug]
              || categoryImageMap[idStr]
              || categoryImageMap[slugUnderscore]
              || `/categories/${slug.split('-')[0]}.webp`
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
                {/* Pastel Rounded Card container matching reference UI */}
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-2.5 shadow-2xs group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-black/5 relative overflow-hidden"
                  style={{ backgroundColor: bgTint }}
                >
                  <img
                    src={imgUrl}
                    alt={label}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* Category Name */}
                <span className="text-[11px] sm:text-xs font-bold text-center text-foreground group-hover:text-primary transition-colors max-w-[88px] sm:max-w-[100px] mt-2 line-clamp-2 leading-tight">
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
          className="absolute right-0 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-card border border-border-custom/80 shadow-md text-foreground hover:bg-primary hover:text-white transition-all backdrop-blur-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

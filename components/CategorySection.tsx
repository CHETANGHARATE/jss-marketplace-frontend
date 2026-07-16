'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shirt,
  Laptop,
  Sprout,
  Lamp,
  Sofa,
  Gem,
  BookOpen,
  Activity,
  Sparkles,
  Car,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Category } from '../types';

// Map icon strings to components
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Shirt,
  Laptop,
  Sprout,
  Lamp,
  Sofa,
  Gem,
  BookOpen,
  Activity,
  Sparkles,
  Car
};

// Rotating gradient palette — one per card, cycles if there are more categories than colors
const cardGradients = [
  'from-indigo-50 to-indigo-100 hover:from-indigo-500 hover:to-indigo-600',
  'from-blue-50 to-blue-100 hover:from-blue-500 hover:to-blue-600',
  'from-amber-50 to-amber-100 hover:from-amber-500 hover:to-amber-600',
  'from-pink-50 to-pink-100 hover:from-pink-500 hover:to-pink-600',
  'from-emerald-50 to-emerald-100 hover:from-emerald-500 hover:to-emerald-600',
  'from-purple-50 to-purple-100 hover:from-purple-500 hover:to-purple-600',
  'from-cyan-50 to-cyan-100 hover:from-cyan-500 hover:to-cyan-600',
  'from-rose-50 to-rose-100 hover:from-rose-500 hover:to-rose-600',
  'from-lime-50 to-lime-100 hover:from-lime-500 hover:to-lime-600',
  'from-sky-50 to-sky-100 hover:from-sky-500 hover:to-sky-600'
];

const iconGradients = [
  'from-indigo-400 to-indigo-600',
  'from-blue-400 to-blue-600',
  'from-amber-400 to-amber-600',
  'from-pink-400 to-pink-600',
  'from-emerald-400 to-emerald-600',
  'from-purple-400 to-purple-600',
  'from-cyan-400 to-cyan-600',
  'from-rose-400 to-rose-600',
  'from-lime-400 to-lime-600',
  'from-sky-400 to-sky-600'
];

interface CategorySectionProps {
  categories: Category[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const { t } = useLanguage();

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {t('home.popular_categories')}
          </h2>
          <p className="text-sm text-muted-custom mt-2 font-medium">
            {t('home.popular_categories_desc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat, index) => {
          const IconComponent = iconMap[cat.icon] || Sprout;
          const cardGradient = cardGradients[index % cardGradients.length];
          const iconGradient = iconGradients[index % iconGradients.length];

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`group flex flex-col items-center text-center p-6 bg-gradient-to-br ${cardGradient} border border-border-custom hover:border-transparent rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden`}
            >
              {/* Corner hover indicator */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-bl-3xl flex items-center justify-center translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={12} className="text-white" />
              </div>

              {/* Icon Container with its own gradient */}
              <div
                className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${iconGradient} text-white flex items-center justify-center mb-4 transition-all duration-300 shadow-inner group-hover:rotate-6 group-hover:scale-110`}
              >
                <IconComponent size={28} />
              </div>

              <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-white transition-colors">
                {t(cat.name)}
              </h3>

              <span className="text-[10px] text-muted-custom mt-1.5 font-semibold bg-white/60 border border-border-custom px-2 py-0.5 rounded-full group-hover:bg-white/20 group-hover:text-white group-hover:border-white/40 transition-all">
                Explore
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

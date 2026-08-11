'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Grid,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  X,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { getCategoryUrl } from '../utils/categoryUtils';
import { getCategoryVisualConfig } from '../utils/categoryVisuals';
import { getSubcategoryImage } from '../utils/categoryImages';
import { ApiCategory } from '../types/api';

// Soft pastel background tints for subcategory cards to match reference design
const CARD_TINT_CLASSES = [
  'bg-sky-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-sky-100/80 dark:border-slate-800',
  'bg-amber-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-amber-100/80 dark:border-slate-800',
  'bg-emerald-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-emerald-100/80 dark:border-slate-800',
  'bg-purple-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-purple-100/80 dark:border-slate-800',
  'bg-rose-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-rose-100/80 dark:border-slate-800',
  'bg-indigo-50/50 hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900 border-indigo-100/80 dark:border-slate-800',
];

export function MegaMenu() {
  const router = useRouter();
  const { data: categories = [], isLoading } = useCategories();
  const { language, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Default selected category when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCatId === null) {
      setSelectedCatId(categories[0].id);
    }
  }, [categories, selectedCatId]);

  // Click outside & Escape key listeners to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Active category object
  const activeCategory: ApiCategory | null =
    categories.find((c) => c.id === selectedCatId || String(c.id) === String(selectedCatId)) ||
    (categories.length > 0 ? categories[0] : null);

  const activeVisualConfig = getCategoryVisualConfig(activeCategory);
  const ActiveCategoryIcon = activeVisualConfig.icon;

  const handleSubcategoryClick = (cat: ApiCategory, subSlugOrId?: string) => {
    setIsOpen(false);
    const catUrl = getCategoryUrl(cat);
    if (subSlugOrId) {
      router.push(`${catUrl}?subcategory=${subSlugOrId}`);
    } else {
      router.push(catUrl);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ─── 1. ALL CATEGORIES BUTTON TRIGGER ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle All Categories Mega Menu"
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 shadow-2xs border cursor-pointer ${
          isOpen
            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
            : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60'
        }`}
      >
        <Grid className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        <span className="tracking-wide uppercase text-[11px] font-black">{t('nav.all_categories')}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ─── 2. MEGA MENU DROPDOWN PANEL ─── */}
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 top-[120px] bg-slate-950/30 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Desktop & Tablet Mega Menu Container */}
          <div className="absolute top-full left-0 mt-3 w-[92vw] max-w-[1240px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-3xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            {isLoading ? (
              <div className="py-20 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 animate-spin text-blue-600" />
                <span>{t('nav.loading_categories')}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-12 min-h-[500px] max-h-[76vh]">
                
                {/* ─── LEFT COLUMN: CATEGORIES SIDEBAR ─── */}
                <div className="col-span-4 lg:col-span-3 border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 p-3 sm:p-4 space-y-1 overflow-y-auto max-h-[76vh] scrollbar-thin">
                  <div className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('nav.categories')}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold">{categories.length}</span>
                  </div>

                  {categories.map((cat) => {
                    const isSelected = activeCategory?.id === cat.id;
                    const catName = getLocalizedText(cat.name, language);
                    const visualConfig = getCategoryVisualConfig(cat);
                    const IconComponent = visualConfig.icon;

                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setSelectedCatId(cat.id)}
                        onClick={() => setSelectedCatId(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer group ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/70 font-bold shadow-2xs'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Colorful Rounded Square Icon Container */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : `${visualConfig.iconBgLight} ${visualConfig.iconBgDark}`
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="truncate">{catName}</span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-all ${
                            isSelected ? 'text-blue-600 dark:text-blue-400 opacity-100 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 opacity-50 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* ─── RIGHT COLUMN: CATEGORY EXPLORER & SUBCATEGORIES GRID ─── */}
                <div className="col-span-8 lg:col-span-9 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[76vh] scrollbar-thin bg-white dark:bg-slate-900">
                  {activeCategory ? (
                    <>
                      {/* Active Category Header Bar */}
                      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800/80 gap-4">
                        <div className="flex items-center gap-4">
                          {/* Large Rounded Category Icon Container */}
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center shrink-0 shadow-2xs">
                            <ActiveCategoryIcon className="w-7 h-7" />
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                              {getLocalizedText(activeCategory.name, language)}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl line-clamp-1">
                              {activeCategory.description
                                ? getLocalizedText(activeCategory.description, language)
                                : `Furniture, decor, apparel, and premium products in ${getLocalizedText(activeCategory.name, language)}`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSubcategoryClick(activeCategory)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all shadow-2xs shrink-0 group cursor-pointer"
                        >
                          <span>View All Products</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Subcategories Visual Grid matching Reference Screenshot 2 */}
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Subcategories & Featured Collections
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(() => {
                            const apiSubcats = activeCategory.children || activeCategory.subcategories || [];
                            const activeCatSlug = String(activeCategory.slug || activeCategory.id || '').toLowerCase();
                            
                            // 1. If API provides subcategories
                            if (apiSubcats.length > 0) {
                              return apiSubcats.map((sub: any, idx: number) => {
                                const subName = getLocalizedText(sub.name, language);
                                const subSlug = sub.slug || String(sub.id);
                                const imageUrl = getSubcategoryImage(subSlug, subName, activeCatSlug);
                                const tintClass = CARD_TINT_CLASSES[idx % CARD_TINT_CLASSES.length];

                                return (
                                  <div
                                    key={sub.id || sub.slug || idx}
                                    onClick={() => handleSubcategoryClick(activeCategory, subSlug)}
                                    className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 flex items-center justify-between overflow-hidden ${tintClass}`}
                                  >
                                    {/* Left Text Block */}
                                    <div className="min-w-0 flex-1 pr-3 space-y-1.5 z-10">
                                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                        {subName}
                                      </h5>
                                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                        <span>Explore collection</span>
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                      </span>
                                    </div>

                                    {/* Right Cutout Image Container */}
                                    <div className="w-28 sm:w-36 h-24 shrink-0 flex items-center justify-center relative overflow-hidden rounded-xl bg-white/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-1">
                                      <img
                                        src={imageUrl}
                                        alt={subName}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
                                        loading="lazy"
                                      />
                                    </div>
                                  </div>
                                );
                              });
                            }

                            // 2. Fallback to default visual presets
                            return activeVisualConfig.defaultSubcategories.map((preset, idx) => {
                              const subSlug = preset.slug;
                              const imageUrl = getSubcategoryImage(subSlug, preset.name, activeCatSlug);
                              const tintClass = CARD_TINT_CLASSES[idx % CARD_TINT_CLASSES.length];

                              return (
                                <div
                                  key={preset.slug || idx}
                                  onClick={() => handleSubcategoryClick(activeCategory, preset.slug)}
                                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 flex items-center justify-between overflow-hidden ${tintClass}`}
                                >
                                  {/* Left Text Block */}
                                  <div className="min-w-0 flex-1 pr-3 space-y-1.5 z-10">
                                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                      {preset.name}
                                    </h5>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                      <span>Explore collection</span>
                                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                  </div>

                                  {/* Right Cutout Image Container */}
                                  <div className="w-28 sm:w-36 h-24 shrink-0 flex items-center justify-center relative overflow-hidden rounded-xl bg-white/70 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-1">
                                    <img
                                      src={imageUrl}
                                      alt={preset.name}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
                                      loading="lazy"
                                    />
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-20 text-center text-xs font-bold text-slate-400">
                      Select a category to explore its collections
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

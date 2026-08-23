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
  Layers
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { getCategoryUrl } from '../utils/categoryUtils';
import { getCategoryVisualConfig } from '../utils/categoryVisuals';
import { getSubcategoryImage } from '../utils/categoryImages';
import { ApiCategory } from '../types/api';

export function MegaMenu() {
  const router = useRouter();
  const { data: categories = [], isLoading } = useCategories();
  const { language, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<number | string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Set default selected category when categories load
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
      {/* ─── 1. ALL CATEGORIES BUTTON TRIGGER (REDESIGNED: STUNNING VIBRANT BLUE PRIMARY) ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle All Categories Mega Menu"
        className={`flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl font-extrabold text-xs transition-all duration-200 cursor-pointer text-white shadow-xs ${
          isOpen
            ? 'bg-gradient-to-r from-blue-700 to-indigo-700 shadow-md ring-2 ring-blue-400/50'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-md'
        }`}
      >
        <Grid className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        <span className="tracking-tight text-xs font-black text-white">{t('nav.all_categories')}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/90 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ─── 2. MEGA MENU DROPDOWN PANEL (PURE WHITE IN LIGHT MODE, DARK NAVY IN DARK MODE) ─── */}
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 top-[120px] bg-slate-900/30 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Desktop & Tablet Mega Menu Container */}
          <div className="absolute top-full left-0 mt-3 w-[92vw] max-w-[1240px] bg-white dark:bg-[#0B1428] text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-3xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            {isLoading ? (
              <div className="py-20 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 animate-spin text-blue-600" />
                <span>{t('nav.loading_categories')}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-12 min-h-[500px] max-h-[76vh]">
                
                {/* ─── LEFT COLUMN: CATEGORIES SIDEBAR (LIGHT IN LIGHT MODE, DARK IN DARK MODE) ─── */}
                <div className="col-span-4 lg:col-span-3 border-r border-slate-200/90 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#060D1E] p-3 sm:p-4 space-y-1 overflow-y-auto max-h-[76vh] scrollbar-thin">
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
                            ? 'bg-blue-50/90 text-blue-600 border border-blue-200/90 font-bold shadow-2xs dark:bg-blue-950/70 dark:text-blue-400 dark:border-blue-800/80'
                            : 'text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Category Icon Container */}
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
                <div className="col-span-8 lg:col-span-9 p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[76vh] scrollbar-thin bg-white dark:bg-[#0B1428]">
                  {activeCategory ? (
                    <>
                      {/* Active Category Header Bar */}
                      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 gap-3">
                        <div className="flex items-center gap-3">
                          {/* Category Icon Container */}
                          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60 flex items-center justify-center shrink-0 shadow-2xs">
                            <ActiveCategoryIcon className="w-5 h-5" />
                          </div>

                          <div className="space-y-0.5">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                              {getLocalizedText(activeCategory.name, language)}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xl line-clamp-1">
                              {activeCategory.description
                                ? getLocalizedText(activeCategory.description, language)
                                : `Explore premium collections and products in ${getLocalizedText(activeCategory.name, language)}`}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSubcategoryClick(activeCategory)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all shadow-2xs shrink-0 group cursor-pointer"
                        >
                          <span>View All</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Subcategories Grid (Compact Length + Prominent Image & Text) */}
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Subcategories & Featured Collections
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                          {(() => {
                            const apiSubcats = activeCategory.children || activeCategory.subcategories || [];
                            const activeCatSlug = String(activeCategory.slug || activeCategory.id || '').toLowerCase();
                            
                            // Render API subcategories if present
                            if (apiSubcats.length > 0) {
                              return apiSubcats.map((sub: any, idx: number) => {
                                const subName = getLocalizedText(sub.name, language);
                                const subSlug = sub.slug || String(sub.id);
                                const imageUrl = getSubcategoryImage(subSlug, subName, activeCatSlug);

                                return (
                                  <div
                                    key={sub.id || sub.slug || idx}
                                    onClick={() => handleSubcategoryClick(activeCategory, subSlug)}
                                    className="group relative cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800 p-3 transition-all duration-200 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center text-center gap-2 overflow-hidden hover:-translate-y-0.5"
                                  >
                                    {/* Large Prominent Cutout Image Box */}
                                    <div className="w-full h-24 sm:h-28 flex items-center justify-center rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 p-2 shadow-2xs">
                                      <img
                                        src={imageUrl}
                                        alt={subName}
                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/images/subcategories/high-yield-seeds.svg';
                                        }}
                                      />
                                    </div>

                                    {/* Bold Title & Callout Block */}
                                    <div className="w-full space-y-0.5">
                                      <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                        {subName}
                                      </h5>
                                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                        <span>Explore</span>
                                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                    </div>
                                  </div>
                                );
                              });
                            }

                            // Fallback to default visual presets if no API subcategories exist
                            return activeVisualConfig.defaultSubcategories.map((preset, idx) => {
                              const subSlug = preset.slug;
                              const imageUrl = getSubcategoryImage(subSlug, preset.name, activeCatSlug);

                              return (
                                <div
                                  key={preset.slug || idx}
                                  onClick={() => handleSubcategoryClick(activeCategory, preset.slug)}
                                  className="group relative cursor-pointer rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800 p-3 transition-all duration-200 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 flex flex-col items-center text-center gap-2 overflow-hidden hover:-translate-y-0.5"
                                >
                                  {/* Large Prominent Cutout Image Box */}
                                  <div className="w-full h-24 sm:h-28 flex items-center justify-center rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 p-2 shadow-2xs">
                                    <img
                                      src={imageUrl}
                                      alt={preset.name}
                                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/subcategories/high-yield-seeds.svg';
                                      }}
                                    />
                                  </div>

                                  {/* Bold Title & Callout Block */}
                                  <div className="w-full space-y-0.5">
                                    <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                      {preset.name}
                                    </h5>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                      <span>Explore</span>
                                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </span>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-20 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
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

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
import { getCategoryVisualConfig, getSubcategoryImage } from '../utils/categoryVisuals';
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

  // Click outside to close
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
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 shadow-2xs border ${
          isOpen
            ? 'bg-primary text-white border-primary shadow-md'
            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
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
            className="fixed inset-0 top-[120px] bg-black/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Desktop & Tablet Mega Menu Container */}
          <div className="absolute top-full left-0 mt-3 w-[88vw] max-w-[1240px] bg-card border border-border-custom/80 shadow-2xl rounded-3xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
            {isLoading ? (
              <div className="py-20 text-center text-xs font-bold text-foreground/60 flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 animate-spin text-primary" />
                <span>{t('nav.loading_categories')}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-12 min-h-[480px] max-h-[75vh]">
                
                {/* ─── LEFT COLUMN: CATEGORIES SIDEBAR ─── */}
                <div className="col-span-4 lg:col-span-3 border-r border-border-custom/60 bg-background-secondary/50 p-3 sm:p-4 space-y-1.5 overflow-y-auto max-h-[75vh] scrollbar-thin">
                  <div className="px-3 py-2 text-[10px] font-black text-muted-custom uppercase tracking-wider flex items-center justify-between">
                    <span>{t('nav.categories')}</span>
                    <span className="text-primary font-bold">{categories.length}</span>
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
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl text-xs font-bold transition-all text-left group ${
                          isSelected
                            ? 'bg-card text-primary shadow-sm border border-primary/20 border-l-4 border-l-primary'
                            : 'text-foreground/80 hover:bg-card/70 hover:text-foreground border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Icon Pill */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 ${visualConfig.iconBgLight} ${visualConfig.iconBgDark}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="truncate">{catName}</span>
                        </div>

                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-all ${
                            isSelected ? 'text-primary opacity-100 translate-x-0.5' : 'text-muted-custom/40 opacity-40 group-hover:opacity-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* ─── RIGHT COLUMN: CATEGORY EXPLORER & SUBCATEGORIES GRID ─── */}
                <div className="col-span-8 lg:col-span-9 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh] scrollbar-thin bg-card">
                  {activeCategory ? (
                    <>
                      {/* Active Category Header Bar */}
                      <div className="flex items-center justify-between pb-4 border-b border-border-custom/60 gap-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full">
                            <Layers size={11} />
                            <span>Category Explorer</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                            {getLocalizedText(activeCategory.name, language)}
                          </h3>
                          <p className="text-xs text-muted-custom font-medium max-w-xl line-clamp-1">
                            {activeCategory.description
                              ? getLocalizedText(activeCategory.description, language)
                              : `Explore popular collections and products in ${getLocalizedText(activeCategory.name, language)}`}
                          </p>
                        </div>

                        <button
                          onClick={() => handleSubcategoryClick(activeCategory)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-hover transition-all shadow-2xs shrink-0 group"
                        >
                          <span>View All Products</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Subcategories Visual Grid */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-muted-custom uppercase tracking-wider">
                          Subcategories & Featured Collections
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {(() => {
                            const apiSubcats = activeCategory.children || activeCategory.subcategories || [];
                            
                            // If API provides subcategories, map them with exact matching dedicated images
                            if (apiSubcats.length > 0) {
                              return apiSubcats.map((sub: any, idx: number) => {
                                const subName = getLocalizedText(sub.name, language);
                                const subImg = sub.image || sub.primary_image || getSubcategoryImage(subName || sub.slug, activeCategory);

                                return (
                                  <div
                                    key={sub.id || sub.slug || idx}
                                    onClick={() => handleSubcategoryClick(activeCategory, sub.slug || String(sub.id))}
                                    className="group cursor-pointer bg-background-secondary/60 hover:bg-background-secondary border border-border-custom/70 hover:border-primary/30 rounded-2xl p-3 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                                  >
                                    <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-card mb-3 border border-border-custom/40">
                                      <img
                                        src={subImg}
                                        alt={subName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div>
                                      <h5 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {subName}
                                      </h5>
                                      <span className="text-[10px] font-bold text-primary group-hover:underline flex items-center gap-1 mt-1">
                                        <span>Explore collection</span>
                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                    </div>
                                  </div>
                                );
                              });
                            }

                            // Fallback to default presets for this category with exact matching image lookup
                            return activeVisualConfig.defaultSubcategories.map((preset, idx) => {
                              const subImg = getSubcategoryImage(preset.name || preset.slug, activeCategory) || preset.image;

                              return (
                                <div
                                  key={preset.slug || idx}
                                  onClick={() => handleSubcategoryClick(activeCategory, preset.slug)}
                                  className="group cursor-pointer bg-background-secondary/60 hover:bg-background-secondary border border-border-custom/70 hover:border-primary/30 rounded-2xl p-3 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                                >
                                  <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-card mb-3 border border-border-custom/40">
                                    <img
                                      src={subImg}
                                      alt={preset.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>

                                  <div>
                                    <h5 className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                      {preset.name}
                                    </h5>
                                    <span className="text-[10px] font-bold text-primary group-hover:underline flex items-center gap-1 mt-1">
                                      <span>{preset.description}</span>
                                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
                    <div className="py-20 text-center text-xs font-bold text-muted-custom">
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

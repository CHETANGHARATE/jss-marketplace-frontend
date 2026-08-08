'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCategories } from '../hooks/useCategories';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { ChevronRight, Grid, Sparkles } from 'lucide-react';
import { ApiCategory } from '../types/api';

export function MegaMenu() {
  const { data: categories = [], isLoading } = useCategories();
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ApiCategory | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const currentCategory = activeCategory || (categories.length > 0 ? categories[0] : null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-all duration-200">
        <Grid className="w-4 h-4" />
        <span>{t('nav.all_categories')}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[800px] bg-card border border-border/40 shadow-2xl rounded-2xl p-6 z-50 grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="col-span-12 py-12 text-center text-sm text-foreground/60 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-primary" />
              <span>{t('nav.loading_categories')}</span>
            </div>
          ) : (
            <>
              <div className="col-span-4 border-r border-border/40 pr-4 space-y-1 max-h-[380px] overflow-y-auto">
                {categories.map((cat) => {
                  const isActive = currentCategory?.id === cat.id;
                  const categoryName = getLocalizedText(cat.name, language);
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span className="truncate">{categoryName}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="col-span-8 space-y-4">
                {currentCategory && (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
                      <div>
                        <h4 className="text-base font-bold text-foreground">
                          {getLocalizedText(currentCategory.name, language)}
                        </h4>
                        {currentCategory.description && (
                          <p className="text-xs text-foreground/60 line-clamp-1">
                            {typeof currentCategory.description === 'string' ? currentCategory.description : (currentCategory.description?.en || '')}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/category/${currentCategory.slug}`}
                        className="text-xs font-semibold text-primary hover:underline"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('home.view_all_products')} &rarr;
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {(() => {
                        const subcats = currentCategory.subcategories || currentCategory.children || [];
                        if (subcats.length === 0) {
                          return (
                            <div className="col-span-2 py-6 text-center text-xs text-foreground/50 bg-muted/20 rounded-xl">
                              {t('nav.categories')}
                            </div>
                          );
                        }
                        return subcats.map((subCat: any) => (
                          <Link
                            key={subCat.id || subCat.slug}
                            href={`/category/${subCat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="p-3 bg-muted/40 hover:bg-muted rounded-xl transition-colors group"
                          >
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors block">
                              {getLocalizedText(subCat.name, language)}
                            </span>
                            <span className="text-[11px] text-foreground/50">{t('home.view_all')} &rarr;</span>
                          </Link>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/translation';
import { Category, Product } from '../types';
import { productService, mapApiProductToProduct } from '../services/productService';
import { ProductCard } from './ProductCard';

interface FeaturedCategoriesProps {
  categories: Category[];
  onQuickView: (productId: string) => void;
}

const getName = (name: any): string => {
  if (!name) return '';
  if (typeof name === 'string') {
    return name.replace(/^cat\./, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (typeof name === 'object') {
    return name.en || name.hi || name.mr || Object.values(name)[0] || '';
  }
  return '';
};

const normalizeCatKey = (cat: Category): string => {
  const rawSlug = String((cat as any).slug || cat.id || '').toLowerCase();
  const nameStr = getName(cat.name).toLowerCase();
  const cleanStr = (nameStr || rawSlug)
    .replace(/[-_]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanStr.includes('pooja') || cleanStr.includes('religious') || cleanStr.includes('spiritual')) {
    return 'religious_pooja';
  }
  if (cleanStr.includes('gifts') || cleanStr.includes('handicrafts')) {
    return 'gifts_handicrafts';
  }
  if (cleanStr.includes('baby') || cleanStr.includes('kids')) {
    return 'baby_kids';
  }
  if (cleanStr.includes('papad') || cleanStr.includes('kurdai')) {
    return 'papad_kurdai';
  }
  if (cleanStr.includes('astro') || cleanStr.includes('stone')) {
    return 'astro_stone';
  }
  if (cleanStr.includes('homemade') || cleanStr.includes('local')) {
    return 'local_homemade';
  }
  if (cleanStr.includes('masale') || cleanStr.includes('spices')) {
    return 'masale_spices';
  }
  if (cleanStr.includes('juices') || cleanStr.includes('syrups')) {
    return 'juices_syrups';
  }
  return cleanStr;
};

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories, onQuickView }) => {
  const { t, language } = useLanguage();
  const [featuredData, setFeaturedData] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  // Deduplicate categories strictly so each category section appears EXACTLY ONCE
  const seenKeys = new Set<string>();
  const uniqueCategories = categories.filter((cat) => {
    const idKey = String(cat.id).toLowerCase();
    const slugKey = String((cat as any).slug || '').toLowerCase();
    const semanticKey = normalizeCatKey(cat);

    if (seenKeys.has(idKey) || (slugKey && seenKeys.has(slugKey)) || (semanticKey && seenKeys.has(semanticKey))) {
      return false;
    }

    if (idKey) seenKeys.add(idKey);
    if (slugKey) seenKeys.add(slugKey);
    if (semanticKey) seenKeys.add(semanticKey);
    return true;
  });

  useEffect(() => {
    const fetchAllFeatured = async () => {
      setLoading(true);
      try {
        const promises = uniqueCategories.map(async (cat) => {
          try {
            const response = await productService.getProducts({
              category: String(cat.id),
              per_page: 5,
              in_stock_first: 1
            });
            const products = (response.data || []).map(mapApiProductToProduct).slice(0, 5);
            return { categoryId: String(cat.id), products };
          } catch {
            return { categoryId: String(cat.id), products: [] };
          }
        });

        const results = await Promise.all(promises);
        const dataMap: Record<string, Product[]> = {};
        results.forEach((res) => {
          dataMap[res.categoryId] = res.products.slice(0, 5);
        });

        setFeaturedData(dataMap);
      } catch (err) {
        console.error('Error fetching featured products by category', err);
      } finally {
        setLoading(false);
      }
    };

    if (uniqueCategories.length > 0) {
      fetchAllFeatured();
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="space-y-4 animate-pulse">
            <div className="h-8 bg-background-secondary rounded-2xl w-1/4" />
            <div className="h-4 bg-background-secondary rounded-xl w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-80 bg-background-secondary rounded-3xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 lg:space-y-12">
      {uniqueCategories.map((cat) => {
        const products = (featuredData[String(cat.id)] || []).slice(0, 5);
        if (products.length === 0) return null;

        return (
          <section key={cat.id} className="space-y-6 scroll-mt-24 border-b border-border-custom/60 last:border-0 pb-8 last:pb-0">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-accent uppercase tracking-widest bg-accent/10 px-2.5 py-0.5 rounded-full mb-1">
                  <Sparkles size={12} className="fill-accent" />
                  <span>{t('home.curated_collection')}</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight mt-1">
                  {getLocalizedText(cat.name, language)}
                </h2>
                <p className="text-xs sm:text-sm text-muted-custom mt-1 max-w-2xl font-medium">
                  {getLocalizedText(cat.description, language) || t('home.popular_categories_desc')}
                </p>
              </div>

              <Link
                href={`/category/${cat.id}`}
                className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2.5 rounded-2xl transition-all self-start md:self-auto shrink-0 shadow-2xs group"
              >
                <span>{t('home.view_all')} {getLocalizedText(cat.name, language)}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Product Cards Grid - Exactly 5 items visible per row on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

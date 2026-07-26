'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Category, Product } from '../types';
import { getFeaturedProductsByCategory } from '../services/product';
import { ProductCard } from './ProductCard';

interface FeaturedCategoriesProps {
  categories: Category[];
  onQuickView: (productId: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories, onQuickView }) => {
  const { t } = useLanguage();
  const [featuredData, setFeaturedData] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllFeatured = async () => {
      setLoading(true);
      try {
        const promises = categories.map(async (cat) => {
          const products = await getFeaturedProductsByCategory(cat.id, 4);
          return { categoryId: cat.id, products };
        });
        
        const results = await Promise.all(promises);
        const dataMap: Record<string, Product[]> = {};
        results.forEach((res) => {
          dataMap[res.categoryId] = res.products;
        });
        
        setFeaturedData(dataMap);
      } catch (err) {
        console.error('Error fetching featured products by category', err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchAllFeatured();
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="space-y-12">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="space-y-4 animate-pulse">
            <div className="h-8 bg-background-secondary rounded-lg w-1/4" />
            <div className="h-4 bg-background-secondary rounded-lg w-1/3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-72 bg-background-secondary rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {categories.map((cat) => {
        const products = featuredData[cat.id] || [];
        if (products.length === 0) return null;

        return (
          <section key={cat.id} className="space-y-6 scroll-mt-24 border-b border-border-custom last:border-0 pb-16 last:pb-0">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-accent tracking-wider uppercase">
                  <Sparkles size={12} className="fill-accent" />
                  <span>Featured Collection</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
                  {t(cat.name)}
                </h2>
                <p className="text-sm text-muted-custom mt-1 max-w-2xl font-medium">
                  {cat.description}
                </p>
              </div>
              
              <Link
                href={`/category/${cat.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-hover hover:gap-2.5 transition-all w-max bg-primary/5 hover:bg-primary/10 border border-primary/10 px-4.5 py-2.5 rounded-2xl"
              >
                <span>View All {t(cat.name)} Products</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
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

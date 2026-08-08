'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, TrendingUp } from 'lucide-react';

// New homepage components (reference redesign)
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { HomeCategoryStrip } from '../components/HomeCategoryStrip';
import { HomePromoBanners } from '../components/HomePromoBanners';
import { HomeServiceStrip } from '../components/HomeServiceStrip';
import { FlashSaleCarousel } from '../components/FlashSaleCarousel';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HomeFaqSection } from '../components/HomeFaqSection';

// Existing reusable components
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { FeaturedCategories } from '../components/FeaturedCategories';

// Services
import { categoryService } from '../services/categoryService';
import { productService, mapApiProductToProduct } from '../services/productService';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

export default function HomePage() {
  const langContext = useLanguage();
  const translate = langContext ? langContext.t : (k: string) => k;

  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawCats = await categoryService.getCategories();
        const seenCatKeys = new Set<string>();
        const uniqueCats = (rawCats || []).filter((c: any) => {
          const slug = String(c.slug || c.id || '').toLowerCase().trim();
          const name = (typeof c.name === 'string' ? c.name : (c.name?.en || c.name?.hi || c.name?.mr || '')).toLowerCase().trim();
          const key = slug || name;
          if (!key || seenCatKeys.has(key)) return false;
          seenCatKeys.add(key);
          return true;
        });
        setCategories(uniqueCats);

        const [trendingRes, featuredRes, allProdsRes] = await Promise.allSettled([
          productService.getTrendingProducts(),
          productService.getFeaturedProducts(),
          productService.getProducts({ per_page: 50, in_stock_first: 1 })
        ]);

        let trending: Product[] = [];
        if (trendingRes.status === 'fulfilled' && trendingRes.value.length > 0) {
          trending = trendingRes.value.map(mapApiProductToProduct);
        } else if (allProdsRes.status === 'fulfilled' && allProdsRes.value.data) {
          trending = (allProdsRes.value.data || []).map(mapApiProductToProduct);
        }

        let featured: Product[] = [];
        if (featuredRes.status === 'fulfilled' && featuredRes.value.length > 0) {
          featured = featuredRes.value.map(mapApiProductToProduct);
        }

        setTrendingProducts(trending);
        setNewArrivals(trending.slice(4, 12));
        setBestSellers(featured.length > 0 ? featured : trending);
      } catch (err) {
        console.error('Failed to load homepage data from backend services', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* ─── 1. Hero Banner Slider ─── */}
      <HeroBannerSlider />

      {/* ─── 2. Category Strip (scrollable circular icons) ─── */}
      {categories.length > 0 && <HomeCategoryStrip categories={categories} />}

      {/* ─── 3. Promotional Banners (4-grid) ─── */}
      <HomePromoBanners />

      {/* ─── 4. Service Strip (trust signals) ─── */}
      <HomeServiceStrip />

      {/* ─── 5. Today's Deals & Flash Sales (Auto Carousel) ─── */}
      <FlashSaleCarousel
        products={trendingProducts}
        onQuickView={setQuickViewProductId}
        timeLeft={timeLeft}
      />

      {/* ─── 6. Featured Categories & Products Showcase ─── */}
      {categories.length > 0 && (
        <FeaturedCategories
          categories={categories}
          onQuickView={setQuickViewProductId}
        />
      )}

      {/* ─── 7. Trending Products Grid ─── */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
              <TrendingUp size={12} />
              <span>Buyer Favorites</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tight mt-1">
              Trending Products Across India
            </h2>
            <p className="text-xs sm:text-sm text-muted-custom mt-1 font-medium max-w-2xl">
              Most purchased authentic items across fashion, electronics, regional faral, and certified agricultural inputs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.concat(newArrivals).slice(0, 4).map((prod) => (
            <ProductCard
              key={`trend_grid_${prod.id}`}
              product={prod}
              onQuickView={setQuickViewProductId}
            />
          ))}
        </div>
      </section>

      {/* ─── 8. Why Choose JSS Marketplace ─── */}
      <WhyChooseUs />

      {/* ─── 9. FAQ Section ─── */}
      <HomeFaqSection />

      {quickViewProductId && (
        <ProductQuickView
          productId={quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
        />
      )}
    </div>
  );
}

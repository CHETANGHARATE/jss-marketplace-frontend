'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

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

        const [trendingRes, allProdsRes] = await Promise.allSettled([
          productService.getTrendingProducts(),
          productService.getProducts({ per_page: 50, in_stock_first: 1 })
        ]);

        let trending: Product[] = [];
        if (trendingRes.status === 'fulfilled' && trendingRes.value.length > 0) {
          trending = trendingRes.value.map(mapApiProductToProduct);
        } else if (allProdsRes.status === 'fulfilled' && allProdsRes.value.data) {
          trending = (allProdsRes.value.data || []).map(mapApiProductToProduct);
        }

        setTrendingProducts(trending);
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

      {/* ─── 7. Why Choose JSS Marketplace ─── */}
      <WhyChooseUs />

      {/* ─── 8. FAQ Section ─── */}
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

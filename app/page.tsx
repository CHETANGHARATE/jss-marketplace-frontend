'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Homepage components
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { HomeCategoryStrip } from '../components/HomeCategoryStrip';
import { HomePromoBanners } from '../components/HomePromoBanners';
import { FlashSaleCarousel } from '../components/FlashSaleCarousel';
import { TrendingProductsCarousel } from '../components/TrendingProductsCarousel';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HomeFaqSection } from '../components/HomeFaqSection';

// Reusable components
import { ProductQuickView } from '../components/ProductQuickView';
import { FeaturedCategories } from '../components/FeaturedCategories';

// Services
import { categoryService } from '../services/categoryService';
import { productService, mapApiProductToProduct } from '../services/productService';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

export default function HomePage() {
  const { t } = useLanguage();

  const [categories, setCategories] = useState<any[]>([]);
  const [flashProducts, setFlashProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 19, seconds: 9 });

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

        // Fetch Flash Sales, Trending Products, and All Products in parallel
        const [trendingRes, allProdsRes] = await Promise.allSettled([
          productService.getTrendingProducts(),
          productService.getProducts({ per_page: 50, in_stock_first: 1 })
        ]);

        let allMapped: Product[] = [];
        if (allProdsRes.status === 'fulfilled' && allProdsRes.value.data) {
          allMapped = (allProdsRes.value.data || []).map(mapApiProductToProduct);
        }

        let trending: Product[] = [];
        if (trendingRes.status === 'fulfilled' && trendingRes.value.length > 0) {
          trending = trendingRes.value.map(mapApiProductToProduct);
        } else if (allMapped.length > 0) {
          trending = [...allMapped].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 15);
        }

        // Discounted products for Flash Sales
        const flash = allMapped.filter((p) => (p.discountPercent || 0) > 0);
        setFlashProducts(flash.length > 0 ? flash : allMapped.slice(0, 10));
        setTrendingProducts(trending.length > 0 ? trending : allMapped.slice(0, 15));
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

      {/* ─── 2. Category Strip (Increased Icon Size + Right-to-Left Auto-Motion) ─── */}
      {categories.length > 0 && <HomeCategoryStrip categories={categories} />}

      {/* ─── 3. Promotional Banners (4-grid) ─── */}
      <HomePromoBanners />

      {/* ─── 4. Today's Deals & Flash Sales (Auto Carousel with Timer) ─── */}
      {flashProducts.length > 0 && (
        <FlashSaleCarousel
          products={flashProducts}
          onQuickView={setQuickViewProductId}
          timeLeft={timeLeft}
        />
      )}

      {/* ─── 5. Trending Products (Continuous Forward Auto-Swipe Carousel) ─── */}
      {trendingProducts.length > 0 && (
        <TrendingProductsCarousel
          products={trendingProducts}
          onQuickView={setQuickViewProductId}
        />
      )}

      {/* ─── 6. Curated Category Collections (including Astro Stone) ─── */}
      {categories.length > 0 && (
        <FeaturedCategories
          categories={categories}
          onQuickView={setQuickViewProductId}
        />
      )}

      {/* ─── 7. Why Choose JSS Marketplace ─── */}
      <WhyChooseUs />

      {/* ─── 8. FAQ Section (All questions closed initially by default) ─── */}
      <HomeFaqSection />

      {/* Quick View Modal */}
      {quickViewProductId && (
        <ProductQuickView
          productId={quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
        />
      )}
    </div>
  );
}

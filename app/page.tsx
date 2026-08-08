'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, TrendingUp, ShieldCheck, Mail, Send } from 'lucide-react';

// New homepage components (reference redesign)
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { HomeCategoryStrip } from '../components/HomeCategoryStrip';
import { HomePromoBanners } from '../components/HomePromoBanners';
import { HomeServiceStrip } from '../components/HomeServiceStrip';
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

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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

        const [trendingRes, featuredRes] = await Promise.allSettled([
          productService.getTrendingProducts(),
          productService.getFeaturedProducts()
        ]);

        let trending: Product[] = [];
        if (trendingRes.status === 'fulfilled' && trendingRes.value.length > 0) {
          trending = trendingRes.value.map(mapApiProductToProduct);
        } else {
          const allProds = await productService.getProducts({ per_page: 8 });
          trending = (allProds.data || []).map(mapApiProductToProduct);
        }

        let featured: Product[] = [];
        if (featuredRes.status === 'fulfilled' && featuredRes.value.length > 0) {
          featured = featuredRes.value.map(mapApiProductToProduct);
        }

        setTrendingProducts(trending.slice(0, 4));
        setNewArrivals(trending.slice(4, 8));
        setBestSellers(featured.length > 0 ? featured : trending);
      } catch (err) {
        console.error('Failed to load homepage data from backend services', err);
      }
    };
    loadData();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

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

      {/* ─── 5. Today's Deals & Flash Sales ─── */}
      <section id="deals" className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-custom/80">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 bg-rose-500 text-white flex items-center justify-center rounded-2xl font-bold shadow-xs shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded-full mb-1">
                <span>Limited Time Offer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
                Today's Flash Sales
              </h2>
              <p className="text-xs text-muted-custom mt-0.5 font-medium">Verified marketplace discounts directly from source. Deal ends in:</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-foreground font-black">
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Hours</span>
            </div>
            <span className="text-rose-500 font-black text-lg mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Mins</span>
            </div>
            <span className="text-rose-500 font-black text-lg mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Secs</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={`flash_${prod.id}`}
              product={prod}
              onQuickView={setQuickViewProductId}
            />
          ))}
        </div>
      </section>

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

      {/* ─── 10. Newsletter Subscription ─── */}
      <section className="bg-card border border-border-custom/80 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xs">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
            <Mail size={14} />
            <span>Marketplace Newsletter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Subscribe For Weekly Flash Sales & Insider Deals
          </h2>
          <p className="text-xs sm:text-sm text-muted-custom font-medium leading-relaxed">
            Get exclusive multi-vendor coupons, new category alerts, and festival discount notifications directly in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background-secondary text-foreground text-xs sm:text-sm px-4 py-3.5 rounded-2xl border border-border-custom focus:border-primary focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-primary text-white font-bold text-xs sm:text-sm uppercase px-6 py-3.5 rounded-2xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
            >
              <span>Subscribe</span>
              <Send size={14} />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-emerald-600 font-bold pt-1">
              ✓ Thank you! You have successfully subscribed to weekly deal alerts.
            </p>
          )}
        </div>
      </section>

      {/* ─── 11. FAQ Section ─── */}
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

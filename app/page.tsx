'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Clock, Star, ShieldCheck, CheckCircle2, Award, Zap, Truck, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BannerSlider } from '../components/BannerSlider';
import { CategorySection } from '../components/CategorySection';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { PersonalizedSection } from '../components/PersonalizedSection';
import { Accordion } from '../components/ui/Accordion';
import { categoryService } from '../services/categoryService';
import { productService, mapApiProductToProduct } from '../services/productService';
import { Product, Seller } from '../types';
import { mockTestimonials, mockFaqs } from '../constants/mockData';

export default function HomePage() {
  const langContext = useLanguage();
  const translate = langContext ? langContext.t : (k: string) => k;

  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<Seller[]>([]);
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
        const cats = await categoryService.getCategories();
        setCategories(cats);

        const trending = await productService.getTrendingProducts();
        setTrendingProducts(trending.slice(0, 4).map(mapApiProductToProduct));

        const fresh = await productService.getProducts({ sort: 'newest', per_page: 4 });
        setNewArrivals(fresh.data.map(mapApiProductToProduct));

        const topRated = await productService.getProducts({ sort: 'best_selling', per_page: 4 });
        setBestSellers(topRated.data.map(mapApiProductToProduct));

        // NOTE: no public "featured vendors" endpoint exists yet in the
        // backend-integrated system — vendorService only exposes
        // authenticated seller-dashboard endpoints (see audit). Left empty
        // rather than reintroducing the mock services/seller.ts dependency.
        setFeaturedSellers([]);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Banner Slider */}
      <BannerSlider />

      {/* 2. All 20 Categories Section */}
      {categories.length > 0 && <CategorySection categories={categories} />}

      {/* 3. Today's Deals Section (Flash Sale) */}
      <section id="deals" className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-custom">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-rose-500 text-white flex items-center justify-center rounded-xl font-bold">
              <Clock size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                Today's Deals & Flash Sales
              </h2>
              <p className="text-xs text-muted-custom mt-0.5 font-medium">Exclusive public marketplace discounts. Deal ends in:</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-foreground font-black">
            <span className="bg-background-secondary border border-border-custom px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-rose-500 font-bold">:</span>
            <span className="bg-background-secondary border border-border-custom px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-rose-500 font-bold">:</span>
            <span className="bg-background-secondary border border-border-custom px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {trendingProducts.map((prod) => (
            <ProductCard
              key={`flash_${prod.id}`}
              product={prod}
              onQuickView={setQuickViewProductId}
            />
          ))}
        </div>
      </section>

      {/* 4. Trending Products Showcase */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Zap size={14} />
            <span>Buyer Choice</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
            Trending Products Across India
          </h2>
          <p className="text-xs text-muted-custom mt-1 font-medium">
            Top purchased items across fashion, electronics, regional faral, and local handicrafts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {trendingProducts.concat(newArrivals).slice(0, 4).map((prod) => (
            <ProductCard
              key={`trend_grid_${prod.id}`}
              product={prod}
              onQuickView={setQuickViewProductId}
            />
          ))}
        </div>
      </section>

      {/* 5. Featured Products Showcase */}
      {categories.length > 0 && (
        <FeaturedCategories
          categories={categories}
          onQuickView={setQuickViewProductId}
        />
      )}

      {/* 6. Popular Verified Vendors */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>GSTIN Verified Partners</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-1">
            Popular Marketplace Vendors
          </h2>
          <p className="text-xs text-muted-custom mt-1 font-medium">
            Buy directly from compliance-verified manufacturers, farmers, and official distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredSellers.map((seller) => (
            <div key={seller.id} className="bg-card border border-border-custom rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center rounded-xl font-bold text-xs shrink-0">
                    {seller.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-foreground truncate">{seller.name}</h4>
                    <span className="text-[10px] text-muted-custom block truncate">{seller.location}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-custom mt-3 line-clamp-3 leading-relaxed font-normal">
                  {seller.description}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border-custom text-[10px] font-bold">
                <span className="text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  ★ {seller.rating} Rating
                </span>
                <span className="text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                  Since {seller.joinedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Why Choose JSS Marketplace */}
      <section className="bg-card border border-border-custom rounded-3xl p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
            <Award size={14} />
            <span>Marketplace Excellence</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Why Choose JSS Marketplace?
          </h2>
          <p className="text-xs text-muted-custom font-medium">
            India's most trusted direct-from-source multi-vendor platform for retail & wholesale buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 bg-background-secondary border border-border-custom rounded-2xl space-y-2 text-center">
            <div className="h-12 w-12 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-bold text-sm text-foreground">100% Genuine Guaranteed</h4>
            <p className="text-xs text-muted-custom leading-relaxed">
              Every item is inspected and dispatched directly from verified manufacturers and certified farmers.
            </p>
          </div>

          <div className="p-5 bg-background-secondary border border-border-custom rounded-2xl space-y-2 text-center">
            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Lock size={24} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Secure Escrow Payments</h4>
            <p className="text-xs text-muted-custom leading-relaxed">
              Your payments are safely held in escrow until your order is delivered and verified.
            </p>
          </div>

          <div className="p-5 bg-background-secondary border border-border-custom rounded-2xl space-y-2 text-center">
            <div className="h-12 w-12 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Truck size={24} />
            </div>
            <h4 className="font-bold text-sm text-foreground">Express All-India Delivery</h4>
            <p className="text-xs text-muted-custom leading-relaxed">
              Real-time shipment tracking with express dispatch across 25,000+ PIN codes in India.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="space-y-6 bg-background-secondary border border-border-custom p-8 rounded-3xl">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {translate('home.testimonials')}
          </h2>
          <p className="text-xs text-muted-custom max-w-xl mx-auto font-medium">
            Real feedback from shoppers, retail buyers, and agricultural partners across India.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {mockTestimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border-custom p-5 rounded-2xl shadow-xs flex flex-col justify-between space-y-3">
              <p className="text-xs text-muted-custom italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.userName} className="h-9 w-9 rounded-full object-cover border border-border-custom shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-foreground leading-none">{t.userName}</h4>
                  <span className="text-[10px] text-muted-custom mt-0.5 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Frequently Asked Questions */}
      <section id="faq" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start scroll-mt-24">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {translate('faq.title')}
          </h2>
          <p className="text-xs text-muted-custom leading-relaxed font-medium">
            Got questions about public orders, vendor onboarding, or delivery coverage?
          </p>
          <div className="p-4 bg-background-secondary border border-border-custom rounded-2xl text-xs text-muted-custom leading-relaxed">
            Need custom B2B wholesale pricing? Reach out to our helpline at 1800-JSS-MARKET.
          </div>
        </div>
        <div className="lg:col-span-2">
          <Accordion items={mockFaqs} />
        </div>
      </section>

      {quickViewProductId && (
        <ProductQuickView
          productId={quickViewProductId}
          onClose={() => setQuickViewProductId(null)}
        />
      )}

    </div>
  );
}

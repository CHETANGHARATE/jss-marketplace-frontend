'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Clock, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BannerSlider } from '../components/BannerSlider';
import { CategorySection } from '../components/CategorySection';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickView } from '../components/ProductQuickView';
import { PersonalizedSection } from '../components/PersonalizedSection';
import { Accordion } from '../components/ui/Accordion';
import { categoryService } from '../services/categoryService';
import { getTrendingProducts, getNewArrivals, getBestSellers } from '../services/product';
import { getFeaturedSellers } from '../services/seller';
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

        const trending = await getTrendingProducts(4);
        setTrendingProducts(trending);

        const fresh = await getNewArrivals(4);
        setNewArrivals(fresh);

        const topRated = await getBestSellers(4);
        setBestSellers(topRated);

        const sellers = await getFeaturedSellers(4);
        setFeaturedSellers(sellers);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-20">
      
      <BannerSlider />

      {categories.length > 0 && <CategorySection categories={categories} />}

      <PersonalizedSection />

      <section className="bg-gradient-to-r from-accent/10 to-orange-500/5 border border-accent/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent text-white flex items-center justify-center rounded-xl shadow-md">
              <Clock className="animate-spin-slow" size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                Today's Flash Deals
              </h2>
              <p className="text-xs text-muted-custom mt-0.5 font-medium">Limited time mega discounts. Ends in:</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-foreground font-black">
            <span className="bg-card border border-border-custom px-3.5 py-2 rounded-xl shadow-sm text-sm sm:text-base">
              {String(timeLeft.hours).padStart(2, '0')}h
            </span>
            <span className="text-accent font-black">:</span>
            <span className="bg-card border border-border-custom px-3.5 py-2 rounded-xl shadow-sm text-sm sm:text-base">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </span>
            <span className="text-accent font-black">:</span>
            <span className="bg-card border border-border-custom px-3.5 py-2 rounded-xl shadow-sm text-sm sm:text-base">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
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

      {categories.length > 0 && (
        <FeaturedCategories
          categories={categories}
          onQuickView={setQuickViewProductId}
        />
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-6 bg-card border border-border-custom p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border-custom">
            <Sparkles className="text-primary" size={18} />
            <h3 className="font-black text-lg text-foreground tracking-tight">Trending Now</h3>
          </div>
          <div className="divide-y divide-border-custom space-y-4">
            {trendingProducts.slice(0, 3).map((prod) => (
              <div 
                key={`trend_list_${prod.id}`} 
                onClick={() => setQuickViewProductId(prod.id)}
                className="flex gap-4 pt-4 first:pt-0 group cursor-pointer"
              >
                <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-xl object-cover bg-background-secondary border border-border-custom" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{prod.name}</h4>
                  <p className="text-[10px] text-muted-custom mt-0.5">{prod.brand}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-black text-sm text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-accent font-bold">({prod.discountPercent}% Off)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 bg-card border border-border-custom p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border-custom">
            <Clock className="text-accent" size={18} />
            <h3 className="font-black text-lg text-foreground tracking-tight">New Arrivals</h3>
          </div>
          <div className="divide-y divide-border-custom space-y-4">
            {newArrivals.slice(0, 3).map((prod) => (
              <div 
                key={`new_list_${prod.id}`} 
                onClick={() => setQuickViewProductId(prod.id)}
                className="flex gap-4 pt-4 first:pt-0 group cursor-pointer"
              >
                <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-xl object-cover bg-background-secondary border border-border-custom" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{prod.name}</h4>
                  <p className="text-[10px] text-muted-custom mt-0.5">{prod.brand}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-black text-sm text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded font-bold">Fresh</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 bg-card border border-border-custom p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-border-custom">
            <Star className="text-amber-500 fill-amber-500" size={18} />
            <h3 className="font-black text-lg text-foreground tracking-tight">Top Rated</h3>
          </div>
          <div className="divide-y divide-border-custom space-y-4">
            {bestSellers.slice(0, 3).map((prod) => (
              <div 
                key={`best_list_${prod.id}`} 
                onClick={() => setQuickViewProductId(prod.id)}
                className="flex gap-4 pt-4 first:pt-0 group cursor-pointer"
              >
                <img src={prod.image} alt={prod.name} className="h-16 w-16 rounded-xl object-cover bg-background-secondary border border-border-custom" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{prod.name}</h4>
                  <p className="text-[10px] text-muted-custom mt-0.5">{prod.brand}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-black text-sm text-primary">₹{prod.offerPrice.toLocaleString()}</span>
                    <div className="flex items-center text-amber-500 text-[10px] font-bold">
                      <Star size={10} fill="currentColor" />
                      <span className="ml-0.5">{prod.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Featured Verified Sellers
            </h2>
            <p className="text-sm text-muted-custom mt-2 font-medium">
              Buy directly from GSTIN compliance verified manufacturers, farmers, and distributors.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSellers.map((seller) => (
            <div key={seller.id} className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold text-sm">
                    {seller.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground leading-tight">{seller.name}</h4>
                    <span className="text-[10px] text-muted-custom mt-0.5 block">{seller.location}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-custom mt-3 line-clamp-3 leading-relaxed">
                  {seller.description}
                </p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border-custom mt-2 text-[10px] font-bold">
                <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  ★ {seller.rating} Rating
                </span>
                <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Since {seller.joinedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 bg-background-secondary border border-border-custom p-8 rounded-3xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {translate('home.testimonials')}
          </h2>
          <p className="text-sm text-muted-custom max-w-xl mx-auto font-medium">
            Hear from retail customers, verified builders, and farming partners.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {mockTestimonials.map((t) => (
            <div key={t.id} className="bg-card border border-border-custom p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
              <p className="text-sm text-muted-custom italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.userName} className="h-10 w-10 rounded-full object-cover border border-border-custom" />
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-none">{t.userName}</h4>
                  <span className="text-[10px] text-muted-custom mt-1 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start scroll-mt-24">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            {translate('faq.title')}
          </h2>
          <p className="text-sm text-muted-custom leading-relaxed font-medium">
            Have questions about order safety, shipping parameters, seller policies, or registrations? Find answers here.
          </p>
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl text-xs text-muted-custom leading-relaxed">
            Need custom B2B bulk rates? Feel free to contact our round-the-clock helpdesk support directly in the footer.
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

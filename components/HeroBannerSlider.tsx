'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Truck,
  RefreshCw,
  Sparkles,
  BadgeCheck,
  Sprout,
  Shirt,
  Tv,
  Home,
  Tractor,
  ArrowRight,
  Rocket,
  Package,
} from 'lucide-react';

export interface FloatingCallout {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface HeroSlideData {
  id: string;
  categoryTitle: string;
  categoryIcon: React.ReactNode;
  badgeText: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaPrimaryLink: string;
  ctaSecondary: string;
  ctaSecondaryLink: string;
  ctaSecondaryStyle?: 'emerald' | 'blue' | 'neutral';
  bgGradient: string;
  accentColor: string;
  isFirstSlide?: boolean;
  heroImage?: string;
  floatingCallouts: FloatingCallout[];
}

export const HERO_SLIDES: HeroSlideData[] = [
  // ─── SLIDE 1: PRIMARY DESIGN TARGET (Matching Reference Image) ───
  {
    id: 'slide_main_marketplace',
    categoryTitle: 'All Categories',
    categoryIcon: <ShoppingCart size={14} />,
    badgeText: "India's Most Trusted Marketplace",
    titleLine1: 'Shop Quality Products',
    titleLine2: 'From Verified Sellers',
    subtitle: 'Explore 10,000+ products across multiple categories.',
    description: 'Best Quality • Best Price • 100% Trust',
    ctaPrimary: 'Shop Now',
    ctaPrimaryLink: '/search',
    ctaSecondary: 'Become a Seller',
    ctaSecondaryLink: '/seller/register',
    ctaSecondaryStyle: 'emerald',
    bgGradient: 'linear-gradient(120deg, #F0F6FF 0%, #E9F4FF 45%, #E6FAF4 100%)',
    accentColor: '#1565D8',
    isFirstSlide: true,
    heroImage: '/hero/hero-cart-visual.png',
    floatingCallouts: [
      {
        icon: <Sprout size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Agriculture',
        subtitle: 'Fresh & Organic',
        href: '/category/agriculture-seeds',
      },
      {
        icon: <Shirt size={16} className="text-pink-600" />,
        iconBg: 'bg-pink-100',
        title: 'Fashion',
        subtitle: 'Style for You',
        href: '/category/fashion',
      },
      {
        icon: <Tv size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Electronics',
        subtitle: 'Latest & Smart',
        href: '/category/electronics',
      },
      {
        icon: <Home size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Home & Kitchen',
        subtitle: 'Everything Home',
        href: '/category/home-kitchen',
      },
    ],
  },

  // ─── SLIDE 2: HOME & KITCHEN APPLIANCES ───
  {
    id: 'slide_home_kitchen',
    categoryTitle: 'Home & Kitchen',
    categoryIcon: <Home size={14} />,
    badgeText: '🏠 Kitchen Festival Sale — Up to 50% OFF',
    titleLine1: 'Modern Home &',
    titleLine2: 'Kitchen Appliances',
    subtitle: 'High Speed Juicers • Brass Utensils • Solar Appliances',
    description: 'Upgrade your culinary space with food processors, copper cookware, and energy-efficient appliances at factory prices.',
    ctaPrimary: 'Shop Kitchenware',
    ctaPrimaryLink: '/category/home-kitchen',
    ctaSecondary: 'View Appliances',
    ctaSecondaryLink: '/category/home-kitchen',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #FFFBEB 0%, #FEF3C7 45%, #F0F6FF 100%)',
    accentColor: '#D97706',
    heroImage: '/promo/kitchen.png',
    floatingCallouts: [
      {
        icon: <Package size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Brass Cookware',
        subtitle: 'Traditional & Pure',
        href: '/category/home-kitchen',
      },
      {
        icon: <Zap size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Solar Appliances',
        subtitle: 'Energy Saver',
        href: '/category/home-kitchen',
      },
      {
        icon: <RefreshCw size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'High Speed Juicers',
        subtitle: 'Cold-Press Tech',
        href: '/category/home-kitchen',
      },
      {
        icon: <Home size={16} className="text-purple-600" />,
        iconBg: 'bg-purple-100',
        title: 'Modular Storage',
        subtitle: 'Kitchen Organizers',
        href: '/category/home-kitchen',
      },
    ],
  },

  // ─── SLIDE 3: BEAUTY & PERSONAL CARE ───
  {
    id: 'slide_beauty_care',
    categoryTitle: 'Beauty & Skincare',
    categoryIcon: <Sparkles size={14} />,
    badgeText: '💄 Organic Glow Collection — 40% OFF',
    titleLine1: 'Organic Beauty &',
    titleLine2: 'Personal Care',
    subtitle: 'Ayurvedic Serums • Herbal Shampoos • Makeup Kits',
    description: 'Transform your daily routine with toxin-free botanical serums, cold-pressed oils, and branded cosmetic hampers.',
    ctaPrimary: 'Explore Beauty',
    ctaPrimaryLink: '/category/beauty-personal-care',
    ctaSecondary: 'View Cosmetics',
    ctaSecondaryLink: '/category/beauty-personal-care',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #FDF2F8 0%, #FCE7F3 45%, #F0FDF4 100%)',
    accentColor: '#E11D48',
    heroImage: '/promo/beauty.png',
    floatingCallouts: [
      {
        icon: <Sparkles size={16} className="text-pink-600" />,
        iconBg: 'bg-pink-100',
        title: 'Herbal Serums',
        subtitle: '100% Botanical',
        href: '/category/beauty-personal-care',
      },
      {
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Derma Tested',
        subtitle: 'Safe & Certified',
        href: '/category/beauty-personal-care',
      },
      {
        icon: <Sparkles size={16} className="text-purple-600" />,
        iconBg: 'bg-purple-100',
        title: 'Cosmetic Kits',
        subtitle: 'Bridal & Festive',
        href: '/category/beauty-personal-care',
      },
      {
        icon: <RefreshCw size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Pure Aloe Vera',
        subtitle: 'Cold-Pressed Gels',
        href: '/category/beauty-personal-care',
      },
    ],
  },

  // ─── SLIDE 4: AGRICULTURE & FARMING SOLUTIONS ───
  {
    id: 'slide_agriculture',
    categoryTitle: 'Agriculture & Seeds',
    categoryIcon: <Tractor size={14} />,
    badgeText: '🌾 Empowering Indian Farmers — Direct Factory Price',
    titleLine1: 'Bio Fertilizers &',
    titleLine2: 'High Yield Seeds',
    subtitle: 'Certified Hybrid Seeds • Drip Kits • Bio Pesticides',
    description: 'Government-certified hybrid seeds, organic bio-fertilizers, and micro-drip irrigation kits delivered to your village doorstep.',
    ctaPrimary: 'Shop Agri Tools',
    ctaPrimaryLink: '/category/agriculture-seeds',
    ctaSecondary: 'Seeds & Fertilizers',
    ctaSecondaryLink: '/category/agriculture-seeds',
    ctaSecondaryStyle: 'emerald',
    bgGradient: 'linear-gradient(120deg, #F0FDF4 0%, #DCFCE7 45%, #E0F2FE 100%)',
    accentColor: '#059669',
    heroImage: '/promo/agriculture.png',
    floatingCallouts: [
      {
        icon: <Sprout size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Certified Seeds',
        subtitle: 'Lab Tested 98%',
        href: '/category/agriculture-seeds',
      },
      {
        icon: <Truck size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Village Delivery',
        subtitle: 'Direct Logistics',
        href: '/category/agriculture-seeds',
      },
      {
        icon: <Zap size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Kisan Bulk Rates',
        subtitle: 'Wholesale Savings',
        href: '/category/agriculture-seeds',
      },
      {
        icon: <Package size={16} className="text-teal-600" />,
        iconBg: 'bg-teal-100',
        title: 'Bio Fertilizers',
        subtitle: 'Organic Compost',
        href: '/category/agriculture-seeds',
      },
    ],
  },

  // ─── SLIDE 5: ELECTRONICS & SMART GADGETS ───
  {
    id: 'slide_electronics',
    categoryTitle: 'Electronics & Smart',
    categoryIcon: <Tv size={14} />,
    badgeText: '⚡ Mega Tech Sale — Up to 70% OFF',
    titleLine1: 'Smart Gadgets &',
    titleLine2: 'Auto Electronics',
    subtitle: 'Smartwatches • Wireless Audio • Dashcams & Power Banks',
    description: 'Experience cutting-edge technology with active noise-canceling headphones, Bluetooth party speakers, and power banks.',
    ctaPrimary: 'Shop Electronics',
    ctaPrimaryLink: '/category/electronics',
    ctaSecondary: 'View Auto Gear',
    ctaSecondaryLink: '/category/electronics',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #EEF2FF 0%, #E0E7FF 45%, #ECFDF5 100%)',
    accentColor: '#4F46E5',
    heroImage: '/promo/electronics.png',
    floatingCallouts: [
      {
        icon: <Tv size={16} className="text-indigo-600" />,
        iconBg: 'bg-indigo-100',
        title: 'Wireless Audio',
        subtitle: 'ANC & Bass Boost',
        href: '/category/electronics',
      },
      {
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Brand Warranty',
        subtitle: '1 Year Authorized',
        href: '/category/electronics',
      },
      {
        icon: <Zap size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Smart Gadgets',
        subtitle: 'Fast Charging',
        href: '/category/electronics',
      },
      {
        icon: <Package size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Car Electronics',
        subtitle: 'Dashcams & Audio',
        href: '/category/electronics',
      },
    ],
  },

  // ─── SLIDE 6: FASHION & LIFESTYLE ───
  {
    id: 'slide_fashion',
    categoryTitle: 'Fashion & Handloom',
    categoryIcon: <Shirt size={14} />,
    badgeText: '👗 Handcrafted Weaver Art — 65% OFF',
    titleLine1: 'Handloom Sarees &',
    titleLine2: 'Ethnic Fashion',
    subtitle: 'Pure Silk Sarees • Designer Kurtis • Kolhapuri Footwear',
    description: 'Discover exquisite handwoven sarees, breathable organic cotton kurtas, festive dupattas, and handcrafted juttis.',
    ctaPrimary: 'Explore Fashion',
    ctaPrimaryLink: '/category/fashion',
    ctaSecondary: 'View Ethnic Wear',
    ctaSecondaryLink: '/category/fashion',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #FAF5FF 0%, #F3E8FF 45%, #FEF3C7 100%)',
    accentColor: '#9333EA',
    heroImage: '/promo/fashion.png',
    floatingCallouts: [
      {
        icon: <Shirt size={16} className="text-purple-600" />,
        iconBg: 'bg-purple-100',
        title: 'Pure Silk Sarees',
        subtitle: 'Authentic Weave',
        href: '/category/fashion',
      },
      {
        icon: <Sparkles size={16} className="text-pink-600" />,
        iconBg: 'bg-pink-100',
        title: 'Designer Kurtis',
        subtitle: 'Festive Ready',
        href: '/category/fashion',
      },
      {
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Handmade Juttis',
        subtitle: 'Pure Leather',
        href: '/category/fashion',
      },
      {
        icon: <Package size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Artisan Dupattas',
        subtitle: 'Hand-Dyed Cotton',
        href: '/category/fashion',
      },
    ],
  },
];

export const HeroBannerSlider: React.FC = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION = 6000;

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating || idx === current) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, current]
  );

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => next(), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Mobile Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    setTouchStartX(null);
  };

  const slide = HERO_SLIDES[current];

  return (
    <div
      className="w-full relative rounded-3xl lg:rounded-[32px] overflow-hidden border border-slate-200/80 shadow-md transition-all duration-300 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ─── 1. TOP CATEGORY PILL SELECTOR STRIP ─── */}
      <div className="w-full bg-slate-50/90 border-b border-slate-200/70 px-4 sm:px-6 py-2 flex items-center justify-between gap-2 z-20 relative">
        <div
          ref={navContainerRef}
          className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1.5 scroll-smooth"
        >
          {HERO_SLIDES.map((s, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={s.id}
                onClick={() => goTo(idx)}
                style={
                  isActive
                    ? {
                        backgroundColor: s.accentColor,
                        color: '#ffffff',
                        boxShadow: `0 3px 12px ${s.accentColor}35`,
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200/60'
                }`}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ color: isActive ? '#ffffff' : s.accentColor }}
                >
                  {s.categoryIcon}
                </span>
                <span className="whitespace-nowrap">{s.categoryTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. MAIN HERO BANNER STAGE ─── */}
      <div
        className="relative min-h-[460px] sm:min-h-[500px] md:min-h-[520px] lg:min-h-[540px] flex items-center px-6 sm:px-12 md:px-14 lg:px-16 py-8 sm:py-10 lg:py-12 overflow-hidden transition-all duration-500"
        style={{ background: slide.bgGradient }}
      >
        {/* Soft Background Circular Glows & Decorative Grid */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Decorative Pattern Dots */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#1565D8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* ─── 3-Zone Hero Desktop Layout (Text Area 48% | Cart Visual 30% | Category Cards 22%) ─── */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* ── LEFT COLUMN: Text, CTAs, Benefit Cards (5 to 6 cols) ── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 text-left animate-in fade-in slide-in-from-left-3 duration-300">
            
            {/* Top Pill Badge */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1565D8] text-white text-[11px] sm:text-xs font-black shadow-xs tracking-wide">
                <Sparkles size={13} className="text-amber-300 fill-amber-300" />
                <span>{slide.badgeText}</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                {slide.titleLine1}
              </h1>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.12]"
                style={{ color: slide.isFirstSlide ? '#1565D8' : slide.accentColor }}
              >
                {slide.titleLine2}
              </h2>
            </div>

            {/* Subtitle & Keywords */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                {slide.subtitle}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                {slide.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              {/* Primary CTA (Shop Now - Royal Blue #1565D8) */}
              <button
                type="button"
                onClick={() => router.push(slide.ctaPrimaryLink)}
                className="px-7 sm:px-8 py-3.5 bg-[#1565D8] hover:bg-[#0D47A1] active:bg-[#0A3880] text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <ShoppingCart size={17} className="transition-transform group-hover:scale-110" />
                <span>{slide.ctaPrimary}</span>
              </button>

              {/* Secondary CTA (Become a Seller / Deals) */}
              <button
                type="button"
                onClick={() => router.push(slide.ctaSecondaryLink)}
                className={`px-6 sm:px-7 py-3.5 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  slide.ctaSecondaryStyle === 'emerald'
                    ? 'bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-500/80 hover:border-emerald-600'
                    : 'bg-white hover:bg-blue-50 text-[#1565D8] border-2 border-[#1565D8]/80 hover:border-[#1565D8]'
                }`}
              >
                {slide.ctaSecondaryStyle === 'emerald' ? (
                  <Rocket size={16} className="text-emerald-600" />
                ) : (
                  <ArrowRight size={16} />
                )}
                <span>{slide.ctaSecondary}</span>
              </button>
            </div>

            {/* ── Bottom Benefit Cards Strip (4 Compact Cards) ── */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {/* Benefit 1 */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl shadow-xs flex items-center gap-2.5 group hover:border-blue-400/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Truck size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">Free Shipping</h4>
                  <p className="text-[9px] font-bold text-slate-500 truncate leading-tight">Above ₹499</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl shadow-xs flex items-center gap-2.5 group hover:border-blue-400/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">Secure Payment</h4>
                  <p className="text-[9px] font-bold text-slate-500 truncate leading-tight">100% Protected</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl shadow-xs flex items-center gap-2.5 group hover:border-blue-400/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <BadgeCheck size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">Verified Sellers</h4>
                  <p className="text-[9px] font-bold text-slate-500 truncate leading-tight">GST Certified</p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-2.5 sm:p-3 rounded-2xl shadow-xs flex items-center gap-2.5 group hover:border-blue-400/50 transition-all">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <RefreshCw size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">Easy Returns</h4>
                  <p className="text-[9px] font-bold text-slate-500 truncate leading-tight">Hassle Free</p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT VISUAL AREA (6 to 7 cols): Divided into Focal Illustration + Reserved Category Column ── */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-6 min-h-[340px] sm:min-h-[380px] lg:min-h-[440px] w-full">
            
            {/* 1. Center Focal Illustration (Cart / Product Visual) — Completely Separate Safe Zone */}
            <div className="flex-1 flex items-center justify-center w-full min-w-0 pr-0 sm:pr-2">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[370px] xl:max-w-[410px] aspect-square flex items-center justify-center">
                {slide.heroImage ? (
                  <img
                    src={slide.heroImage}
                    alt={slide.titleLine1}
                    className="w-full h-full object-contain filter drop-shadow-lg select-none transition-transform duration-500 hover:scale-[1.02]"
                    loading="eager"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center">
                    <ShoppingCart size={70} className="text-[#1565D8]" />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Dedicated Category Callouts Column (Desktop & Tablet Vertical Stack — Reserved Space) */}
            {slide.floatingCallouts && slide.floatingCallouts.length > 0 && (
              <div className="hidden sm:flex flex-col justify-center gap-2.5 lg:gap-3 w-44 sm:w-48 lg:w-52 shrink-0 z-10">
                {slide.floatingCallouts.map((callout, i) => (
                  <Link
                    key={i}
                    href={callout.href}
                    className="bg-white/95 backdrop-blur-md border border-slate-200/80 hover:border-blue-500/60 p-2.5 sm:p-3 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 hover:scale-[1.03] flex items-center gap-2.5 cursor-pointer w-full group"
                  >
                    <div className={`w-8 h-8 rounded-xl ${callout.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                      {callout.icon}
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <h5 className="text-xs font-black text-slate-900 leading-tight truncate">{callout.title}</h5>
                      <p className="text-[10px] font-bold text-slate-500 leading-tight truncate">{callout.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>

          {/* ── Mobile-Only Category Callouts (Clean 2-Col Grid rendered underneath on small mobile screens) ── */}
          {slide.floatingCallouts && slide.floatingCallouts.length > 0 && (
            <div className="sm:hidden grid grid-cols-2 gap-2 w-full pt-2 z-10">
              {slide.floatingCallouts.map((callout, i) => (
                <Link
                  key={i}
                  href={callout.href}
                  className="bg-white/95 backdrop-blur-md border border-slate-200/80 p-2 rounded-xl shadow-2xs flex items-center gap-2"
                >
                  <div className={`w-7 h-7 rounded-lg ${callout.iconBg} flex items-center justify-center shrink-0`}>
                    {callout.icon}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h5 className="text-[11px] font-black text-slate-900 leading-tight truncate">{callout.title}</h5>
                    <p className="text-[9px] font-bold text-slate-500 leading-tight truncate">{callout.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>

        {/* ─── Navigation Controls (Previous & Next Arrows Outside Main Visual Zone) ─── */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#1565D8] shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#1565D8] shadow-md hover:shadow-lg border border-slate-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* ─── Slide Indicator Dots (Bottom Centered) ─── */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={i === current ? { backgroundColor: s.accentColor } : undefined}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current
                  ? 'w-6 h-2 shadow-xs'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

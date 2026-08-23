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
  Flame,
  HeartHandshake,
  BadgePercent,
  Tag,
  Gift,
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
  // ─── SLIDE 1: EXPLORE MARKETPLACE (Main Shopping Cart Visual) ───
  {
    id: 'slide_main_marketplace',
    categoryTitle: 'Explore Marketplace',
    categoryIcon: <ShoppingCart size={15} />,
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

  // ─── SLIDE 2: NEW ARRIVALS (New Releases & Trending Gadgets) ───
  {
    id: 'slide_new_arrival',
    categoryTitle: 'New Arrival',
    categoryIcon: <Flame size={15} />,
    badgeText: '✨ Fresh Drops — 500+ New Arrivals Daily',
    titleLine1: 'Discover Trending &',
    titleLine2: 'Fresh New Arrivals',
    subtitle: 'Smart Electronics • Festive Fashion • Organic Harvest',
    description: 'Explore the latest trending products launched directly by verified brands, innovators, and artisan weavers across India.',
    ctaPrimary: 'Explore New In',
    ctaPrimaryLink: '/search?sort=newest',
    ctaSecondary: 'View Top Trending',
    ctaSecondaryLink: '/search',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #F0F9FF 0%, #E0F2FE 45%, #F0FDF4 100%)',
    accentColor: '#0284C7',
    heroImage: '/promo/electronics.png',
    floatingCallouts: [
      {
        icon: <Sparkles size={16} className="text-sky-600" />,
        iconBg: 'bg-sky-100',
        title: 'Smart Audio',
        subtitle: 'ANC Wireless',
        href: '/category/electronics',
      },
      {
        icon: <Shirt size={16} className="text-pink-600" />,
        iconBg: 'bg-pink-100',
        title: 'Festive Wear',
        subtitle: 'Silk & Cotton',
        href: '/category/fashion',
      },
      {
        icon: <Sprout size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Cold-Pressed',
        subtitle: 'Wood Pressed Oils',
        href: '/category/agriculture-seeds',
      },
      {
        icon: <Package size={16} className="text-purple-600" />,
        iconBg: 'bg-purple-100',
        title: 'Kitchen Tech',
        subtitle: 'Smart Blenders',
        href: '/category/home-kitchen',
      },
    ],
  },

  // ─── SLIDE 3: LOCAL AND HANDMADE (Artisans & Handicrafts) ───
  {
    id: 'slide_local_handmade',
    categoryTitle: 'Local and Handmade',
    categoryIcon: <HeartHandshake size={15} />,
    badgeText: '🇮🇳 100% Made in India — Direct from Rural Artisans',
    titleLine1: 'Authentic Indian Crafts &',
    titleLine2: 'Handmade Treasures',
    subtitle: 'Terracotta Pottery • Brass Art • Kolhapuri Leather • Organic Snacks',
    description: 'Support local MSMEs, self-help groups, and traditional craftsmen by buying authentic, handcrafted heritage goods straight from the creators.',
    ctaPrimary: 'Shop Handmade',
    ctaPrimaryLink: '/search?filter=handmade',
    ctaSecondary: 'Meet Our Artisans',
    ctaSecondaryLink: '/about',
    ctaSecondaryStyle: 'emerald',
    bgGradient: 'linear-gradient(120deg, #FFFBEB 0%, #FEF3C7 45%, #F0FDFA 100%)',
    accentColor: '#0D9488',
    heroImage: '/promo/jewellery.png',
    floatingCallouts: [
      {
        icon: <Package size={16} className="text-teal-600" />,
        iconBg: 'bg-teal-100',
        title: 'Handcrafted Art',
        subtitle: 'Brass & Copper',
        href: '/search',
      },
      {
        icon: <Shirt size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Handloom Khadi',
        subtitle: 'Pure Organic',
        href: '/category/fashion',
      },
      {
        icon: <Sparkles size={16} className="text-rose-600" />,
        iconBg: 'bg-rose-100',
        title: 'Temple Jewellery',
        subtitle: 'Hand-Crafted',
        href: '/search',
      },
      {
        icon: <Sprout size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Village Faral',
        subtitle: 'Homemade Sweets',
        href: '/search',
      },
    ],
  },

  // ─── SLIDE 4: OFFER ZONE (Mega Clearance & Flash Discounts) ───
  {
    id: 'slide_offer_zone',
    categoryTitle: 'Offer Zone',
    categoryIcon: <BadgePercent size={15} />,
    badgeText: '🔥 Mega Savings Festival — Up to 80% OFF',
    titleLine1: 'Super Saver Dhamaka &',
    titleLine2: 'Exclusive Flash Deals',
    subtitle: 'Buy 1 Get 1 Free • Factory Direct Combos • Minimum 50% Off',
    description: 'Grab unbelievable wholesale discounts, clearance bundles, and limited-time lightning deals with verified quality guarantee.',
    ctaPrimary: 'Explore Offer Zone',
    ctaPrimaryLink: '/promotions',
    ctaSecondary: 'Daily Deals',
    ctaSecondaryLink: '/search?discount=50',
    ctaSecondaryStyle: 'blue',
    bgGradient: 'linear-gradient(120deg, #FEF2F2 0%, #FEE2E2 45%, #FFF7ED 100%)',
    accentColor: '#DC2626',
    heroImage: '/promo/festival.png',
    floatingCallouts: [
      {
        icon: <BadgePercent size={16} className="text-rose-600" />,
        iconBg: 'bg-rose-100',
        title: 'Flash 70% Off',
        subtitle: 'Limited Stock',
        href: '/promotions',
      },
      {
        icon: <Zap size={16} className="text-amber-600" />,
        iconBg: 'bg-amber-100',
        title: 'Buy 1 Get 1',
        subtitle: 'Combo Bundles',
        href: '/promotions',
      },
      {
        icon: <Truck size={16} className="text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Free Delivery',
        subtitle: 'On Orders ₹499+',
        href: '/promotions',
      },
      {
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
        iconBg: 'bg-emerald-100',
        title: 'Verified Deals',
        subtitle: '100% Authentic',
        href: '/promotions',
      },
    ],
  },

  // ─── SLIDE 5: HOME & KITCHEN APPLIANCES ───
  {
    id: 'slide_home_kitchen',
    categoryTitle: 'Home & Kitchen',
    categoryIcon: <Home size={15} />,
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

  // ─── SLIDE 6: BEAUTY & PERSONAL CARE ───
  {
    id: 'slide_beauty_care',
    categoryTitle: 'Beauty & Skincare',
    categoryIcon: <Sparkles size={15} />,
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

  // ─── SLIDE 7: AGRICULTURE & FARMING SOLUTIONS ───
  {
    id: 'slide_agriculture',
    categoryTitle: 'Agriculture & Seeds',
    categoryIcon: <Tractor size={15} />,
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

  // ─── SLIDE 8: ELECTRONICS & SMART GADGETS ───
  {
    id: 'slide_electronics',
    categoryTitle: 'Electronics & Smart',
    categoryIcon: <Tv size={15} />,
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

  // ─── SLIDE 9: FASHION & LIFESTYLE ───
  {
    id: 'slide_fashion',
    categoryTitle: 'Fashion & Handloom',
    categoryIcon: <Shirt size={15} />,
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
      {/* ─── 1. TOP CATEGORY PILL SELECTOR STRIP (Enlarged font + dynamic colors) ─── */}
      <div className="w-full bg-slate-50/90 border-b border-slate-200/70 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 z-20 relative">
        <div
          ref={navContainerRef}
          className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-2 sm:gap-2.5 scroll-smooth"
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
                        boxShadow: `0 4px 14px ${s.accentColor}35`,
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-[13px] sm:text-sm font-extrabold transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/70 shadow-2xs'
                }`}
              >
                <span
                  className="shrink-0 transition-colors"
                  style={{ color: isActive ? '#ffffff' : s.accentColor }}
                >
                  {s.categoryIcon}
                </span>
                <span className="whitespace-nowrap tracking-tight">{s.categoryTitle}</span>
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
            backgroundImage: `radial-gradient(${slide.accentColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* ── Content Grid: Left Text Column + Right Visual/Cards Zone ── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* ═══════════════════════════════════════════════════════════
              LEFT HERO TEXT CONTENT
              ═══════════════════════════════════════════════════════════ */}
          <div
            className={`lg:col-span-6 xl:col-span-6 space-y-4 sm:space-y-5 text-left transition-all duration-400 ${
              isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* 1. Top Mini Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
              <span
                className="w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: slide.accentColor }}
              />
              <span
                className="text-[11px] sm:text-xs font-black tracking-wide"
                style={{ color: slide.accentColor }}
              >
                {slide.badgeText}
              </span>
            </div>

            {/* 2. Bold Two-Line Main Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-black text-slate-900 leading-[1.08] tracking-tight">
                {slide.titleLine1}
              </h1>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-black leading-[1.08] tracking-tight"
                style={{ color: slide.accentColor }}
              >
                {slide.titleLine2}
              </h2>
            </div>

            {/* 3. Subtitle & Description */}
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-bold text-slate-700 leading-snug">
                {slide.subtitle}
              </p>
              <p className="text-xs sm:text-[13px] font-medium text-slate-500 leading-relaxed">
                {slide.description}
              </p>
            </div>

            {/* 4. Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => router.push(slide.ctaPrimaryLink)}
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-black text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: slide.accentColor,
                  boxShadow: `0 10px 25px -5px ${slide.accentColor}55`,
                }}
              >
                <ShoppingCart size={18} className="shrink-0" />
                <span>{slide.ctaPrimary}</span>
              </button>

              {/* Secondary Action Button */}
              <button
                type="button"
                onClick={() => router.push(slide.ctaSecondaryLink)}
                className={`inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-black transition-all duration-200 hover:scale-105 active:scale-95 border bg-white shadow-xs cursor-pointer ${
                  slide.ctaSecondaryStyle === 'emerald'
                    ? 'border-emerald-500/30 text-emerald-700 hover:bg-emerald-50/60'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Rocket size={17} className={slide.ctaSecondaryStyle === 'emerald' ? 'text-emerald-600' : 'text-slate-600'} />
                <span>{slide.ctaSecondary}</span>
              </button>
            </div>

            {/* 5. Four Key Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 sm:pt-4">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 px-2.5 py-1.5 rounded-xl shadow-2xs">
                <Truck size={14} className="text-emerald-600 shrink-0" />
                <div className="text-[10px] sm:text-[11px] leading-tight">
                  <div className="font-extrabold text-slate-800">Free Shipping</div>
                  <div className="text-slate-400 font-medium">Above ₹499</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 px-2.5 py-1.5 rounded-xl shadow-2xs">
                <ShieldCheck size={14} className="text-amber-600 shrink-0" />
                <div className="text-[10px] sm:text-[11px] leading-tight">
                  <div className="font-extrabold text-slate-800">Secure Escrow</div>
                  <div className="text-slate-400 font-medium">100% Protection</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 px-2.5 py-1.5 rounded-xl shadow-2xs">
                <BadgeCheck size={14} className="text-blue-600 shrink-0" />
                <div className="text-[10px] sm:text-[11px] leading-tight">
                  <div className="font-extrabold text-slate-800">Verified Sellers</div>
                  <div className="text-slate-400 font-medium">GST Certified</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 px-2.5 py-1.5 rounded-xl shadow-2xs">
                <RefreshCw size={14} className="text-pink-600 shrink-0" />
                <div className="text-[10px] sm:text-[11px] leading-tight">
                  <div className="font-extrabold text-slate-800">Easy Returns</div>
                  <div className="text-slate-400 font-medium">Hassle Free</div>
                </div>
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT HERO VISUAL ZONE
              ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px]">
            
            {/* Left Spatial Zone: Product Cut-Out Asset */}
            <div className="w-full flex items-center justify-center lg:justify-start lg:pr-[190px] xl:lg:pr-[210px] z-10">
              <div
                className={`relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] transition-all duration-500 ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {slide.heroImage ? (
                  <img
                    src={slide.heroImage}
                    alt={slide.titleLine1}
                    className="w-full h-auto max-h-[290px] sm:max-h-[340px] lg:max-h-[400px] object-contain drop-shadow-xl select-none pointer-events-none mx-auto lg:mx-0 filter"
                    loading="eager"
                  />
                ) : (
                  <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-white/60 border border-slate-200/60 shadow-lg flex items-center justify-center">
                    <ShoppingCart size={80} style={{ color: slide.accentColor }} />
                  </div>
                )}
              </div>
            </div>

            {/* Right Spatial Zone: 4 Floating Category Callout Cards */}
            <div className="hidden sm:flex flex-col gap-2.5 z-20 absolute right-0 top-1/2 -translate-y-1/2 w-[180px] xl:w-[195px]">
              {slide.floatingCallouts.map((callout, cIdx) => (
                <Link
                  key={cIdx}
                  href={callout.href}
                  className={`flex items-center gap-3 bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer ${
                    isAnimating ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'
                  }`}
                  style={{
                    transitionDelay: `${cIdx * 60}ms`,
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${callout.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform`}
                  >
                    {callout.icon}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-black text-slate-800 truncate group-hover:text-[#1565D8] transition-colors">
                      {callout.title}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 truncate">
                      {callout.subtitle}
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-slate-300 group-hover:text-[#1565D8] group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>

          </div>

        </div>

        {/* ─── Navigation Controls (Previous & Next Arrows) ─── */}
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

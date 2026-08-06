'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Zap,
  RefreshCw,
  Umbrella,
  Home,
  Sparkles,
  Sprout,
  Tv,
  Shirt,
  Flame,
  Gem,
  Tractor
} from 'lucide-react';

export interface CategoryHeroSlide {
  id: string;
  categoryTitle: string;
  categoryIcon: React.ReactNode;
  tag: string;
  title: string;
  accentTitle: string;
  subtitle: string;
  description: string;
  discountPercent: string;
  offerBadge: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaLink: string;
  bgFrom: string;
  bgTo: string;
  accentColor: string;
  bgImage: string;
  foregroundImages: string[];
  trustBadges: { icon: React.ReactNode; text: string }[];
}

export const categoryHeroSlides: CategoryHeroSlide[] = [
  {
    id: 'rain_essentials',
    categoryTitle: 'Rain Essentials',
    categoryIcon: <Umbrella size={17} className="text-white" />,
    tag: '🌧️ MONSOON EXCLUSIVE',
    title: 'Monsoon Rain',
    accentTitle: 'Essentials 60% OFF',
    subtitle: 'Heavy Duty Umbrellas • Raincoats • Waterproof Boots',
    description: 'Protect yourself this monsoon with premium wind-resistant umbrellas, double-layered raincoats, and non-slip waterproof footwear directly from verified Indian manufacturers.',
    discountPercent: '60%',
    offerBadge: 'MONSOON SPECIAL',
    ctaPrimary: 'Shop Rain Gear',
    ctaSecondary: 'Explore All Deals',
    ctaLink: '/search?tag=monsoon',
    bgFrom: '#091830',
    bgTo: '#0b264a',
    accentColor: '#38bdf8',
    bgImage: '/hero-monsoon.jpg',
    foregroundImages: ['/categories/footwear.webp', '/categories/auto.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '100% Waterproof Guarantee' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Same Day Dispatch' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: '10-Day Easy Replacement' }
    ]
  },
  {
    id: 'home_kitchen',
    categoryTitle: 'Home & Kitchen',
    categoryIcon: <Home size={17} className="text-white" />,
    tag: '🏠 HOME & KITCHEN FESTIVAL',
    title: 'Modern Home &',
    accentTitle: 'Kitchen Appliances',
    subtitle: 'High Speed Juicers • Brass Utensils • Solar Appliances',
    description: 'Upgrade your culinary space with stone-ground mixers, food processors, copper cookware sets, and energy-efficient solar appliances at direct-from-factory prices.',
    discountPercent: '50%',
    offerBadge: 'KITCHEN SALE',
    ctaPrimary: 'Shop Kitchenware',
    ctaSecondary: 'View Appliances',
    ctaLink: '/category/home-kitchen',
    bgFrom: '#1c1305',
    bgTo: '#332005',
    accentColor: '#f59e0b',
    bgImage: '/categories/kitchen.webp',
    foregroundImages: ['/categories/juices.webp', '/categories/kitchen.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '1 Year Brand Warranty' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Free Express Shipping' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'GST Invoice Available' }
    ]
  },
  {
    id: 'beauty_care',
    categoryTitle: 'Beauty & Personal Care',
    categoryIcon: <Sparkles size={17} className="text-white" />,
    tag: '💄 BEAUTY & SKINCARE',
    title: 'Organic Beauty &',
    accentTitle: 'Personal Care',
    subtitle: 'Ayurvedic Serums • Herbal Shampoos • Makeup Kits',
    description: 'Transform your daily routine with toxin-free botanical serums, cold-pressed oils, pure aloe vera gels, and branded cosmetic hampers for glowing health.',
    discountPercent: '40%',
    offerBadge: 'GLOW DEALS',
    ctaPrimary: 'Explore Beauty',
    ctaSecondary: 'View Cosmetics',
    ctaLink: '/category/beauty-personal-care',
    bgFrom: '#240a14',
    bgTo: '#3f1124',
    accentColor: '#f43f5e',
    bgImage: '/categories/beauty.webp',
    foregroundImages: ['/categories/cosmetics.webp', '/categories/beauty.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: 'Dermatologically Tested' },
      { icon: <Zap size={14} className="text-amber-400" />, text: '100% Organic & Chemical-Free' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Direct Manufacturer Supply' }
    ]
  },
  {
    id: 'agriculture',
    categoryTitle: 'Agriculture & Seeds',
    categoryIcon: <Tractor size={17} className="text-white" />,
    tag: '🌾 AGRI-SOLUTIONS DIRECT',
    title: 'Bio Fertilizers &',
    accentTitle: 'High Yield Seeds',
    subtitle: 'Certified Hybrid Seeds • Drip Kits • Bio Pesticides',
    description: 'Empowering Indian farmers with government-certified hybrid seeds, organic bio-fertilizers, micro-drip irrigation kits, and hand sprayers delivered to your doorstep.',
    discountPercent: '45%',
    offerBadge: 'FARM SAVINGS',
    ctaPrimary: 'Shop Agri Tools',
    ctaSecondary: 'Seeds & Fertilizers',
    ctaLink: '/category/agriculture-seeds',
    bgFrom: '#081c0e',
    bgTo: '#0e331b',
    accentColor: '#10b981',
    bgImage: '/promo-agriculture.jpg',
    foregroundImages: ['/categories/oil.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: 'Lab Tested Germination' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Doorstep Village Delivery' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Bulk Kisan Discounts' }
    ]
  },
  {
    id: 'electronics',
    categoryTitle: 'Electronics & Gadgets',
    categoryIcon: <Tv size={17} className="text-white" />,
    tag: '⚡ TECHPULSE ELECTRONICS',
    title: 'Smart Gadgets &',
    accentTitle: 'Auto Electronics',
    subtitle: 'Smartwatches • Wireless Audio • Dashcams & Power Banks',
    description: 'Experience cutting-edge technology with active noise-canceling headphones, Bluetooth party speakers, high-speed power banks, and solar auto accessories.',
    discountPercent: '70%',
    offerBadge: 'MEGA TECH SALE',
    ctaPrimary: 'Shop Electronics',
    ctaSecondary: 'View Auto Gear',
    ctaLink: '/category/electronics',
    bgFrom: '#0b102b',
    bgTo: '#171e4d',
    accentColor: '#6366f1',
    bgImage: '/categories/electronics.webp',
    foregroundImages: ['/categories/electronics.webp', '/categories/auto.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: 'Brand Authorized Distributor' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Fast Express Shipping' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Secure Escrow Payment' }
    ]
  },
  {
    id: 'fashion',
    categoryTitle: 'Fashion & Lifestyle',
    categoryIcon: <Shirt size={17} className="text-white" />,
    tag: '👗 ETHNIC & HANDLOOM',
    title: 'Handloom Sarees &',
    accentTitle: 'Ethnic Fashion',
    subtitle: 'Pure Silk Sarees • Designer Kurtis • Kolhapuri Footwear',
    description: 'Discover exquisite handwoven sarees, breathable organic cotton kurtas, festive dupattas, and handcrafted Kolhapuri juttis made by master Indian artisans.',
    discountPercent: '65%',
    offerBadge: 'FASHION BONANZA',
    ctaPrimary: 'Explore Fashion',
    ctaSecondary: 'View Ethnic Wear',
    ctaLink: '/category/fashion',
    bgFrom: '#240826',
    bgTo: '#45104a',
    accentColor: '#d946ef',
    bgImage: '/categories/fashion.webp',
    foregroundImages: ['/categories/fashion.webp', '/categories/footwear.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: 'Authentic Weaver Craft' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Custom Sizing Support' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Hassle Free Exchanges' }
    ]
  },
  {
    id: 'festive_pooja',
    categoryTitle: 'Festive & Pooja',
    categoryIcon: <Flame size={17} className="text-white" />,
    tag: '🪔 POOJA & FESTIVE SPECIAL',
    title: 'Pooja Samagri &',
    accentTitle: 'Fresh Faral Snacks',
    subtitle: 'Brass Idols • Sandalwood Incense • Homemade Faral Combos',
    description: 'Prepare for holy celebrations with complete ritual kits, brass oil diyas, organic camphor, and traditional Diwali faral snacks made with pure cow ghee.',
    discountPercent: '35%',
    offerBadge: 'FESTIVE OFFER',
    ctaPrimary: 'Shop Pooja Kits',
    ctaSecondary: 'Order Faral Combo',
    ctaLink: '/category/religious-pooja-items',
    bgFrom: '#241406',
    bgTo: '#472709',
    accentColor: '#eab308',
    bgImage: '/promo-festival.jpg',
    foregroundImages: ['/categories/pooja.webp', '/categories/diwali.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: 'Pure & Sacred Ingredients' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Fresh Batch Preparation' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Hygienic Eco Packaging' }
    ]
  },
  {
    id: 'jewellery_crafts',
    categoryTitle: 'Jewellery & Crafts',
    categoryIcon: <Gem size={17} className="text-white" />,
    tag: '💎 ROYAL HERITAGE COLLECTION',
    title: 'Handcrafted Ornaments &',
    accentTitle: 'Astro Gemstones',
    subtitle: 'Silver Jewellery • Certified Gems • Artisan Gifts',
    description: 'Explore hallmarked silver ornaments, certified planetary gemstones, carved marble idols, and handcrafted gift hampers with authenticity certification.',
    discountPercent: '50%',
    offerBadge: 'ROYAL HERITAGE',
    ctaPrimary: 'Shop Jewellery',
    ctaSecondary: 'View Astro Stones',
    ctaLink: '/category/jewellery',
    bgFrom: '#150a29',
    bgTo: '#2e1559',
    accentColor: '#8b5cf6',
    bgImage: '/categories/jewellery.webp',
    foregroundImages: ['/categories/jewellery.webp', '/categories/gifts.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '925 Silver & Hallmarked' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Lab Certified Gemstones' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Insured Transit Shipping' }
    ]
  }
];

export const HeroBannerSlider: React.FC = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating || idx === current) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, current]
  );

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % categoryHeroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + categoryHeroSlides.length) % categoryHeroSlides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const scrollNavLeft = () => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollNavRight = () => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  // Synchronized Auto-Play Interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Keep active category tab visible inside the horizontal category bar
  useEffect(() => {
    const container = navContainerRef.current;
    if (container) {
      // Multiply by 2 because of separators
      const activeTab = container.children[current * 2] as HTMLElement;
      if (activeTab) {
        const containerLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const tabLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.clientWidth;

        if (tabLeft < containerLeft || tabLeft + tabWidth > containerLeft + containerWidth) {
          const targetScrollLeft = tabLeft - containerWidth / 2 + tabWidth / 2;
          container.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [current]);

  const slide = categoryHeroSlides[current];

  return (
    <div
      className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-blue-900/40 transition-all duration-500 bg-[#060D1B]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── 1. Refined Header Category Navigation Bar (Matched to Reference Image) ─── */}
      <div className="w-full bg-[#081224] border-b border-blue-900/50 px-2 sm:px-4 py-2 z-30 relative flex items-center justify-between shadow-md">
        {/* Left Arrow inside Category Bar */}
        <button
          onClick={scrollNavLeft}
          aria-label="Scroll Categories Left"
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 mr-1.5 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Categories Strip */}
        <div
          ref={navContainerRef}
          className="flex-1 flex items-center overflow-x-auto no-scrollbar py-1 gap-1 sm:gap-1.5 scroll-smooth"
        >
          {categoryHeroSlides.map((cat, idx) => {
            const isActive = idx === current;
            return (
              <React.Fragment key={cat.id}>
                <button
                  onClick={() => goTo(idx)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1565FF] to-[#0052EA] text-white shadow-[0_4px_20px_rgba(21,101,255,0.65)] border-t border-white/40 scale-[1.02]'
                      : 'bg-transparent text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="shrink-0">{cat.categoryIcon}</span>
                  <span className="whitespace-nowrap font-bold text-xs tracking-tight">{cat.categoryTitle}</span>
                </button>

                {/* Separator between items */}
                {idx < categoryHeroSlides.length - 1 && (
                  <div className="h-4 w-[1px] bg-white/15 shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Arrow inside Category Bar */}
        <button
          onClick={scrollNavRight}
          aria-label="Scroll Categories Right"
          className="hidden sm:flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1.5 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ─── 2. Main Synchronized Hero Stage ─── */}
      <div
        className="relative h-[420px] sm:h-[480px] md:h-[510px] lg:h-[530px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${slide.bgFrom}, ${slide.bgTo})` }}
      >
        {/* Background Banner Image */}
        <div
          key={`bg_${slide.id}`}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
          style={{
            backgroundImage: `url(${slide.bgImage})`,
            opacity: isAnimating ? 0.25 : 0.85,
          }}
        />

        {/* Multi-layered Dark Gradient for Optimum Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35" />

        {/* Content & Product Showcase Stage */}
        <div
          key={`stage_${slide.id}`}
          className="relative z-10 w-full h-full flex items-center justify-between px-6 sm:px-10 md:px-14 lg:px-16 transition-all duration-500"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          {/* Left Text & Actions */}
          <div className="w-full md:w-3/5 lg:w-[54%] flex flex-col justify-center space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Category Tag */}
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-black text-white tracking-widest uppercase flex items-center gap-2 border px-3.5 py-1 rounded-full backdrop-blur-md shadow-xs"
                style={{ backgroundColor: `${slide.accentColor}25`, borderColor: `${slide.accentColor}50` }}
              >
                <span className="w-2 h-2 rounded-full inline-block animate-ping" style={{ backgroundColor: slide.accentColor }} />
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black text-white leading-none tracking-tight drop-shadow-md">
                {slide.title}
              </h1>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black leading-none tracking-tight mt-1 drop-shadow-lg"
                style={{ color: slide.accentColor }}
              >
                {slide.accentTitle}
              </h1>
            </div>

            {/* Subtitle & Description */}
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm font-extrabold text-white/95 tracking-wide">
                {slide.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-xl line-clamp-2">
                {slide.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center flex-wrap gap-3.5 pt-2">
              <button
                onClick={() => router.push(slide.ctaLink)}
                className="inline-flex items-center gap-2 text-white font-black text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: slide.accentColor }}
              >
                <ShoppingBag size={18} />
                <span>{slide.ctaPrimary} &rarr;</span>
              </button>
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all backdrop-blur-md shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Tag size={16} />
                <span>{slide.ctaSecondary}</span>
              </button>
            </div>
          </div>

          {/* Right Product Cutouts Showcase & Discount Circle */}
          <div className="hidden sm:flex flex-col items-end justify-center gap-5 lg:gap-6">
            {/* Foreground Product Cutouts */}
            <div className="flex items-center gap-3">
              {slide.foregroundImages.map((img, i) => (
                <div
                  key={i}
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-3xl p-2.5 bg-black/40 border border-white/20 backdrop-blur-md shadow-2xl overflow-hidden hover:scale-110 transition-transform duration-300 flex items-center justify-center"
                >
                  <img
                    src={img}
                    alt={slide.categoryTitle}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              ))}
            </div>

            {/* Circular Offer Badge */}
            <div className="flex items-center gap-4">
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md"
                style={{
                  borderColor: slide.accentColor,
                  background: 'radial-gradient(circle, rgba(0,0,0,0.85), rgba(10,10,10,0.95))',
                }}
              >
                <span className="text-white text-[9px] font-black uppercase tracking-widest">UP TO</span>
                <span className="font-black leading-none my-0.5 text-2xl sm:text-3xl" style={{ color: slide.accentColor }}>
                  {slide.discountPercent}
                </span>
                <span className="text-white text-[9px] font-black uppercase tracking-widest">OFF</span>
              </div>

              {/* Trust Badges */}
              <div className="hidden lg:flex flex-col gap-2">
                {slide.trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl shadow-sm">
                    {badge.icon}
                    <span className="text-white text-[11px] font-bold whitespace-nowrap">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Previous Navigation Arrow */}
        <button
          onClick={prev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next Navigation Arrow */}
        <button
          onClick={next}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={22} />
        </button>

        {/* Synchronized Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {categoryHeroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? 'w-8 h-2.5 shadow-md' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              style={i === current ? { backgroundColor: slide.accentColor } : {}}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

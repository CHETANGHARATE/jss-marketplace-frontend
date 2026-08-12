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
  Tractor,
  ArrowRight,
  Play,
  Star
} from 'lucide-react';

export interface CategoryHeroSlide {
  id: string;
  categoryTitle: string;
  categoryIcon: React.ReactNode;
  tag: string;
  eyebrow: string;
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
    categoryIcon: <Umbrella size={15} className="text-white" />,
    tag: '🌧️ MONSOON EXCLUSIVE',
    eyebrow: 'Limited Time Monsoon Offer',
    title: 'Monsoon Rain',
    accentTitle: 'Essentials 60% OFF',
    subtitle: 'Heavy Duty Umbrellas • Raincoats • Waterproof Boots',
    description: 'Protect yourself this monsoon with premium wind-resistant umbrellas, double-layered raincoats, and non-slip waterproof footwear directly from verified Indian manufacturers.',
    discountPercent: '60%',
    offerBadge: 'MONSOON SPECIAL',
    ctaPrimary: 'Shop Rain Gear',
    ctaSecondary: 'Explore All Deals',
    ctaLink: '/search?tag=monsoon',
    bgFrom: '#060f1f',
    bgTo: '#0b1e3a',
    accentColor: '#38bdf8',
    bgImage: '/hero-monsoon.jpg',
    foregroundImages: ['/categories/footwear.webp', '/categories/auto.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: '100% Waterproof Guarantee' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Same Day Dispatch' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: '10-Day Easy Replacement' }
    ]
  },
  {
    id: 'home_kitchen',
    categoryTitle: 'Home & Kitchen',
    categoryIcon: <Home size={15} className="text-white" />,
    tag: '🏠 HOME & KITCHEN FESTIVAL',
    eyebrow: 'Kitchen Festival Sale',
    title: 'Modern Home &',
    accentTitle: 'Kitchen Appliances',
    subtitle: 'High Speed Juicers • Brass Utensils • Solar Appliances',
    description: 'Upgrade your culinary space with stone-ground mixers, food processors, copper cookware sets, and energy-efficient solar appliances at direct-from-factory prices.',
    discountPercent: '50%',
    offerBadge: 'KITCHEN SALE',
    ctaPrimary: 'Shop Kitchenware',
    ctaSecondary: 'View Appliances',
    ctaLink: '/category/home-kitchen',
    bgFrom: '#160f02',
    bgTo: '#2d1c04',
    accentColor: '#f59e0b',
    bgImage: '/categories/kitchen.webp',
    foregroundImages: ['/categories/juices.webp', '/categories/kitchen.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: '1 Year Brand Warranty' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Free Express Shipping' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'GST Invoice Available' }
    ]
  },
  {
    id: 'beauty_care',
    categoryTitle: 'Beauty & Personal Care',
    categoryIcon: <Sparkles size={15} className="text-white" />,
    tag: '💄 BEAUTY & SKINCARE',
    eyebrow: 'Organic Glow Collection',
    title: 'Organic Beauty &',
    accentTitle: 'Personal Care',
    subtitle: 'Ayurvedic Serums • Herbal Shampoos • Makeup Kits',
    description: 'Transform your daily routine with toxin-free botanical serums, cold-pressed oils, pure aloe vera gels, and branded cosmetic hampers for glowing health.',
    discountPercent: '40%',
    offerBadge: 'GLOW DEALS',
    ctaPrimary: 'Explore Beauty',
    ctaSecondary: 'View Cosmetics',
    ctaLink: '/category/beauty-personal-care',
    bgFrom: '#1c0810',
    bgTo: '#370e1e',
    accentColor: '#f43f5e',
    bgImage: '/categories/beauty.webp',
    foregroundImages: ['/categories/cosmetics.webp', '/categories/beauty.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: 'Dermatologically Tested' },
      { icon: <Zap size={13} className="text-amber-400" />, text: '100% Organic & Chemical-Free' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Direct Manufacturer Supply' }
    ]
  },
  {
    id: 'agriculture',
    categoryTitle: 'Agriculture & Seeds',
    categoryIcon: <Tractor size={15} className="text-white" />,
    tag: '🌾 AGRI-SOLUTIONS DIRECT',
    eyebrow: 'Empowering Indian Farmers',
    title: 'Bio Fertilizers &',
    accentTitle: 'High Yield Seeds',
    subtitle: 'Certified Hybrid Seeds • Drip Kits • Bio Pesticides',
    description: 'Empowering Indian farmers with government-certified hybrid seeds, organic bio-fertilizers, micro-drip irrigation kits, and hand sprayers delivered to your doorstep.',
    discountPercent: '45%',
    offerBadge: 'FARM SAVINGS',
    ctaPrimary: 'Shop Agri Tools',
    ctaSecondary: 'Seeds & Fertilizers',
    ctaLink: '/category/agriculture-seeds',
    bgFrom: '#060f08',
    bgTo: '#0a2010',
    accentColor: '#10b981',
    bgImage: '/promo-agriculture.jpg',
    foregroundImages: ['/categories/oil.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: 'Lab Tested Germination' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Doorstep Village Delivery' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Bulk Kisan Discounts' }
    ]
  },
  {
    id: 'electronics',
    categoryTitle: 'Electronics & Gadgets',
    categoryIcon: <Tv size={15} className="text-white" />,
    tag: '⚡ TECHPULSE ELECTRONICS',
    eyebrow: 'Mega Tech Sale Event',
    title: 'Smart Gadgets &',
    accentTitle: 'Auto Electronics',
    subtitle: 'Smartwatches • Wireless Audio • Dashcams & Power Banks',
    description: 'Experience cutting-edge technology with active noise-canceling headphones, Bluetooth party speakers, high-speed power banks, and solar auto accessories.',
    discountPercent: '70%',
    offerBadge: 'MEGA TECH SALE',
    ctaPrimary: 'Shop Electronics',
    ctaSecondary: 'View Auto Gear',
    ctaLink: '/category/electronics',
    bgFrom: '#080d20',
    bgTo: '#131a3f',
    accentColor: '#818cf8',
    bgImage: '/categories/electronics.webp',
    foregroundImages: ['/categories/electronics.webp', '/categories/auto.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: 'Brand Authorized Distributor' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Fast Express Shipping' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Secure Escrow Payment' }
    ]
  },
  {
    id: 'fashion',
    categoryTitle: 'Fashion & Lifestyle',
    categoryIcon: <Shirt size={15} className="text-white" />,
    tag: '👗 ETHNIC & HANDLOOM',
    eyebrow: 'Handcrafted Indian Artisan Wear',
    title: 'Handloom Sarees &',
    accentTitle: 'Ethnic Fashion',
    subtitle: 'Pure Silk Sarees • Designer Kurtis • Kolhapuri Footwear',
    description: 'Discover exquisite handwoven sarees, breathable organic cotton kurtas, festive dupattas, and handcrafted Kolhapuri juttis made by master Indian artisans.',
    discountPercent: '65%',
    offerBadge: 'FASHION BONANZA',
    ctaPrimary: 'Explore Fashion',
    ctaSecondary: 'View Ethnic Wear',
    ctaLink: '/category/fashion',
    bgFrom: '#1a061e',
    bgTo: '#350c3c',
    accentColor: '#e879f9',
    bgImage: '/categories/fashion.webp',
    foregroundImages: ['/categories/fashion.webp', '/categories/footwear.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: 'Authentic Weaver Craft' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Custom Sizing Support' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Hassle Free Exchanges' }
    ]
  },
  {
    id: 'festive_pooja',
    categoryTitle: 'Festive & Pooja',
    categoryIcon: <Flame size={15} className="text-white" />,
    tag: '🪔 POOJA & FESTIVE SPECIAL',
    eyebrow: 'Sacred & Festive Collection',
    title: 'Pooja Samagri &',
    accentTitle: 'Fresh Faral Snacks',
    subtitle: 'Brass Idols • Sandalwood Incense • Homemade Faral Combos',
    description: 'Prepare for holy celebrations with complete ritual kits, brass oil diyas, organic camphor, and traditional Diwali faral snacks made with pure cow ghee.',
    discountPercent: '35%',
    offerBadge: 'FESTIVE OFFER',
    ctaPrimary: 'Shop Pooja Kits',
    ctaSecondary: 'Order Faral Combo',
    ctaLink: '/category/religious-pooja-items',
    bgFrom: '#1a0e04',
    bgTo: '#362006',
    accentColor: '#fbbf24',
    bgImage: '/promo-festival.jpg',
    foregroundImages: ['/categories/pooja.webp', '/categories/diwali.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: 'Pure & Sacred Ingredients' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Fresh Batch Preparation' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Hygienic Eco Packaging' }
    ]
  },
  {
    id: 'jewellery_crafts',
    categoryTitle: 'Jewellery & Crafts',
    categoryIcon: <Gem size={15} className="text-white" />,
    tag: '💎 ROYAL HERITAGE COLLECTION',
    eyebrow: 'Hallmarked & Lab Certified',
    title: 'Handcrafted Ornaments &',
    accentTitle: 'Astro Gemstones',
    subtitle: 'Silver Jewellery • Certified Gems • Artisan Gifts',
    description: 'Explore hallmarked silver ornaments, certified planetary gemstones, carved marble idols, and handcrafted gift hampers with authenticity certification.',
    discountPercent: '50%',
    offerBadge: 'ROYAL HERITAGE',
    ctaPrimary: 'Shop Jewellery',
    ctaSecondary: 'View Astro Stones',
    ctaLink: '/category/jewellery',
    bgFrom: '#0e0720',
    bgTo: '#1e1040',
    accentColor: '#a78bfa',
    bgImage: '/categories/jewellery.webp',
    foregroundImages: ['/categories/jewellery.webp', '/categories/gifts.webp'],
    trustBadges: [
      { icon: <ShieldCheck size={13} className="text-emerald-400" />, text: '925 Silver & Hallmarked' },
      { icon: <Zap size={13} className="text-amber-400" />, text: 'Lab Certified Gemstones' },
      { icon: <RefreshCw size={13} className="text-blue-400" />, text: 'Insured Transit Shipping' }
    ]
  }
];

export const HeroBannerSlider: React.FC = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION = 5500;

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating || idx === current) return;
      setIsAnimating(true);
      setCurrent(idx);
      setProgressKey((k) => k + 1);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [isAnimating, current]
  );

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % categoryHeroSlides.length);
    setProgressKey((k) => k + 1);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + categoryHeroSlides.length) % categoryHeroSlides.length);
    setProgressKey((k) => k + 1);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const scrollNavLeft = () => {
    if (navContainerRef.current) navContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollNavRight = () => {
    if (navContainerRef.current) navContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => next(), SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  // Keep active tab scrolled into view
  useEffect(() => {
    const container = navContainerRef.current;
    if (!container) return;
    const activeTab = container.children[current * 2] as HTMLElement;
    if (activeTab) {
      const containerLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const tabLeft = activeTab.offsetLeft;
      const tabWidth = activeTab.clientWidth;
      if (tabLeft < containerLeft || tabLeft + tabWidth > containerLeft + containerWidth) {
        container.scrollTo({ left: tabLeft - containerWidth / 2 + tabWidth / 2, behavior: 'smooth' });
      }
    }
  }, [current]);

  const slide = categoryHeroSlides[current];

  return (
    <div
      className="w-full relative overflow-hidden shadow-2xl"
      style={{ borderRadius: '0' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── 1. CATEGORY NAVIGATION STRIP ─── */}
      <div
        className="w-full border-b border-white/10 flex items-center justify-between px-2 sm:px-3 py-1.5 z-30 relative"
        style={{ background: 'linear-gradient(180deg, #040a14 0%, #070f1e 100%)' }}
      >
        {/* Left scroll button */}
        <button
          onClick={scrollNavLeft}
          aria-label="Scroll Categories Left"
          className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 mr-1"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Categories scroll area */}
        <div
          ref={navContainerRef}
          className="flex-1 flex items-center overflow-x-auto no-scrollbar py-1 gap-0.5 scroll-smooth"
        >
          {categoryHeroSlides.map((cat, idx) => {
            const isActive = idx === current;
            return (
              <React.Fragment key={cat.id}>
                <button
                  onClick={() => goTo(idx)}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                    isActive
                      ? 'text-white shadow-lg scale-[1.03]'
                      : 'bg-transparent text-white/65 hover:text-white/90 hover:bg-white/8'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, ${slide.accentColor}30, ${slide.accentColor}18)`, borderBottom: `2px solid ${slide.accentColor}`, paddingBottom: '4px' } : {}}
                >
                  <span className="shrink-0">{cat.categoryIcon}</span>
                  <span className="whitespace-nowrap tracking-tight">{cat.categoryTitle}</span>
                </button>
                {idx < categoryHeroSlides.length - 1 && (
                  <div className="h-3.5 w-px bg-white/12 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={scrollNavRight}
          aria-label="Scroll Categories Right"
          className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0 ml-1"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* ─── 2. MAIN HERO STAGE ─── */}
      <div
        className="relative h-[380px] sm:h-[440px] md:h-[490px] lg:h-[520px] xl:h-[540px] overflow-hidden transition-all duration-700"
        style={{ background: `linear-gradient(145deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)` }}
      >
        {/* Background image layer */}
        <div
          key={`bg_${slide.id}`}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${slide.bgImage})`,
            opacity: isAnimating ? 0.15 : 0.55,
            transform: isAnimating ? 'scale(1.06)' : 'scale(1.01)',
            transition: 'opacity 0.7s ease, transform 6s ease',
          }}
        />

        {/* Gradient overlay — stronger on left for readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(100deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 100%)'
        }} />

        {/* Subtle noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }} />

        {/* Decorative accent glow — top right corner */}
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: slide.accentColor }}
        />

        {/* ─── Main Content ─── */}
        <div
          key={`stage_${slide.id}`}
          className="relative z-10 w-full h-full flex items-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 gap-8"
          style={{ opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.55s ease, transform 0.55s ease' }}
        >
          {/* LEFT: Text content */}
          <div className="w-full md:w-[55%] lg:w-[52%] flex flex-col justify-center space-y-4 sm:space-y-5">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-white tracking-widest uppercase px-3.5 py-1.5 rounded-full backdrop-blur-sm border"
                style={{ backgroundColor: `${slide.accentColor}20`, borderColor: `${slide.accentColor}45` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-ping inline-block" style={{ backgroundColor: slide.accentColor }} />
                {slide.tag}
              </span>
            </div>

            {/* Eyebrow subtitle */}
            <p className="text-[11px] sm:text-xs font-semibold text-white/60 uppercase tracking-widest -mt-1">
              {slide.eyebrow}
            </p>

            {/* Main headline */}
            <div className="-mt-1">
              <h1 className="text-[2rem] sm:text-[2.6rem] md:text-5xl lg:text-[3.4rem] xl:text-[3.75rem] font-black text-white leading-[1.05] tracking-tight drop-shadow-md">
                {slide.title}
              </h1>
              <h1
                className="text-[2rem] sm:text-[2.6rem] md:text-5xl lg:text-[3.4rem] xl:text-[3.75rem] font-black leading-[1.05] tracking-tight mt-1"
                style={{ color: slide.accentColor, filter: `drop-shadow(0 0 30px ${slide.accentColor}60)` }}
              >
                {slide.accentTitle}
              </h1>
            </div>

            {/* Subtitle keywords */}
            <p className="text-xs sm:text-sm font-bold text-white/80 tracking-wide border-l-2 pl-3" style={{ borderColor: slide.accentColor }}>
              {slide.subtitle}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-white/60 font-medium leading-relaxed max-w-lg line-clamp-2 hidden sm:block">
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center flex-wrap gap-3 pt-1">
              <button
                onClick={() => router.push(slide.ctaLink)}
                className="inline-flex items-center gap-2 text-white font-black text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
                style={{ backgroundColor: slide.accentColor }}
              >
                <ShoppingBag size={16} />
                <span>{slide.ctaPrimary}</span>
                <ArrowRight size={15} className="ml-0.5" />
              </button>
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/18 border border-white/25 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-3 sm:py-3.5 rounded-full transition-all backdrop-blur-sm hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Tag size={14} />
                <span>{slide.ctaSecondary}</span>
              </button>
            </div>

            {/* Trust badges row (mobile: compact, desktop: full) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {slide.trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/12 px-2.5 py-1.5 rounded-xl shadow-sm">
                  {badge.icon}
                  <span className="text-white text-[10px] sm:text-[11px] font-bold whitespace-nowrap">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Visual showcase */}
          <div className="hidden md:flex flex-col items-center justify-center gap-5 flex-1">
            {/* Product image cards */}
            <div className="flex items-center justify-center gap-4">
              {slide.foregroundImages.map((img, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur-sm bg-black/40 hover:scale-105 transition-all duration-300"
                  style={{
                    width: i === 0 ? '140px' : '118px',
                    height: i === 0 ? '140px' : '118px',
                    transform: i === 1 ? 'translateY(12px)' : 'none',
                    animationDelay: `${i * 150}ms`,
                    boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${slide.accentColor}20`
                  }}
                >
                  <img src={img} alt={slide.categoryTitle} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Discount badge */}
            <div className="flex items-center gap-5 mt-2">
              <div
                className="w-28 h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center text-center shadow-2xl border-[3px] relative overflow-hidden"
                style={{
                  borderColor: slide.accentColor,
                  background: 'radial-gradient(circle at center, rgba(0,0,0,0.9), rgba(5,5,5,0.95))',
                  boxShadow: `0 0 40px ${slide.accentColor}35, 0 20px 60px rgba(0,0,0,0.6)`
                }}
              >
                {/* Shine ring */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: `conic-gradient(from 180deg, ${slide.accentColor}30, transparent 60%, ${slide.accentColor}20)`
                }} />
                <span className="text-white text-[9px] font-black uppercase tracking-widest z-10 relative">UP TO</span>
                <span className="font-black leading-none z-10 relative text-3xl lg:text-4xl" style={{ color: slide.accentColor }}>
                  {slide.discountPercent}
                </span>
                <span className="text-white text-[9px] font-black uppercase tracking-widest z-10 relative">OFF</span>
              </div>

              {/* Star rating decoration */}
              <div className="flex flex-col gap-1.5 hidden lg:flex">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-white/60 text-[10px] font-semibold">4.8 / 5 · 10k+ reviews</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/70 font-bold">2,400+ Active Sellers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next Navigation Arrows */}
        <button
          onClick={prev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronRight size={20} />
        </button>

        {/* Progress Bar + Dot Indicators — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 pb-4 pt-8 flex items-end justify-between"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {categoryHeroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'h-2' : 'w-2 h-2 bg-white/35 hover:bg-white/60'
                }`}
                style={i === current ? { width: '28px', backgroundColor: slide.accentColor, boxShadow: `0 0 8px ${slide.accentColor}80` } : {}}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide count */}
          <div className="text-white/50 text-[11px] font-bold tabular-nums hidden sm:block">
            <span style={{ color: slide.accentColor }}>{String(current + 1).padStart(2, '0')}</span>
            <span className="mx-1">/</span>
            <span>{String(categoryHeroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Auto-play progress bar */}
        {!isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] z-30">
            <div
              key={`progress_${progressKey}_${current}`}
              className="h-full opacity-70"
              style={{
                backgroundColor: slide.accentColor,
                animation: `slideProgress ${SLIDE_DURATION}ms linear forwards`,
                transformOrigin: 'left',
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

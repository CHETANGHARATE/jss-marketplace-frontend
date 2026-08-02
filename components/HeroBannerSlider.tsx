'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShoppingBag, Tag, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface HeroSlide {
  id: number;
  tag: string;
  title: string;
  accentTitle: string;
  subtitle: string;
  discountBadge: string;
  discountPercent: string;
  discountSub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaLink: string;
  bgFrom: string;
  bgTo: string;
  productImage: string;
  trustBadges: { icon: React.ReactNode; text: string }[];
}

const slides: HeroSlide[] = [
  {
    id: 1,
    tag: '🌧️ MONSOON SPECIAL',
    title: 'Mega Monsoon',
    accentTitle: 'Discounts',
    subtitle: 'Big Savings on Every Category\nShop More • Save More',
    discountBadge: 'UP TO\n60%\nOFF',
    discountPercent: '60%',
    discountSub: '',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'Explore All Deals',
    ctaLink: '/search?tag=monsoon',
    bgFrom: '#0d1b35',
    bgTo: '#0a2545',
    productImage: '/hero-monsoon.jpg',
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '100% Genuine Products' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Fast & Free Delivery' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Easy Returns & Refunds' },
    ]
  },
  {
    id: 2,
    tag: '🎉 FESTIVE DEALS',
    title: 'Festival',
    accentTitle: 'Mega Savings',
    subtitle: 'Biggest Festival Sale of the Year\nShop & Celebrate',
    discountBadge: 'UP TO\n80%\nOFF',
    discountPercent: '80%',
    discountSub: '',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'View All Offers',
    ctaLink: '/search?tag=festival',
    bgFrom: '#1a0d35',
    bgTo: '#2d0a45',
    productImage: '/promo-festival.jpg',
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '100% Genuine Products' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Fast & Free Delivery' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Easy Returns & Refunds' },
    ]
  },
  {
    id: 3,
    tag: '🌿 FARM FRESH',
    title: 'Agriculture',
    accentTitle: 'Direct Tools',
    subtitle: 'Best Quality • Best Price\nDirect From Manufacturers',
    discountBadge: 'UP TO\n50%\nOFF',
    discountPercent: '50%',
    discountSub: '',
    ctaPrimary: 'Shop Now',
    ctaSecondary: 'Explore Farm Tools',
    ctaLink: '/search?tag=agriculture',
    bgFrom: '#0a2010',
    bgTo: '#0d2d12',
    productImage: '/promo-agriculture.jpg',
    trustBadges: [
      { icon: <ShieldCheck size={14} className="text-emerald-400" />, text: '100% Genuine Products' },
      { icon: <Zap size={14} className="text-amber-400" />, text: 'Fast & Free Delivery' },
      { icon: <RefreshCw size={14} className="text-blue-400" />, text: 'Easy Returns & Refunds' },
    ]
  },
];

const categoryNav = [
  { icon: '☔', label: 'Rain Essentials', href: '/category/rain-essentials' },
  { icon: '🏠', label: 'Home & Kitchen', href: '/category/home-kitchen' },
  { icon: '🧴', label: 'Beauty & Personal Care', href: '/category/beauty-personal-care' },
  { icon: '🌾', label: 'Agriculture & Tools', href: '/category/agriculture-tools' },
  { icon: '💻', label: 'Electronics & Gadgets', href: '/category/electronics-gadgets' },
  { icon: '👗', label: 'Fashion & Lifestyle', href: '/category/fashion-lifestyle' },
];

export const HeroBannerSlider: React.FC = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="w-full overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${slide.bgFrom}, ${slide.bgTo})` }}>
      {/* Category Nav Strip */}
      <div className="flex items-center overflow-x-auto no-scrollbar border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <button
          onClick={prev}
          className="shrink-0 p-3 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll categories left"
        >
          <ChevronLeft size={16} />
        </button>
        {categoryNav.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className={`shrink-0 flex items-center gap-2 px-5 py-3 text-xs font-semibold transition-all border-b-2 whitespace-nowrap ${
              idx === 0
                ? 'text-white border-blue-400 bg-blue-600/30'
                : 'text-white/70 border-transparent hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </Link>
        ))}
        <button
          onClick={next}
          className="shrink-0 p-3 text-white/60 hover:text-white transition-colors ml-auto"
          aria-label="Scroll categories right"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Main Hero Area */}
      <div className="relative h-[340px] sm:h-[400px] md:h-[440px] lg:h-[480px] overflow-hidden">
        <div
          key={current}
          className="absolute inset-0 flex items-center transition-opacity duration-500"
          style={{ opacity: isAnimating ? 0 : 1 }}
        >
          {/* Left: Content */}
          <div className="relative z-10 w-full md:w-1/2 lg:w-[45%] h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 space-y-5">
            {/* Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white/80 tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1 h-4 bg-blue-400 rounded-full inline-block" />
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-white leading-tight tracking-tight drop-shadow-sm">
                {slide.title}
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-tight tracking-tight" style={{ color: '#7BC67E' }}>
                {slide.accentTitle}
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-sm text-white/70 font-medium leading-relaxed whitespace-pre-line">
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center flex-wrap gap-3 pt-1">
              <button
                onClick={() => router.push(slide.ctaLink)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/30 active:scale-95"
              >
                <ShoppingBag size={16} />
                {slide.ctaPrimary} →
              </button>
              <button
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-full transition-all backdrop-blur-sm"
              >
                <Tag size={14} />
                {slide.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Center: Product Image */}
          <div className="absolute inset-0 flex items-end justify-center md:justify-start md:left-[38%] pointer-events-none">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.productImage})` }}
            />
          </div>

          {/* Right: Discount Badge + Trust Badges */}
          <div className="absolute right-6 sm:right-10 md:right-12 top-1/2 -translate-y-1/2 z-10 flex flex-col items-end gap-4">
            {/* Circular Discount Badge */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-emerald-400 flex flex-col items-center justify-center text-center shadow-xl shadow-emerald-500/20"
                style={{ background: 'radial-gradient(circle, #0f2a18, #0a1f12)' }}>
                <span className="text-white text-[9px] font-bold uppercase tracking-widest">UP TO</span>
                <span className="text-emerald-400 font-black leading-none" style={{ fontSize: '2rem' }}>{slide.discountPercent}</span>
                <span className="text-white text-[9px] font-bold uppercase tracking-widest">OFF</span>
              </div>
              <div className="absolute -inset-1 rounded-full border border-emerald-400/30 animate-ping opacity-20 pointer-events-none" />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-col gap-2">
              {slide.trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                  {badge.icon}
                  <span className="text-white text-[11px] font-semibold whitespace-nowrap">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nav Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2.5 bg-blue-400' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

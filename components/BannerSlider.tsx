'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BannerSlide {
  id: number;
  titleKey: string;
  subKey: string;
  tagKey: string;
  accentText: string;
  discountBadge: string;
  categoryId: string;
  image: string;
}

export const BannerSlider: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: BannerSlide[] = [
    {
      id: 1,
      titleKey: 'banner.diwali_title',
      subKey: 'banner.diwali_subtitle',
      tagKey: 'Festive Mega Deals',
      accentText: 'Diwali Dhamaka 2026',
      discountBadge: 'UP TO 80% OFF',
      categoryId: 'electronics',
      image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1400&auto=format&fit=crop'
    },
    {
      id: 2,
      titleKey: 'banner.monsoon_title',
      subKey: 'banner.monsoon_subtitle',
      tagKey: 'Direct From Farmers',
      accentText: 'Monsoon Farm Harvest',
      discountBadge: '100% GENUINE SOURCE',
      categoryId: 'agriculture',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1400&auto=format&fit=crop'
    },
    {
      id: 3,
      titleKey: 'banner.billion_title',
      subKey: 'banner.billion_subtitle',
      tagKey: 'Big Billion Festival',
      accentText: 'Trending Fashion & Handicrafts',
      discountBadge: 'SPECIAL B2B & RETAIL DISCOUNTS',
      categoryId: 'fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop'
    }
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 6500);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] lg:h-[540px] overflow-hidden rounded-3xl border border-border-custom/80 bg-slate-950 shadow-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-12 md:p-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white"
        >
          {/* Background Hero Image with Blend Gradient */}
          <div 
            className="absolute inset-0 md:left-1/3 w-full md:w-2/3 h-full opacity-40 md:opacity-50 bg-cover bg-center pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>

          {/* Slide Content Stack */}
          <div className="relative z-10 w-full md:w-2/3 text-white space-y-4 sm:space-y-6 flex flex-col justify-center h-full">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles size={13} />
                <span>{slides[currentSlide].accentText}</span>
              </div>
              <span className="inline-flex items-center gap-1 bg-slate-800/90 text-amber-400 border border-slate-700/80 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase">
                <Zap size={12} />
                <span>{slides[currentSlide].discountBadge}</span>
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight tracking-tight text-white max-w-2xl drop-shadow-sm">
              {t(slides[currentSlide].titleKey)}
            </h1>
            
            <p className="text-xs sm:text-base text-slate-300 max-w-xl font-medium leading-relaxed">
              {t(slides[currentSlide].subKey)}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.push(`/category/${slides[currentSlide].categoryId}`)}
                className="bg-primary text-white font-black px-7 py-3.5 rounded-2xl hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-2.5 text-xs sm:text-sm uppercase tracking-wider shadow-md"
              >
                <ShoppingBag size={18} />
                <span>{t('banner.cta')}</span>
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => router.push('/search')}
                className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white border border-slate-700/90 hover:border-slate-500 bg-slate-900/80 backdrop-blur-md px-5 py-3.5 rounded-2xl transition-all flex items-center gap-2"
              >
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Explore All Categories</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Manual Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-white backdrop-blur-md transition-all duration-200 z-20 hover:scale-105 active:scale-95 shadow-md"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-white backdrop-blur-md transition-all duration-200 z-20 hover:scale-105 active:scale-95 shadow-md"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Progress Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 bg-slate-950/60 backdrop-blur-md border border-slate-800/80 px-4 py-2 rounded-full">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
              currentSlide === idx ? 'w-8 bg-primary' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

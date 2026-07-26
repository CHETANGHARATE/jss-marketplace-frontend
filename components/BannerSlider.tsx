'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BannerSlide {
  id: number;
  titleKey: string;
  subKey: string;
  tagKey: string;
  accentText: string;
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
      accentText: 'Diwali Dhamaka',
      categoryId: 'electronics',
      image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 2,
      titleKey: 'banner.monsoon_title',
      subKey: 'banner.monsoon_subtitle',
      tagKey: 'Agriculture Direct',
      accentText: 'Monsoon Farm Special',
      categoryId: 'agriculture',
      image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 3,
      titleKey: 'banner.billion_title',
      subKey: 'banner.billion_subtitle',
      tagKey: 'Big Billion Festival',
      accentText: 'Trending Super Deals',
      categoryId: 'fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] overflow-hidden rounded-3xl border border-border-custom bg-slate-950 shadow-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-14 bg-slate-950 text-white"
        >
          {/* Background Hero Image */}
          <div 
            className="absolute inset-0 md:left-1/2 w-full md:w-1/2 h-full opacity-30 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />

          {/* Slide Content */}
          <div className="relative z-10 w-full md:w-3/5 text-white space-y-3 sm:space-y-4 flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider w-max shadow-xs">
              <Tag size={12} />
              <span>{slides[currentSlide].accentText}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white">
              {t(slides[currentSlide].titleKey)}
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl font-medium leading-relaxed">
              {t(slides[currentSlide].subKey)}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => router.push(`/category/${slides[currentSlide].categoryId}`)}
                className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider shadow-sm"
              >
                <ShoppingBag size={16} />
                <span>{t('banner.cta')}</span>
                <ArrowRight size={14} />
              </button>
              
              <span className="text-xs font-bold text-slate-400 border border-slate-800 bg-slate-900 px-3 py-2 rounded-xl hidden sm:inline-block">
                {slides[currentSlide].tagKey}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Left/Right Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-white transition-all z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-white transition-all z-20"
        aria-label="Next Slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-7 bg-white' : 'w-2 bg-slate-700'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

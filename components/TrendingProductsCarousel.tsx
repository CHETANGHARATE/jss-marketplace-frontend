'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../contexts/LanguageContext';

interface TrendingProductsCarouselProps {
  products: Product[];
  onQuickView: (productId: string) => void;
}

export const TrendingProductsCarousel: React.FC<TrendingProductsCarouselProps> = ({
  products,
  onQuickView,
}) => {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);

  // Update visible columns based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setVisibleCount(5); // Desktop: 5 cards
      } else if (w >= 768) {
        setVisibleCount(3); // Tablet: 3 cards
      } else if (w >= 640) {
        setVisibleCount(2); // Small Tablet / Mobile landscape: 2 cards
      } else {
        setVisibleCount(1); // Mobile: 1 card
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const realCount = products ? products.length : 0;
  const isLooping = realCount > visibleCount;

  // Infinite circular carousel items:
  // Clone head (last visibleCount items) + Real items + Clone tail (first visibleCount + 1 items)
  const cloneHead = isLooping ? products.slice(-visibleCount) : [];
  const cloneTail = isLooping ? products.slice(0, visibleCount + 1) : [];
  const displayItems = isLooping ? [...cloneHead, ...products, ...cloneTail] : products;

  const startIndex = isLooping ? visibleCount : 0;
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  // Keep index synchronized when product count or visible columns change
  useEffect(() => {
    if (isLooping) {
      setCurrentIndex(visibleCount);
    } else {
      setCurrentIndex(0);
    }
  }, [realCount, visibleCount, isLooping]);

  // Handle invisible snap after transition finishes at clone boundaries (500ms)
  useEffect(() => {
    if (!isLooping) return;

    // Boundary check when sliding forward into cloneTail
    if (currentIndex >= startIndex + realCount) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex(startIndex);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Boundary check when sliding backward into cloneHead
    if (currentIndex < startIndex) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex(startIndex + realCount - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isLooping, realCount, startIndex]);

  // Re-enable smooth transition state after an instantaneous snap
  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  // Auto-slide ONLY FORWARD every 4.5s
  useEffect(() => {
    if (!isLooping || isPaused) return;

    const interval = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLooping, isPaused]);

  const handlePrev = () => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Touch swiping handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      id="trending"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm scroll-mt-24"
    >
      {/* ─── Header: Heading & Arrow Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-custom/80">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 bg-primary text-white flex items-center justify-center rounded-2xl font-bold shadow-xs shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles size={11} className="text-primary fill-primary/30" />
              <span>{t('home.trending_badge') || 'Trending Collection'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              {t('home.trending_products') || 'Trending Products'}
            </h2>
            <p className="text-xs text-muted-custom mt-0.5 font-medium">
              {t('home.trending_sub') || 'Popular products customers are loving right now.'}
            </p>
          </div>
        </div>

        {/* Carousel Manual Arrows */}
        {isLooping && (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous trending products"
              className="h-10 w-10 rounded-2xl bg-background-secondary hover:bg-primary hover:text-white border border-border-custom flex items-center justify-center transition-all text-foreground shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next trending products"
              className="h-10 w-10 rounded-2xl bg-background-secondary hover:bg-primary hover:text-white border border-border-custom flex items-center justify-center transition-all text-foreground shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ─── Carousel Viewport & Track ─── */}
      <div
        className="overflow-hidden relative pt-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex gap-6 ${withTransition ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + 1.5rem) / ${visibleCount}))`
          }}
        >
          {displayItems.map((prod, idx) => (
            <div
              key={`trending_${prod.id}_${idx}`}
              className="flex-none w-full sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-2*1.5rem)/3)] lg:w-[calc((100%-4*1.5rem)/5)]"
            >
              <ProductCard
                product={prod}
                onQuickView={onQuickView}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

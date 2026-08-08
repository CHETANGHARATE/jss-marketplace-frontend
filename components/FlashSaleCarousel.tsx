'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FlashSaleCarouselProps {
  products: Product[];
  onQuickView: (productId: string) => void;
  timeLeft: { hours: number; minutes: number; seconds: number };
}

export const FlashSaleCarousel: React.FC<FlashSaleCarouselProps> = ({
  products,
  onQuickView,
  timeLeft
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const touchStartX = useRef<number | null>(null);

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

  const maxIndex = Math.max(0, products.length - visibleCount);

  // Auto-slide interval (4.5s) when products > visibleCount and not paused
  useEffect(() => {
    if (products.length <= visibleCount || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [products.length, visibleCount, maxIndex, isPaused]);

  // Adjust currentIndex if window resize lowers maxIndex
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch handlers for mobile swiping
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
      id="deals"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-card border border-border-custom/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm scroll-mt-24"
    >
      {/* ─── Header: Timer & Controls ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-custom/80">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 bg-rose-500 text-white flex items-center justify-center rounded-2xl font-bold shadow-xs shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2.5 py-0.5 rounded-full mb-1">
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
              Today's Flash Sales
            </h2>
            <p className="text-xs text-muted-custom mt-0.5 font-medium">
              Verified marketplace discounts directly from source. Deal ends in:
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 text-foreground font-black">
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Hours</span>
            </div>
            <span className="text-rose-500 font-black text-lg mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Mins</span>
            </div>
            <span className="text-rose-500 font-black text-lg mb-4">:</span>
            <div className="flex flex-col items-center">
              <span className="bg-background-secondary border border-border-custom px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-mono shadow-xs">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-muted-custom font-semibold uppercase mt-1">Secs</span>
            </div>
          </div>

          {/* Carousel Manual Arrows */}
          {products.length > visibleCount && (
            <div className="flex items-center gap-2 pl-2 border-l border-border-custom/80">
              <button
                onClick={handlePrev}
                aria-label="Previous products"
                className="h-10 w-10 rounded-2xl bg-background-secondary hover:bg-rose-500 hover:text-white border border-border-custom flex items-center justify-center transition-all text-foreground shadow-2xs active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next products"
                className="h-10 w-10 rounded-2xl bg-background-secondary hover:bg-rose-500 hover:text-white border border-border-custom flex items-center justify-center transition-all text-foreground shadow-2xs active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Carousel Viewport & Track ─── */}
      <div
        className="overflow-hidden relative pt-2"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentIndex} * (100% + 1.5rem) / ${visibleCount}))`
          }}
        >
          {products.map((prod, idx) => (
            <div
              key={`flash_${prod.id}_${idx}`}
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

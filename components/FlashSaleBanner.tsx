'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiFlashSale } from '../services/promotionService';
import { Zap } from 'lucide-react';

interface FlashSaleBannerProps {
  sale: ApiFlashSale;
}

export function FlashSaleBanner({ sale }: FlashSaleBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-primary text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
      <div className="space-y-2 text-center sm:text-left z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
          <Zap className="w-4 h-4 fill-current text-amber-300" />
          <span>Flash Sale Live Event</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{sale.title}</h2>
        <p className="text-xs font-semibold opacity-90">
          Up to <span className="text-amber-300 font-black text-sm">{sale.discount_percentage}% OFF</span> on top electronics and fashion!
        </p>
      </div>

      <div className="flex items-center gap-4 z-10">
        <div className="flex items-center gap-2 text-center">
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl min-w-[54px]">
            <span className="text-xl font-black block leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-bold opacity-70 block mt-1">Hours</span>
          </div>
          <span className="text-lg font-black">:</span>
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl min-w-[54px]">
            <span className="text-xl font-black block leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-bold opacity-70 block mt-1">Mins</span>
          </div>
          <span className="text-lg font-black">:</span>
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl min-w-[54px]">
            <span className="text-xl font-black block leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase font-bold opacity-70 block mt-1">Secs</span>
          </div>
        </div>

        <Link
          href="/promotions"
          className="px-5 py-3.5 bg-white text-foreground font-extrabold text-xs rounded-2xl hover:bg-white/90 transition-all shadow-md shrink-0"
        >
          Shop Sale Now
        </Link>
      </div>
    </div>
  );
}

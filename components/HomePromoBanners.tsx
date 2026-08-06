'use client';

import React from 'react';
import Link from 'next/link';

interface PromoBanner {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  titleColor: string;
  subtitle: string;
  subtitleColor: string;
  cta: string;
  ctaBg: string;
  href: string;
  image: string;
  bgGradient: string;
}

const banners: PromoBanner[] = [
  {
    id: 'kitchen',
    tag: 'Upgrade Your Home',
    tagColor: '#1e40af',
    title: 'Up to 50% Off',
    titleColor: '#1e3a8a',
    subtitle: 'Wide Range of Home & Kitchen',
    subtitleColor: '#1e40af',
    cta: 'Shop Now →',
    ctaBg: '#2563eb',
    href: '/category/home-kitchen',
    image: '/promo/kitchen.png',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #bae6fd 100%)',
  },
  {
    id: 'beauty',
    tag: 'Beauty Essentials',
    tagColor: '#9f1239',
    title: 'Special Offers',
    titleColor: '#881337',
    subtitle: 'Look Good. Feel Good.',
    subtitleColor: '#9f1239',
    cta: 'Shop Now →',
    ctaBg: '#be123c',
    href: '/category/beauty-personal-care',
    image: '/promo/beauty.png',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #fff1f2 60%, #fbcfe8 100%)',
  },
  {
    id: 'festival',
    tag: 'Festival Deals',
    tagColor: '#92400e',
    title: 'Mega Savings',
    titleColor: '#78350f',
    subtitle: 'Limited Time Offer!',
    subtitleColor: '#92400e',
    cta: 'Shop Now →',
    ctaBg: '#ea580c',
    href: '/search?tag=festival',
    image: '/promo/festival.png',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 60%, #fde68a 100%)',
  },
];

export const HomePromoBanners: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {banners.map((b) => (
        <Link
          key={b.id}
          href={b.href}
          className="relative rounded-2xl overflow-hidden group block h-[165px] sm:h-[175px] border border-black/5 shadow-2xs hover:shadow-md transition-all duration-300"
          style={{ background: b.bgGradient }}
        >
          {/* Right-aligned Transparent PNG Product Cutout (No rectangular box, 48% width) */}
          <div className="absolute right-0 bottom-0 top-0 w-[48%] h-full p-1.5 flex items-end justify-end z-0 pointer-events-none overflow-hidden">
            <img
              src={b.image}
              alt={b.title}
              className="w-full h-[96%] object-contain object-right-bottom group-hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
            />
          </div>

          {/* Left Text Overlay Container */}
          <div className="relative z-10 h-full w-[62%] p-4 sm:p-4.5 flex flex-col justify-between bg-gradient-to-r from-white/90 via-white/60 to-transparent">
            {/* Tag / Category Label */}
            <span
              className="text-[11px] sm:text-xs font-bold tracking-tight block"
              style={{ color: b.tagColor }}
            >
              {b.tag}
            </span>

            {/* Main Title & Subtitle */}
            <div className="my-auto py-1">
              <h3
                className="font-black text-base sm:text-lg leading-tight tracking-tight"
                style={{ color: b.titleColor }}
              >
                {b.title}
              </h3>
              <p
                className="text-[11px] sm:text-xs font-semibold mt-0.5 line-clamp-1"
                style={{ color: b.subtitleColor }}
              >
                {b.subtitle}
              </p>
            </div>

            {/* Solid Pill CTA Button */}
            <div>
              <span
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-xl text-white shadow-xs group-hover:shadow-sm group-hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: b.ctaBg }}
              >
                {b.cta}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

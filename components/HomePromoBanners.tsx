'use client';

import React from 'react';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';
import { useLanguage } from '../contexts/LanguageContext';

interface PromoBanner {
  id: string;
  tagKey: string;
  tagDefault: string;
  tagColor: string;
  titleKey: string;
  titleDefault: string;
  titleColor: string;
  subtitleKey: string;
  subtitleDefault: string;
  subtitleColor: string;
  ctaKey: string;
  ctaDefault: string;
  ctaBg: string;
  href: string;
  image: string;
  bgGradient: string;
}

const banners: PromoBanner[] = [
  // ─── Card 1: Agriculture & Seeds ───
  {
    id: 'agriculture',
    tagKey: 'promo.agri_tag',
    tagDefault: 'Farm Fresh & Seeds',
    tagColor: '#166534',
    titleKey: 'promo.agri_title',
    titleDefault: 'Agriculture & Seeds',
    titleColor: '#064e3b',
    subtitleKey: 'promo.agri_sub',
    subtitleDefault: 'Best Quality • Direct Supply',
    subtitleColor: '#14532d',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#15803d',
    href: '/category/agriculture-seeds',
    image: '/promo/agriculture.png',
    bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 60%, #c8e6c9 100%)',
  },
  // ─── Card 2: Home & Kitchen ───
  {
    id: 'kitchen',
    tagKey: 'promo.kitchen_tag',
    tagDefault: 'Upgrade Your Home',
    tagColor: '#1e40af',
    titleKey: 'promo.kitchen_title',
    titleDefault: 'Up to 50% Off',
    titleColor: '#1e3a8a',
    subtitleKey: 'promo.kitchen_sub',
    subtitleDefault: 'Wide Range of Kitchen',
    subtitleColor: '#1e40af',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#2563eb',
    href: '/category/home-kitchen',
    image: '/promo/kitchen.png',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #bae6fd 100%)',
  },
  // ─── Card 3: Beauty Essentials ───
  {
    id: 'beauty',
    tagKey: 'promo.beauty_tag',
    tagDefault: 'Beauty Essentials',
    tagColor: '#9f1239',
    titleKey: 'promo.beauty_title',
    titleDefault: 'Special Offers',
    titleColor: '#881337',
    subtitleKey: 'promo.beauty_sub',
    subtitleDefault: 'Look Good. Feel Good.',
    subtitleColor: '#9f1239',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#be123c',
    href: '/category/beauty-personal-care',
    image: '/promo/beauty.png',
    bgGradient: 'linear-gradient(135deg, #fce7f3 0%, #fff1f2 60%, #fbcfe8 100%)',
  },
  // ─── Card 4: Festival Deals ───
  {
    id: 'festival',
    tagKey: 'promo.festival_tag',
    tagDefault: 'Festival Deals',
    tagColor: '#92400e',
    titleKey: 'promo.festival_title',
    titleDefault: 'Mega Savings',
    titleColor: '#78350f',
    subtitleKey: 'promo.festival_sub',
    subtitleDefault: 'Limited Time Offer!',
    subtitleColor: '#92400e',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#ea580c',
    href: '/search?tag=festival',
    image: '/promo/festival.png',
    bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 60%, #fde68a 100%)',
  },
  // ─── Card 5: Under ₹99 ───
  {
    id: 'under99',
    tagKey: 'promo.under99_tag',
    tagDefault: 'Budget Store',
    tagColor: '#0369a1',
    titleKey: 'promo.under99_title',
    titleDefault: 'Under ₹99',
    titleColor: '#0284c7',
    subtitleKey: 'promo.under99_sub',
    subtitleDefault: 'Starting at ₹99',
    subtitleColor: '#075985',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#0284c7',
    href: '/offers/under-99',
    image: '/promo/under99.jpg',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #bae6fd 100%)',
  },
  // ─── Card 6: Flat 80% Off ───
  {
    id: 'flat80',
    tagKey: 'promo.flat80_tag',
    tagDefault: 'Mega Clearance',
    tagColor: '#15803d',
    titleKey: 'promo.flat80_title',
    titleDefault: 'Flat 80% Off',
    titleColor: '#16a34a',
    subtitleKey: 'promo.flat80_sub',
    subtitleDefault: 'Top Product Deals',
    subtitleColor: '#166534',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#16a34a',
    href: '/offers/flat-80-off',
    image: '/promo/flat80.jpg',
    bgGradient: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 60%, #bbf7d0 100%)',
  },
  // ─── Card 7: Under ₹299 ───
  {
    id: 'under299',
    tagKey: 'promo.under299_tag',
    tagDefault: 'Value Deals',
    tagColor: '#be123c',
    titleKey: 'promo.under299_title',
    titleDefault: 'Under ₹299',
    titleColor: '#e11d48',
    subtitleKey: 'promo.under299_sub',
    subtitleDefault: 'Deals Under ₹299',
    subtitleColor: '#9f1239',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#e11d48',
    href: '/offers/under-299',
    image: '/promo/under299.jpg',
    bgGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 60%, #fecdd3 100%)',
  },
  // ─── Card 8: Under ₹399 ───
  {
    id: 'under399',
    tagKey: 'promo.under399_tag',
    tagDefault: 'Premium Picks',
    tagColor: '#6b21a8',
    titleKey: 'promo.under399_title',
    titleDefault: 'Under ₹399',
    titleColor: '#7c3aed',
    subtitleKey: 'promo.under399_sub',
    subtitleDefault: 'Picks Under ₹399',
    subtitleColor: '#581c87',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#7c3aed',
    href: '/offers/under-399',
    image: '/promo/under399.jpg',
    bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 60%, #e9d5ff 100%)',
  },
];

export const HomePromoBanners: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 items-stretch">
      {banners.map((b) => {
        const tag = t(b.tagKey) || b.tagDefault;
        const title = t(b.titleKey) || b.titleDefault;
        const subtitle = t(b.subtitleKey) || b.subtitleDefault;
        const cta = t(b.ctaKey) || b.ctaDefault;

        return (
          <Link
            key={b.id}
            href={b.href}
            className="relative rounded-2xl overflow-hidden group flex flex-col justify-between h-[270px] sm:h-[280px] lg:h-[290px] border border-black/5 shadow-2xs hover:shadow-md transition-all duration-300 p-3.5 sm:p-4"
            style={{ background: b.bgGradient }}
          >
            {/* Top Text Header: Tag, Title, Subtitle (Enlarged & Bold) */}
            <div className="space-y-1 z-10">
              {/* Tag / Category Label */}
              <span
                className="text-[11px] sm:text-xs font-black tracking-wide uppercase block truncate"
                style={{ color: b.tagColor }}
              >
                {tag}
              </span>

              {/* Main Title */}
              <h3
                className="font-black text-base sm:text-lg lg:text-[16px] xl:text-[18px] leading-tight tracking-tight truncate"
                style={{ color: b.titleColor }}
              >
                {title}
              </h3>

              {/* Subtitle */}
              <p
                className="text-[11px] sm:text-xs font-bold leading-tight truncate"
                style={{ color: b.subtitleColor }}
              >
                {subtitle}
              </p>
            </div>

            {/* Middle Large Product Cutout Visual */}
            <div className="w-full flex-1 flex items-center justify-center relative overflow-hidden z-0 pointer-events-none py-1.5 px-0.5 my-1">
              <div className="relative w-full h-full max-h-[125px] sm:max-h-[135px] lg:max-h-[145px]">
                <OptimizedImage
                  src={b.image}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md"
                />
              </div>
            </div>

            {/* Bottom Compact CTA Pill Button */}
            <div className="mt-auto pt-1.5 z-10 w-full">
              <span
                className="inline-flex items-center justify-center text-xs sm:text-[13px] font-black py-2.5 px-3 rounded-xl text-white shadow-xs group-hover:shadow-md group-hover:scale-[1.03] transition-all duration-300 w-full text-center leading-tight"
                style={{ backgroundColor: b.ctaBg }}
              >
                {cta}
              </span>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

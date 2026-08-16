'use client';

import React from 'react';
import Link from 'next/link';
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
  // ─── Existing 4 Cards (Preserved Exactly) ───
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
  {
    id: 'kitchen',
    tagKey: 'promo.kitchen_tag',
    tagDefault: 'Upgrade Your Home',
    tagColor: '#1e40af',
    titleKey: 'promo.kitchen_title',
    titleDefault: 'Up to 50% Off',
    titleColor: '#1e3a8a',
    subtitleKey: 'promo.kitchen_sub',
    subtitleDefault: 'Wide Range of Home & Kitchen',
    subtitleColor: '#1e40af',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#2563eb',
    href: '/category/home-kitchen',
    image: '/promo/kitchen.png',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #bae6fd 100%)',
  },
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

  // ─── New 4 Cards (Reference-Inspired: Under ₹99, Flat 80%, Under ₹299, Under ₹399) ───
  {
    id: 'under99',
    tagKey: 'promo.under99_tag',
    tagDefault: 'Budget Store',
    tagColor: '#0369a1',
    titleKey: 'promo.under99_title',
    titleDefault: 'Under ₹99',
    titleColor: '#0284c7',
    subtitleKey: 'promo.under99_sub',
    subtitleDefault: 'Great Products Starting at ₹99',
    subtitleColor: '#075985',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#0284c7',
    href: '/search?max_price=99',
    image: '/promo/under99.jpg',
    bgGradient: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 60%, #bae6fd 100%)',
  },
  {
    id: 'flat80',
    tagKey: 'promo.flat80_tag',
    tagDefault: 'Mega Clearance',
    tagColor: '#15803d',
    titleKey: 'promo.flat80_title',
    titleDefault: 'Flat 80% Off',
    titleColor: '#16a34a',
    subtitleKey: 'promo.flat80_sub',
    subtitleDefault: 'Biggest Discounts On Top Products',
    subtitleColor: '#166534',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#16a34a',
    href: '/promotions',
    image: '/promo/flat80.jpg',
    bgGradient: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 60%, #bbf7d0 100%)',
  },
  {
    id: 'under299',
    tagKey: 'promo.under299_tag',
    tagDefault: 'Value Deals',
    tagColor: '#be123c',
    titleKey: 'promo.under299_title',
    titleDefault: 'Under ₹299',
    titleColor: '#e11d48',
    subtitleKey: 'promo.under299_sub',
    subtitleDefault: 'Best Deals Under ₹299',
    subtitleColor: '#9f1239',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#e11d48',
    href: '/search?max_price=299',
    image: '/promo/under299.jpg',
    bgGradient: 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 60%, #fecdd3 100%)',
  },
  {
    id: 'under399',
    tagKey: 'promo.under399_tag',
    tagDefault: 'Premium Picks',
    tagColor: '#6b21a8',
    titleKey: 'promo.under399_title',
    titleDefault: 'Under ₹399',
    titleColor: '#7c3aed',
    subtitleKey: 'promo.under399_sub',
    subtitleDefault: 'Premium Picks Under ₹399',
    subtitleColor: '#581c87',
    ctaKey: 'promo.shop_now',
    ctaDefault: 'Shop Now →',
    ctaBg: '#7c3aed',
    href: '/search?max_price=399',
    image: '/promo/under399.jpg',
    bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #faf5ff 60%, #e9d5ff 100%)',
  },
];

export const HomePromoBanners: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {banners.map((b) => {
        const tag = t(b.tagKey) || b.tagDefault;
        const title = t(b.titleKey) || b.titleDefault;
        const subtitle = t(b.subtitleKey) || b.subtitleDefault;
        const cta = t(b.ctaKey) || b.ctaDefault;

        return (
          <Link
            key={b.id}
            href={b.href}
            className="relative rounded-2xl overflow-hidden group block h-[165px] sm:h-[175px] border border-black/5 shadow-2xs hover:shadow-md transition-all duration-300"
            style={{ background: b.bgGradient }}
          >
            {/* Right-aligned Transparent/Cutout Product Image (No rectangular box, 48% width) */}
            <div className="absolute right-0 bottom-0 top-0 w-[48%] h-full p-1.5 flex items-end justify-end z-0 pointer-events-none overflow-hidden">
              <img
                src={b.image}
                alt={title}
                className="w-full h-[96%] object-contain object-right-bottom group-hover:scale-105 transition-transform duration-500 filter drop-shadow-sm"
                loading="lazy"
              />
            </div>

            {/* Left Text Overlay Container */}
            <div className="relative z-10 h-full w-[62%] p-4 sm:p-4.5 flex flex-col justify-between bg-gradient-to-r from-white/90 via-white/60 to-transparent">
              {/* Tag / Category Label */}
              <span
                className="text-[11px] sm:text-xs font-bold tracking-tight block"
                style={{ color: b.tagColor }}
              >
                {tag}
              </span>

              {/* Main Title & Subtitle */}
              <div className="my-auto py-1">
                <h3
                  className="font-black text-base sm:text-lg leading-tight tracking-tight"
                  style={{ color: b.titleColor }}
                >
                  {title}
                </h3>
                <p
                  className="text-[11px] sm:text-xs font-semibold mt-0.5 line-clamp-1"
                  style={{ color: b.subtitleColor }}
                >
                  {subtitle}
                </p>
              </div>

              {/* Solid Pill CTA Button */}
              <div>
                <span
                  className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-xl text-white shadow-xs group-hover:shadow-sm group-hover:scale-105 transition-all duration-300"
                  style={{ backgroundColor: b.ctaBg }}
                >
                  {cta}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
};

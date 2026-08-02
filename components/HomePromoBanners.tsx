'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PromoBanner {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  titleColor: string;
  subtitle: string;
  cta: string;
  ctaColor: string;
  ctaBg: string;
  href: string;
  image: string;
  bgFrom: string;
  bgTo: string;
}

const banners: PromoBanner[] = [
  {
    id: 'agriculture',
    tag: 'Farm Fresh',
    tagColor: '#16a34a',
    title: 'Agriculture Tools',
    titleColor: '#0f172a',
    subtitle: 'Best Quality • Best Price',
    cta: 'Shop Now →',
    ctaColor: '#ffffff',
    ctaBg: '#16a34a',
    href: '/category/agriculture',
    image: '/promo-agriculture.jpg',
    bgFrom: '#d1fae5',
    bgTo: '#a7f3d0',
  },
  {
    id: 'kitchen',
    tag: 'Upgrade Your Home',
    tagColor: '#1d4ed8',
    title: 'Up to 50% Off',
    titleColor: '#0f172a',
    subtitle: 'Wide Range of Home & Kitchen',
    cta: 'Shop Now →',
    ctaColor: '#ffffff',
    ctaBg: '#1d4ed8',
    href: '/category/home-kitchen',
    image: '/promo-kitchen.jpg',
    bgFrom: '#dbeafe',
    bgTo: '#bfdbfe',
  },
  {
    id: 'beauty',
    tag: 'Beauty Essentials',
    tagColor: '#be185d',
    title: 'Special Offers',
    titleColor: '#0f172a',
    subtitle: 'Look Good. Feel Good.',
    cta: 'Shop Now →',
    ctaColor: '#ffffff',
    ctaBg: '#be185d',
    href: '/category/beauty-personal-care',
    image: '/promo-beauty.jpg',
    bgFrom: '#fce7f3',
    bgTo: '#fbcfe8',
  },
  {
    id: 'festival',
    tag: 'Festival Deals',
    tagColor: '#b45309',
    title: 'Mega Savings',
    titleColor: '#0f172a',
    subtitle: 'Limited Time Offer!',
    cta: 'Shop Now →',
    ctaColor: '#ffffff',
    ctaBg: '#f59e0b',
    href: '/search?tag=festival',
    image: '/promo-festival.jpg',
    bgFrom: '#fef3c7',
    bgTo: '#fde68a',
  },
];

export const HomePromoBanners: React.FC = () => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {banners.map((b) => (
        <Link
          key={b.id}
          href={b.href}
          className="relative rounded-2xl overflow-hidden group block h-[180px] sm:h-[200px] hover:shadow-lg transition-all duration-300"
          style={{ background: `linear-gradient(135deg, ${b.bgFrom}, ${b.bgTo})` }}
        >
          {/* Background product image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 group-hover:opacity-70 transition-opacity duration-300"
            style={{ backgroundImage: `url(${b.image})` }}
          />

          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            {/* Top: Tag */}
            <span
              className="text-[11px] font-bold uppercase tracking-wide w-fit"
              style={{ color: b.tagColor }}
            >
              {b.tag}
            </span>

            {/* Bottom: Title, subtitle, CTA */}
            <div className="space-y-1">
              <h3 className="font-black text-base sm:text-lg leading-tight text-gray-900 drop-shadow-sm">
                {b.title}
              </h3>
              <p className="text-xs text-gray-700 font-medium">{b.subtitle}</p>
              <button
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all group-hover:scale-105"
                style={{ background: b.ctaBg, color: b.ctaColor }}
              >
                {b.cta}
              </button>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

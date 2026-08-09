'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface FooterPageLayoutProps {
  title: string;
  subtitle: string;
  categoryName?: string;
  children: React.ReactNode;
}

export const FooterPageLayout: React.FC<FooterPageLayoutProps> = ({
  title,
  subtitle,
  categoryName = 'Marketplace',
  children
}) => {
  return (
    <div className="space-y-8 pb-12 transition-colors">
      {/* Hero / Header Banner */}
      <div className="bg-[#0B132B] text-white py-10 px-6 sm:px-8 rounded-3xl border border-slate-800 shadow-xl">
        <div className="max-w-4xl space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={13} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-300">{categoryName}</span>
            <ChevronRight size={12} />
            <span className="text-primary font-bold">{title}</span>
          </nav>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChevronRight, Home, HelpCircle } from 'lucide-react';

interface FooterPageLayoutProps {
  title: string;
  subtitle: string;
  categoryName?: string;
  children: React.ReactNode;
}

export const FooterPageLayout: React.FC<FooterPageLayoutProps> = ({
  title,
  subtitle,
  categoryName = 'Public Portal',
  children
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Header />

      {/* Hero / Header Banner */}
      <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 md:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
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
          <p className="text-sm text-slate-300 max-w-2xl font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

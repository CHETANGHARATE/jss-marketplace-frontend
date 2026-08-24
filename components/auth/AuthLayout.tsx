'use client';

import React from 'react';
import { AuthBrandPanel } from './AuthBrandPanel';
import { AuthCard } from './AuthCard';

interface AuthLayoutProps {
  initialMode?: 'login' | 'signup';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ initialMode = 'login' }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
      {/* SINGLE UNIFIED AUTHENTICATION CARD */}
      <div className="w-full max-w-5xl bg-card rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border-custom/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[640px]">
        
        {/* LEFT BRAND PANEL (50% / 6 cols on desktop) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-50/90 via-blue-50/30 to-indigo-50/20 p-8 xl:p-10 flex-col justify-between border-r border-border-custom/80 relative overflow-hidden">
          <AuthBrandPanel />
        </div>

        {/* RIGHT AUTHENTICATION FORM (50% / 6 cols on desktop, full on mobile) */}
        <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center bg-card">
          <AuthCard initialMode={initialMode} />
        </div>

      </div>
    </div>
  );
};

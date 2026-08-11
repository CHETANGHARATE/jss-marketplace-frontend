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
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch min-h-[680px]">
        
        {/* DESKTOP LEFT PROMOTIONAL PANEL (Approx 58% width / 7 cols) */}
        <div className="hidden lg:block lg:col-span-7 h-full">
          <AuthBrandPanel />
        </div>

        {/* DESKTOP RIGHT / MOBILE AUTHENTICATION CARD (Approx 42% width / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full">
          <AuthCard initialMode={initialMode} />
        </div>

      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 focus:outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
};

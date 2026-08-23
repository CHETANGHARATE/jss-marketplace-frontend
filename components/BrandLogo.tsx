'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  href?: string;
  variant?: 'header' | 'footer' | 'auth' | 'admin' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  href = '/',
  variant = 'header',
  size = 'md',
  showSlogan = true,
  className = '',
  onClick,
}) => {
  // Logo image dimension sizing
  const imgSizeMap = {
    sm: { width: 38, height: 38, class: 'w-9 h-9 sm:w-10 sm:h-10' },
    md: { width: 48, height: 48, class: 'w-11 h-11 sm:w-12 sm:h-12' },
    lg: { width: 64, height: 64, class: 'w-14 h-14 sm:w-16 sm:h-16' },
  };

  const currentSize = imgSizeMap[size];

  const logoImage = (
    <div className={`relative ${currentSize.class} shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
      <img
        src="/logo.png"
        alt="JSS Solutions Marketplace - India Shops Here"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon-only') {
    if (href) {
      return (
        <Link href={href} onClick={onClick} className={`inline-flex items-center group ${className}`}>
          {logoImage}
        </Link>
      );
    }
    return <div className={`inline-flex items-center group ${className}`}>{logoImage}</div>;
  }

  // Variant-specific text typography & color styling
  const isFooter = variant === 'footer';
  const isAuth = variant === 'auth';
  const isAdmin = variant === 'admin';

  const brandText = (
    <div className="flex flex-col leading-tight">
      <div className="flex items-baseline gap-1">
        <span
          className={`font-black tracking-tight ${
            isFooter || isAuth
              ? 'text-white text-xl sm:text-2xl'
              : isAdmin
              ? 'text-foreground text-lg sm:text-xl'
              : 'text-foreground text-lg sm:text-xl'
          }`}
        >
          JSS<span className={isFooter ? 'text-primary-light' : 'text-primary'}>Solutions</span>
        </span>
      </div>

      {showSlogan && (
        <span
          className={`text-[11px] sm:text-[12px] font-extrabold tracking-wide ${
            isFooter
              ? 'text-slate-300'
              : isAuth
              ? 'text-blue-200'
              : 'text-muted-custom'
          }`}
        >
          India Shops Here
        </span>
      )}
    </div>
  );

  const content = (
    <div className={`flex items-center gap-1.5 sm:gap-2 group shrink-0 ${className}`}>
      {logoImage}
      {brandText}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};

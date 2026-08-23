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
    sm: { width: 44, height: 44, class: 'w-10 h-10 sm:w-11 sm:h-11' },
    md: { width: 56, height: 56, class: 'w-12 h-12 sm:w-[54px] sm:h-[54px]' },
    lg: { width: 72, height: 72, class: 'w-16 h-16 sm:w-20 sm:h-20' },
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
              ? 'text-white text-lg sm:text-xl'
              : isAdmin
              ? 'text-foreground text-base sm:text-lg'
              : 'text-foreground text-base sm:text-lg'
          }`}
        >
          JSS<span className={isFooter ? 'text-primary-light' : 'text-primary'}>Solutions</span>
        </span>
      </div>

      {showSlogan && (
        <span
          className={`text-[10px] sm:text-[11px] font-extrabold tracking-wide ${
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
    <div className={`flex items-center gap-2.5 sm:gap-3 group shrink-0 ${className}`}>
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

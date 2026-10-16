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
  // Logo image dimension sizing (increased slightly for enhanced visual prominence)
  const imgSizeMap = {
    sm: { width: 44, height: 44, class: 'w-10 h-10 sm:w-11 sm:h-11' },
    md: { width: 56, height: 56, class: 'w-12 h-12 sm:w-14 sm:h-14' },
    lg: { width: 76, height: 76, class: 'w-16 h-16 sm:w-[76px] sm:h-[76px]' },
  };

  const currentSize = imgSizeMap[size];

  const logoImage = (
    <div className={`relative ${currentSize.class} shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
      <img
        src="/logo.png"
        alt="JDS Mart - India Shops Here"
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

  // Responsive font sizes keyed by size prop to keep proportional balance with the increased logo
  const titleFontSize =
    size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'sm'
      ? 'text-base sm:text-lg'
      : isFooter || isAuth
      ? 'text-xl sm:text-2xl'
      : isAdmin
      ? 'text-lg sm:text-xl'
      : 'text-xl sm:text-2xl';

  const sloganFontSize =
    size === 'lg'
      ? 'text-xs sm:text-sm'
      : size === 'sm'
      ? 'text-[10px] sm:text-[11px]'
      : 'text-[11px] sm:text-[12.5px]';

  const brandText = (
    <div className="flex flex-col leading-tight">
      <div className="flex items-baseline gap-1">
        <span
          className={`font-black tracking-tight ${titleFontSize} ${
            isFooter || isAuth
              ? 'text-white'
              : isAdmin
              ? 'text-foreground'
              : 'text-foreground'
          }`}
        >
          JDS<span className={isFooter ? 'text-primary-light' : 'text-primary'}>Mart</span>
        </span>
      </div>

      {showSlogan && (
        <span
          className={`${sloganFontSize} font-extrabold tracking-wide ${
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

'use client';

import React from 'react';
import { OptimizedImage } from './OptimizedImage';

interface ProductImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  imageVariants?: Record<string, string | undefined>;
  priority?: boolean;
}

export const ProductImageFrame: React.FC<ProductImageFrameProps> = ({
  src,
  alt,
  className = '',
  children,
  onClick,
  imageVariants,
  priority = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full h-[150px] sm:h-[175px] md:h-[185px] bg-[#ECEFF3] dark:bg-slate-900/40 rounded-t-[16px] overflow-hidden relative shrink-0 cursor-pointer border-b border-border-custom/60 ${className}`}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        variant="card"
        imageVariants={imageVariants}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        priority={priority}
        className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 select-none"
      />
      {children}
    </div>
  );
};


'use client';

import React from 'react';

interface ProductImageFrameProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const ProductImageFrame: React.FC<ProductImageFrameProps> = ({
  src,
  alt,
  className = '',
  children,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full h-[150px] sm:h-[175px] md:h-[185px] bg-[#ECEFF3] dark:bg-slate-900/40 rounded-t-[16px] overflow-hidden relative shrink-0 cursor-pointer border-b border-border-custom/60 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 select-none"
        loading="lazy"
      />
      {children}
    </div>
  );
};

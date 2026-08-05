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
      className={`w-full h-[180px] sm:h-[220px] md:h-[260px] bg-[#F8F8F8] dark:bg-slate-900/40 rounded-[12px] p-4 flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer border-b border-border-custom/60 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-300 ease-out group-hover:scale-[1.03] select-none"
        loading="lazy"
      />
      {children}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'placeholder'> {
  src: string | undefined | null;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  variant?: 'thumb' | 'card' | 'listing' | 'detail' | 'zoom' | 'original';
  imageVariants?: Record<string, string | undefined>;
}

// Light shimmer SVG placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f5f9" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f1f5f9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f1f5f9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc = '/placeholder-product.png',
  alt,
  className = '',
  variant,
  imageVariants,
  fill = true,
  width,
  height,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 85,
  ...rest
}) => {
  // Determine optimal URL based on requested variant if available
  let resolvedSrc = src;
  if (variant && imageVariants && imageVariants[variant]) {
    resolvedSrc = imageVariants[variant];
  } else if (!resolvedSrc) {
    resolvedSrc = fallbackSrc;
  }

  const [imgSrc, setImgSrc] = useState<string>(resolvedSrc || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state if src prop changes
  React.useEffect(() => {
    let newSrc = src;
    if (variant && imageVariants && imageVariants[variant]) {
      newSrc = imageVariants[variant];
    }
    setImgSrc(newSrc || fallbackSrc);
    setHasError(false);
  }, [src, variant, imageVariants, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const isDataOrBlob = imgSrc.startsWith('data:') || imgSrc.startsWith('blob:');

  // If using data URI or blob, render standard img to avoid Next.js Image loader issues
  if (isDataOrBlob) {
    return (
      <img
        src={imgSrc}
        alt={alt || 'Image'}
        className={`${className} ${isLoading ? 'blur-xs' : 'blur-0 transition-all duration-300'}`}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width ? Number(width) : 700, height ? Number(height) : 475))}`;

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt || 'Image'}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`${className} ${isLoading ? 'scale-102 blur-xs' : 'scale-100 blur-0 transition-all duration-300'}`}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Image'}
      width={width || 500}
      height={height || 500}
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={blurDataURL}
      className={`${className} ${isLoading ? 'scale-102 blur-xs' : 'scale-100 blur-0 transition-all duration-300'}`}
      onError={handleError}
      onLoad={() => setIsLoading(false)}
      {...rest}
    />
  );
};

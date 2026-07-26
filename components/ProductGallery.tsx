'use client';

import React, { useState } from 'react';
import { ZoomIn, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images?: string[];
  name: string;
}

export function ProductGallery({ images = [], name }: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : ['/placeholder-product.png'];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      {/* Main Showcase Image Container */}
      <div className="relative aspect-square w-full rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-border-custom/80 p-6 sm:p-8 overflow-hidden shadow-2xs group flex items-center justify-center">
        <img
          src={imageList[selectedIndex]}
          alt={`${name} image ${selectedIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2.5 bg-card/90 backdrop-blur-md rounded-2xl text-foreground/70 hover:text-primary border border-border-custom/80 transition-all shadow-2xs"
          title="Toggle Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail Bar */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative h-20 w-20 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 p-2 overflow-hidden transition-all shadow-2xs ${
                selectedIndex === idx
                  ? 'border-primary shadow-sm scale-95'
                  : 'border-border-custom/60 opacity-70 hover:opacity-100 hover:border-primary/50'
              }`}
            >
              <img src={imgUrl} alt={`${name} thumb ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

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
      <div className="relative aspect-square w-full rounded-3xl bg-card border border-border/40 p-6 overflow-hidden shadow-sm group">
        <img
          src={imageList[selectedIndex]}
          alt={`${name} image ${selectedIndex + 1}`}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md rounded-xl text-foreground/70 hover:text-primary transition-colors shadow-sm"
          title="Toggle Zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative h-20 w-20 shrink-0 rounded-2xl bg-card border-2 p-2 overflow-hidden transition-all ${
                selectedIndex === idx
                  ? 'border-primary shadow-md scale-95'
                  : 'border-border/40 opacity-70 hover:opacity-100 hover:border-primary/50'
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

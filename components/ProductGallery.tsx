'use client';

import React, { useState, useRef } from 'react';
import { ZoomIn, Maximize2, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductGalleryProps {
  images?: string[];
  name: string;
}

export function ProductGallery({ images = [], name }: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : ['/placeholder-product.png'];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; show: boolean }>({
    x: 50,
    y: 50,
    show: false,
  });

  const mainImageRef = useRef<HTMLDivElement>(null);

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % imageList.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Thumbnail Bar (Vertical on MD+, Horizontal on Mobile) */}
      {imageList.length > 1 && (
        <div className="flex md:flex-col items-center gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20 shrink-0 pb-2 md:pb-0 max-h-[460px] no-scrollbar order-2 md:order-1">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-18 w-18 md:h-20 md:w-20 shrink-0 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border-2 p-2 overflow-hidden transition-all shadow-2xs ${
                selectedIndex === idx
                  ? 'border-primary shadow-md scale-95 ring-2 ring-primary/20'
                  : 'border-border-custom/60 opacity-70 hover:opacity-100 hover:border-primary/50'
              }`}
            >
              <img src={imgUrl} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Main Showcase Image Container */}
      <div className="relative flex-1 aspect-square w-full rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-border-custom/80 p-6 sm:p-8 overflow-hidden shadow-sm group flex items-center justify-center order-1 md:order-2">
        <div
          ref={mainImageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
          className="w-full h-full flex items-center justify-center cursor-zoom-in relative overflow-hidden"
        >
          <img
            src={imageList[selectedIndex]}
            alt={`${name} image ${selectedIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-transform duration-200 ${
              zoomPos.show ? 'scale-150' : 'group-hover:scale-105'
            }`}
            style={
              zoomPos.show
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>

        {/* Gallery Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/80 backdrop-blur-md text-foreground/80 hover:text-primary hover:bg-card border border-border-custom shadow-md transition-all opacity-0 group-hover:opacity-100 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/80 backdrop-blur-md text-foreground/80 hover:text-primary hover:bg-card border border-border-custom shadow-md transition-all opacity-0 group-hover:opacity-100 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Fullscreen / Lightbox Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 bg-card/90 backdrop-blur-md rounded-2xl text-foreground/70 hover:text-primary border border-border-custom/80 transition-all shadow-2xs hover:scale-105"
          title="Fullscreen View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image Counter Badge */}
        {imageList.length > 1 && (
          <span className="absolute bottom-4 left-4 text-[10px] font-black bg-slate-950/75 backdrop-blur-md text-white px-3 py-1 rounded-full shadow-xs">
            {selectedIndex + 1} / {imageList.length}
          </span>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={imageList[selectedIndex]}
              alt={name}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

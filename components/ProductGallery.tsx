'use client';

import React, { useState, useRef } from 'react';
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Award,
  Lock,
  CheckCircle2,
  PlayCircle,
  Gem,
  Heart
} from 'lucide-react';
import { useCartWishlist } from '../contexts/CartWishlistContext';

interface ProductGalleryProps {
  images?: string[];
  name: string;
  discountPercent?: number;
  videoUrl?: string;
  pdfUrl?: string;
  productId?: string;
}

export function ProductGallery({
  images = [],
  name,
  discountPercent = 0,
  videoUrl,
  pdfUrl,
  productId = ''
}: ProductGalleryProps) {
  const imageList = images.length > 0 ? images : ['/placeholder-product.png'];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; show: boolean }>({
    x: 50,
    y: 50,
    show: false,
  });

  const { wishlist, toggleWishlist } = useCartWishlist();
  const isWishlisted = productId ? wishlist.some((item) => String(item.id) === String(productId)) : false;

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

  const maxThumbnails = 5;
  const visibleThumbnails = imageList.slice(0, maxThumbnails);
  const remainingCount = imageList.length - maxThumbnails;

  return (
    <div className="space-y-4">

      {/* Hero Main Showcase Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-white dark:bg-slate-900 border border-border-custom/80 p-2 sm:p-3 overflow-hidden shadow-xs group flex items-center justify-center">
        
        {/* Top-Left Discount Ribbon Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-xs px-3.5 py-1.5 rounded-br-2xl rounded-tl-2xl shadow-md uppercase tracking-wider flex items-center gap-1">
            <span>{discountPercent}% OFF</span>
          </div>
        )}

        {/* Top-Right Action Buttons: Wishlist & Fullscreen */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {productId && (
            <button
              onClick={() => toggleWishlist({ id: productId, name } as any)}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-xs ${
                isWishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-card/90 text-foreground/80 hover:text-rose-500 border border-border-custom/80'
              }`}
              title="Add to Wishlist"
            >
              <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          )}

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-2.5 bg-card/90 backdrop-blur-md rounded-2xl text-foreground/80 hover:text-primary border border-border-custom/80 transition-all shadow-xs hover:scale-105"
            title="Fullscreen View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Authenticity Tag */}
        <div className="absolute bottom-4 left-4 z-20 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 size={13} />
          <span>100% Authentic</span>
        </div>

        {/* Main Lens-Zoom Image View */}
        <div
          ref={mainImageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
          className="w-full h-full flex items-center justify-center cursor-zoom-in relative overflow-hidden rounded-xl bg-white dark:bg-slate-950"
        >
          <img
            src={imageList[selectedIndex]}
            alt={`${name} image ${selectedIndex + 1}`}
            className={`w-full h-full object-cover rounded-xl transition-transform duration-200 ${
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

        {/* Navigation Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-card/80 backdrop-blur-md text-foreground/80 hover:text-primary hover:bg-card border border-border-custom shadow-md transition-all opacity-0 group-hover:opacity-100 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-card/80 backdrop-blur-md text-foreground/80 hover:text-primary hover:bg-card border border-border-custom shadow-md transition-all opacity-0 group-hover:opacity-100 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Horizontal Thumbnail Bar (64-76px rounded 10-12px) */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {visibleThumbnails.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl bg-white dark:bg-slate-900 border-2 p-1 overflow-hidden transition-all shadow-2xs ${
                selectedIndex === idx
                  ? 'border-primary shadow-md scale-95 ring-2 ring-primary/20'
                  : 'border-border-custom/60 opacity-70 hover:opacity-100 hover:border-primary/50'
              }`}
            >
              <img src={imgUrl} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
            </button>
          ))}

          {/* Overflow +X Thumbnail Button */}
          {remainingCount > 0 && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl bg-slate-900 text-white border-2 border-slate-800 p-1 flex flex-col items-center justify-center hover:border-primary transition-all font-black text-xs"
            >
              <span>+{remainingCount}</span>
              <span className="text-[9px] text-slate-400 font-medium">More</span>
            </button>
          )}

          {videoUrl && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="relative h-16 w-16 sm:h-18 sm:w-18 shrink-0 rounded-xl bg-slate-900 text-white border-2 border-slate-800 p-1 flex flex-col items-center justify-center gap-0.5 hover:border-primary transition-all"
            >
              <PlayCircle size={20} className="text-primary" />
              <span className="text-[9px] font-black uppercase">Video</span>
            </button>
          )}
        </div>
      )}

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

          {/* Image Counter Badge */}
          <div className="absolute top-6 left-6 text-xs font-black text-white bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
            {selectedIndex + 1} / {imageList.length}
          </div>

          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4">
            <img
              src={imageList[selectedIndex]}
              alt={name}
              className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl rounded-2xl"
            />

            {/* Lightbox Bottom Thumbnail Bar */}
            {imageList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full p-2 bg-black/50 backdrop-blur-md rounded-2xl">
                {imageList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-12 w-12 rounded-lg border-2 overflow-hidden shrink-0 ${
                      selectedIndex === idx ? 'border-primary scale-105' : 'border-transparent opacity-50'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

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

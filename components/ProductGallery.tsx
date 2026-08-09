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
  Gem
} from 'lucide-react';

interface ProductGalleryProps {
  images?: string[];
  name: string;
  discountPercent?: number;
  videoUrl?: string;
  pdfUrl?: string;
}

export function ProductGallery({
  images = [],
  name,
  discountPercent = 0,
  videoUrl,
  pdfUrl
}: ProductGalleryProps) {
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
    <div className="space-y-6">

      {/* Main Image Showcase Container - Full Frame Presentation */}
      <div className="relative aspect-square w-full rounded-3xl bg-white dark:bg-slate-900/80 border border-border-custom/80 p-2 sm:p-3 overflow-hidden shadow-sm group flex items-center justify-center">
        
        {/* Top-Left Discount Ribbon Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-xs px-3.5 py-1.5 rounded-br-2xl rounded-tl-2xl shadow-md uppercase tracking-wider flex items-center gap-1">
            <span>{discountPercent}% OFF</span>
          </div>
        )}

        {/* Top-Right Fullscreen Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 z-20 p-2.5 bg-card/90 backdrop-blur-md rounded-2xl text-foreground/80 hover:text-primary border border-border-custom/80 transition-all shadow-xs hover:scale-105"
          title="Fullscreen View"
        >
          <Maximize2 className="w-4.5 h-4.5" />
        </button>

        {/* Bottom-Left Authenticity Feature Badge */}
        <div className="absolute bottom-4 left-4 z-20 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 size={13} />
          <span>100% Authentic</span>
        </div>

        {/* Main Image Container with Lens Zoom */}
        <div
          ref={mainImageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
          className="w-full h-full flex items-center justify-center cursor-zoom-in relative overflow-hidden rounded-2xl bg-white dark:bg-slate-950"
        >
          <img
            src={imageList[selectedIndex]}
            alt={`${name} image ${selectedIndex + 1}`}
            className={`w-full h-full object-cover rounded-2xl transition-transform duration-200 ${
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

      {/* Horizontal Thumbnail Bar */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-20 shrink-0 rounded-2xl bg-white dark:bg-slate-900/60 border-2 p-1.5 overflow-hidden transition-all shadow-2xs ${
                selectedIndex === idx
                  ? 'border-primary shadow-md scale-95 ring-2 ring-primary/20'
                  : 'border-border-custom/60 opacity-70 hover:opacity-100 hover:border-primary/50'
              }`}
            >
              <img src={imgUrl} alt={`${name} thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xl" />
            </button>
          ))}
          {videoUrl && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="relative h-20 w-20 shrink-0 rounded-2xl bg-slate-900 text-white border-2 border-slate-800 p-2 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all"
            >
              <PlayCircle size={24} className="text-primary" />
              <span className="text-[9px] font-black uppercase">Video</span>
            </button>
          )}
        </div>
      )}

      {/* 4-Grid Key Highlights / Trust Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border-custom/80 p-3.5 rounded-2xl text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
            <Gem size={18} />
          </div>
          <p className="text-[11px] font-black text-foreground leading-tight">100% Genuine</p>
          <p className="text-[9px] text-muted-custom font-medium">Quality Guaranteed</p>
        </div>

        <div className="bg-card border border-border-custom/80 p-3.5 rounded-2xl text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
            <Award size={18} />
          </div>
          <p className="text-[11px] font-black text-foreground leading-tight">Certified Quality</p>
          <p className="text-[9px] text-muted-custom font-medium">Verified Seller</p>
        </div>

        <div className="bg-card border border-border-custom/80 p-3.5 rounded-2xl text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <p className="text-[11px] font-black text-foreground leading-tight">Lab Tested</p>
          <p className="text-[9px] text-muted-custom font-medium">Safety Audited</p>
        </div>

        <div className="bg-card border border-border-custom/80 p-3.5 rounded-2xl text-center space-y-1.5 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center">
            <Lock size={18} />
          </div>
          <p className="text-[11px] font-black text-foreground leading-tight">Secure Packaging</p>
          <p className="text-[9px] text-muted-custom font-medium">Tamper Proof</p>
        </div>
      </div>

      {/* Social Proof Popularity Banner */}
      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
        <div className="flex -space-x-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">AS</div>
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">RK</div>
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">VJ</div>
        </div>
        <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
          165+ people bought this product in the last 7 days
        </p>
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

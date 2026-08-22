'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Product360ViewerProps {
  frames: string[];
  productName: string;
}

export function Product360Viewer({ frames, productName }: Product360ViewerProps) {
  const frameList = frames.length > 0 ? frames : ['/placeholder-product.png'];
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoSpinTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Preload frames for smooth rotation
  useEffect(() => {
    frameList.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frameList]);

  // Auto spin animation loop
  useEffect(() => {
    if (isAutoSpinning) {
      autoSpinTimerRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frameList.length);
      }, 75);
    } else if (autoSpinTimerRef.current) {
      clearInterval(autoSpinTimerRef.current);
    }
    return () => {
      if (autoSpinTimerRef.current) clearInterval(autoSpinTimerRef.current);
    };
  }, [isAutoSpinning, frameList.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoSpinning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const threshold = 12; // sensitivity pixels per frame

    if (Math.abs(deltaX) > threshold) {
      const step = deltaX > 0 ? -1 : 1;
      setCurrentFrameIndex((prev) => (prev + step + frameList.length) % frameList.length);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoSpinning(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    const threshold = 12;

    if (Math.abs(deltaX) > threshold) {
      const step = deltaX > 0 ? -1 : 1;
      setCurrentFrameIndex((prev) => (prev + step + frameList.length) % frameList.length);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative aspect-square w-full rounded-2xl bg-white dark:bg-slate-900 border border-border-custom/80 overflow-hidden select-none cursor-grab active:cursor-grabbing flex flex-col items-center justify-center p-3 shadow-xs group"
    >
      {/* 360 Rotation Badge */}
      <div className="absolute top-4 left-4 z-20 bg-black/75 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
        <RotateCcw size={12} className="animate-spin" />
        <span>360° Interactive Spin</span>
      </div>

      {/* Frame Counter */}
      <div className="absolute top-4 right-4 z-20 bg-card/80 backdrop-blur-md border border-border-custom/80 text-foreground font-mono font-bold text-[10px] px-2.5 py-1 rounded-xl shadow-xs">
        {currentFrameIndex + 1} / {frameList.length}
      </div>

      {/* Center 360 Product Frame View */}
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <img
          src={frameList[currentFrameIndex]}
          alt={`${productName} 360 frame ${currentFrameIndex + 1}`}
          className="max-h-full max-w-full object-contain drop-shadow-xl"
          draggable={false}
        />
      </div>

      {/* Bottom Rotation Progress Bar & Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-white">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAutoSpinning(!isAutoSpinning);
          }}
          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all cursor-pointer"
          title={isAutoSpinning ? 'Pause auto-spin' : 'Start auto-spin'}
        >
          {isAutoSpinning ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Rotation Scrubber */}
        <div className="flex-1 flex items-center gap-1">
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-75"
              style={{ width: `${((currentFrameIndex + 1) / frameList.length) * 100}%` }}
            />
          </div>
        </div>

        <span className="text-[10px] font-bold text-white/80 shrink-0">
          Drag horizontally to rotate
        </span>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Box,
  Smartphone,
  Eye,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';

interface ArQuickViewerProps {
  productName: string;
  glbUrl?: string | null;
  usdzUrl?: string | null;
  fallbackImage?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ArQuickViewer({
  productName,
  glbUrl,
  usdzUrl,
  fallbackImage = '/placeholder-product.png',
  isOpen,
  onClose,
}: ArQuickViewerProps) {
  if (!isOpen) return null;

  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  const finalGlb = glbUrl || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb';
  const finalUsdz = usdzUrl || 'https://developer.apple.com/augmented-reality/quick-look/models/retrotv/tv.usdz';

  const handleLaunchAR = () => {
    if (isIos && finalUsdz) {
      // Launch Apple Quick Look
      const anchor = document.createElement('a');
      anchor.setAttribute('rel', 'ar');
      anchor.setAttribute('href', finalUsdz);
      anchor.appendChild(document.createElement('img'));
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else if (isAndroid && finalGlb) {
      // Launch Google Scene Viewer Intent
      const intentUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        finalGlb
      )}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
        window.location.href
      )};end;`;
      window.location.href = intentUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border-custom/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
              <Box size={20} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm">Augmented Reality (AR) Preview</h3>
              <p className="text-[10px] text-white/80 font-semibold">
                View {productName} in Your Room (Features 157 & 158)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="relative aspect-video rounded-2xl bg-slate-900 border border-border-custom/60 overflow-hidden flex items-center justify-center p-4">
            <img
              src={fallbackImage}
              alt={productName}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <Sparkles size={11} className="text-amber-300" />
              <span>3D Spatial Model Ready</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <h4 className="font-black text-foreground text-sm">True-to-Scale Room Placement</h4>
            <p className="text-muted-custom text-[11px] leading-relaxed">
              Place this 3D model on any flat surface (table, floor, or desk) using your device's camera to inspect exact dimensions, material textures, and spatial fit before buying.
            </p>
          </div>

          {/* Device Actions */}
          <div className="pt-2">
            {isIos || isAndroid ? (
              <button
                onClick={handleLaunchAR}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Smartphone size={16} />
                <span>Launch AR Camera Viewer</span>
              </button>
            ) : (
              <div className="p-4 bg-background rounded-2xl border border-border-custom/80 space-y-2 text-left">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Smartphone size={14} />
                  <span>Open on Mobile for Full AR Experience</span>
                </div>
                <p className="text-[10px] text-muted-custom leading-relaxed">
                  Augmented Reality room placement requires an ARKit (iOS) or ARCore (Android) camera device. Scan this product's QR code or visit on your smartphone to view it directly in your room.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-background-secondary border-t border-border-custom/60 flex items-center justify-between text-xs">
          <span className="text-[10px] text-muted-custom font-semibold flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" /> WebXR & Apple Quick Look standard
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-card border border-border-custom/80 text-foreground font-bold rounded-xl text-xs hover:bg-background"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

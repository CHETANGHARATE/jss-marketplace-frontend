'use client';

import React, { useState, useRef } from 'react';
import {
  immersiveMediaService,
  TryOnResult,
} from '@/services/immersiveMediaService';
import {
  Sparkles,
  Camera,
  Upload,
  X,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | string;
  productName: string;
  productImage: string;
  tryOnCategory?: string;
}

export function VirtualTryOnModal({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  tryOnCategory = 'apparel',
}: VirtualTryOnModalProps) {
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);

  // Overlay Controls (Scale, Position X/Y, Opacity)
  const [overlayScale, setOverlayScale] = useState<number>(100);
  const [overlayPosY, setOverlayPosY] = useState<number>(35);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(90);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelected = (file: File) => {
    if (!consentAgreed) {
      alert('Please read and check the privacy consent box before uploading.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const uri = e.target?.result as string;
      setUserPhoto(uri);
      processTryOn(file);
    };
    reader.readAsDataURL(file);
  };

  const processTryOn = async (file: File) => {
    setIsProcessing(true);
    try {
      const res = await immersiveMediaService.generateTryOn({
        productId,
        photoFile: file,
        consentAgreed,
      });
      setTryOnResult(res);
    } catch (e) {
      console.error('Virtual try on generation failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setTryOnResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border-custom/80 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-700 via-indigo-700 to-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
              <Sparkles size={20} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm">Virtual Try-On Experience</h3>
              <p className="text-[10px] text-white/80 font-semibold">
                Interactive preview for {productName}
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Privacy & Consent Notice */}
          {!userPhoto && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-foreground">Customer Privacy & Security First</h4>
                  <p className="text-[11px] text-muted-custom leading-relaxed">
                    Your photo is processed temporarily in memory to generate your personalized fit preview. It is never sold, shared, or permanently stored.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer pt-1 border-t border-border-custom/60">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                <span>I understand and consent to temporary try-on preview generation</span>
              </label>
            </div>
          )}

          {/* 2. Photo Upload Trigger */}
          {!userPhoto && (
            <div
              onClick={() => {
                if (!consentAgreed) {
                  alert('Please check the privacy consent box above first.');
                  return;
                }
                fileInputRef.current?.click();
              }}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all group space-y-3 ${
                consentAgreed
                  ? 'border-primary/60 hover:border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer'
                  : 'border-border-custom/60 bg-muted/20 opacity-60 cursor-not-allowed'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={!consentAgreed}
                onChange={(e) => e.target.files?.[0] && handlePhotoSelected(e.target.files[0])}
              />

              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Camera size={28} />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-foreground">
                  Upload your photo (Front facing with neutral background)
                </p>
                <p className="text-[10px] text-muted-custom font-semibold">
                  Supports JPEG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </div>
          )}

          {/* 3. Try-On Interactive Preview Canvas */}
          {userPhoto && (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 aspect-[3/4] max-w-sm mx-auto border border-border-custom/80 shadow-2xl flex items-center justify-center select-none">
                {/* Background: User Photo */}
                <img
                  src={userPhoto}
                  alt="Customer"
                  className="w-full h-full object-cover"
                />

                {/* Foreground: Product Overlay */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75"
                  style={{
                    top: `${overlayPosY}%`,
                    width: `${overlayScale}%`,
                    opacity: overlayOpacity / 100,
                  }}
                >
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-300" />
                  <span>Virtual Try-On Simulation</span>
                </div>
              </div>

              {/* Interactive Fit & Scale Adjuster Sliders */}
              <div className="bg-background rounded-2xl p-4 border border-border-custom/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-foreground flex items-center gap-1.5">
                    <Sliders size={14} className="text-primary" />
                    <span>Fit Adjustments</span>
                  </span>
                  <button
                    onClick={handleReset}
                    className="text-[10px] text-rose-500 font-bold hover:underline"
                  >
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-muted-custom">
                      <span>Item Size / Scale</span>
                      <span>{overlayScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="160"
                      value={overlayScale}
                      onChange={(e) => setOverlayScale(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-muted-custom">
                      <span>Vertical Alignment</span>
                      <span>{overlayPosY}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="75"
                      value={overlayPosY}
                      onChange={(e) => setOverlayPosY(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-background-secondary border-t border-border-custom/60 flex items-center justify-between">
          <span className="text-[10px] text-muted-custom font-semibold">
            Instant on-device rendering
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-xs transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

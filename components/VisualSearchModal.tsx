'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  visualSearchService,
  VisualSearchResultItem,
  VisualSearchResponse,
} from '@/services/visualSearchService';
import {
  Camera,
  Upload,
  X,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VisualSearchModal({ isOpen, onClose }: VisualSearchModalProps) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<VisualSearchResponse | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied or unavailable', err);
      setCameraError('Camera access denied or unsupported on this device. Please upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUri);
      stopCamera();
      executeSearch(undefined, dataUri);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const uri = e.target?.result as string;
      setSelectedImage(uri);
      executeSearch(file);
    };
    reader.readAsDataURL(file);
  };

  const executeSearch = async (file?: File, imageData?: string) => {
    setIsSearching(true);
    try {
      const res = await visualSearchService.search({
        file,
        imageData,
        limit: 8,
      });
      setSearchResponse(res);
    } catch (e) {
      console.error('Visual search failed', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSearchResponse(null);
    if (activeMode === 'camera') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border-custom/80 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-background-secondary border-b border-border-custom/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Camera size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-foreground">Visual Product Search</h3>
              <p className="text-[10px] text-muted-custom font-semibold">
                Snap or upload a photo to find visually matching products on JSS Marketplace
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-muted-custom hover:text-foreground hover:bg-card rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Mode Switcher */}
          {!selectedImage && (
            <div className="flex items-center gap-2 p-1 bg-background rounded-2xl border border-border-custom/60 max-w-xs mx-auto">
              <button
                onClick={() => setActiveMode('upload')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'upload'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                <Upload size={14} />
                <span>Upload Photo</span>
              </button>

              <button
                onClick={() => setActiveMode('camera')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeMode === 'camera'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted-custom hover:text-foreground'
                }`}
              >
                <Camera size={14} />
                <span>Take Photo</span>
              </button>
            </div>
          )}

          {/* Mode 1: File Upload */}
          {!selectedImage && activeMode === 'upload' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className="border-2 border-dashed border-border-custom/80 hover:border-primary/60 rounded-3xl p-8 sm:p-12 text-center cursor-pointer bg-background hover:bg-background-secondary/50 transition-all group space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />

              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-foreground">
                  Drag & Drop a product photo or <span className="text-primary underline">Browse</span>
                </p>
                <p className="text-[10px] text-muted-custom font-semibold">
                  Supports JPEG, PNG, WEBP (Max 10MB)
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Camera Capture */}
          {!selectedImage && activeMode === 'camera' && (
            <div className="space-y-3">
              {cameraError ? (
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-3xl text-center text-xs space-y-2">
                  <p className="font-bold">{cameraError}</p>
                  <button
                    onClick={() => setActiveMode('upload')}
                    className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs"
                  >
                    Switch to Photo Upload
                  </button>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden bg-black aspect-square max-w-sm mx-auto shadow-inner border border-border-custom/60 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Camera Reticle Overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-white/80 font-bold bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                      Align product in frame
                    </span>
                  </div>

                  {/* Shutter Button */}
                  <button
                    onClick={handleCaptureSnapshot}
                    className="absolute bottom-4 p-4 rounded-full bg-white text-primary hover:scale-110 active:scale-95 transition-all shadow-2xl border-4 border-primary/40 cursor-pointer"
                    title="Capture Photo"
                  >
                    <Camera size={24} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Processing & Results View */}
          {selectedImage && (
            <div className="space-y-4">
              {/* Query Image Banner */}
              <div className="p-3 bg-background rounded-2xl border border-border-custom/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage}
                    alt="Query"
                    className="w-12 h-12 object-cover rounded-xl border border-border-custom/60"
                  />
                  <div>
                    <span className="text-xs font-black text-foreground block">
                      Visual Query Image
                    </span>
                    {searchResponse && (
                      <span className="text-[10px] text-muted-custom font-semibold flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                          style={{ backgroundColor: searchResponse.query_signature.dominant_color }}
                        />
                        Detected Hue: {searchResponse.query_signature.color_family}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-card hover:bg-background-secondary border border-border-custom/80 text-foreground font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw size={12} />
                  <span>Retake / Change</span>
                </button>
              </div>

              {/* Loading State */}
              {isSearching && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto animate-spin">
                    <Sparkles size={24} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-black text-foreground">
                      Extracting visual features & color signatures...
                    </p>
                    <p className="text-[10px] text-muted-custom font-semibold">
                      Matching against verified marketplace catalog
                    </p>
                  </div>
                </div>
              )}

              {/* Matches Grid */}
              {!isSearching && searchResponse && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground">
                      Top Visual Matches ({searchResponse.results.length})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Color & Pattern Hashed
                    </span>
                  </div>

                  {searchResponse.results.length === 0 ? (
                    <div className="py-8 text-center text-muted-custom text-xs">
                      No close visual matches found. Try capturing a clearer angle with better lighting.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {searchResponse.results.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-card border border-border-custom/80 rounded-2xl p-2.5 space-y-2 hover:border-primary/50 transition-all shadow-2xs group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-background">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[9px] font-black rounded-md">
                                {prod.similarity_percent}% Match
                              </span>
                            </div>

                            <div>
                              <Link
                                href={`/product/${prod.slug}`}
                                onClick={onClose}
                                className="text-[11px] font-black text-foreground hover:text-primary transition-colors line-clamp-2"
                              >
                                {prod.name}
                              </Link>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="font-black text-xs text-foreground">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                {prod.discount_percent > 0 && (
                                  <span className="text-[9px] text-emerald-600 font-bold">
                                    {prod.discount_percent}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/product/${prod.slug}`}
                            onClick={onClose}
                            className="w-full py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[10px] font-black text-center transition-all block"
                          >
                            View Product
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Star, ArrowLeft, ArrowRight } from 'lucide-react';

interface ImageGalleryUploaderProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  maxImages?: number;
}

export function ImageGalleryUploader({ images, onChangeImages, maxImages = 10 }: ImageGalleryUploaderProps) {
  const [inputUrl, setInputUrl] = useState('');

  const handleAddUrl = () => {
    if (!inputUrl.trim()) return;
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChangeImages([...images, inputUrl.trim()]);
    setInputUrl('');
  };

  const handleRemoveImage = (index: number) => {
    onChangeImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChangeImages(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    onChangeImages(updated);
  };

  return (
    <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-extrabold text-base text-foreground">Product Images (Module 6)</h3>
            <p className="text-xs text-foreground/60">Upload thumbnail & gallery (Min 1, Max {maxImages} images, JPG/PNG/WEBP)</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary rounded-full">
          {images.length} / {maxImages} Images
        </span>
      </div>

      {/* URL or Upload Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="url"
            placeholder="Enter Image URL (e.g. https://images.unsplash.com/...)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
            className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-primary outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          disabled={images.length >= maxImages}
          className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-2xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          Add Image
        </button>
      </div>

      {/* Preset Quick Image Badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-[11px] font-bold text-foreground/50 self-center">Sample Demo URLs:</span>
        {[
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        ].map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => images.length < maxImages && onChangeImages([...images, sample])}
            className="text-[10px] font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg transition-colors"
          >
            + Sample {idx + 1}
          </button>
        ))}
      </div>

      {/* Image Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`group relative rounded-2xl overflow-hidden border aspect-square bg-slate-50 dark:bg-slate-900/40 p-2 flex items-center justify-center transition-all ${
                idx === 0 ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-border/60'
              }`}
            >
              <img src={imgUrl} alt={`Product ${idx + 1}`} className="max-h-full max-w-full object-contain select-none" />

              {/* Primary Image Badge */}
              {idx === 0 ? (
                <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Thumbnail
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="absolute top-2 left-2 bg-background/80 hover:bg-primary hover:text-white text-foreground text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs border border-border/40 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Set Thumbnail
                </button>
              )}

              {/* Quick Actions overlay */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-3xs">
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'left')}
                    className="p-1.5 bg-background text-foreground rounded-full hover:bg-primary hover:text-white transition-colors"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                {idx < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'right')}
                    className="p-1.5 bg-background text-foreground rounded-full hover:bg-primary hover:text-white transition-colors"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 border border-dashed border-border/60 rounded-2xl text-center space-y-2 bg-muted/10">
          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-xs text-foreground/60">No images added. Enter an image URL above to add images to your product gallery.</p>
        </div>
      )}
    </div>
  );
}

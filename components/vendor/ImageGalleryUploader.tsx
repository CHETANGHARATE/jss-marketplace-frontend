'use client';

import React, { useState, useRef } from 'react';
import { mediaService } from '../../services/mediaService';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  CheckCircle,
  Plus,
  Video,
  FileText
} from 'lucide-react';

interface ImageGalleryUploaderProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  maxImages?: number;
  videoUrl?: string;
  onChangeVideoUrl?: (url: string) => void;
  pdfUrl?: string;
  onChangePdfUrl?: (url: string) => void;
}

export function ImageGalleryUploader({
  images,
  onChangeImages,
  maxImages = 10,
  videoUrl = '',
  onChangeVideoUrl,
  pdfUrl = '',
  onChangePdfUrl,
}: ImageGalleryUploaderProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection / drag & drop
  const handleFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      alert('Please upload valid image files (JPG, PNG, WEBP).');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. Only the first ${maxImages - images.length} will be added.`);
    }

    const availableSlots = maxImages - images.length;
    const filesToProcess = validFiles.slice(0, availableSlots);

    setIsUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        filesToProcess.map((file) => mediaService.uploadFile(file, 'products'))
      );
      onChangeImages([...images, ...uploadedUrls]);
    } catch (e: any) {
      console.error('Image upload error:', e);
      alert(e.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChangeImages([selected, ...remaining]);
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChangeImages(updated);
  };

  return (
    <div className="space-y-6 bg-card border border-border/40 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            <span>Product Image Gallery & Cover Media</span>
          </h3>
          <p className="text-xs text-foreground/60 mt-0.5">
            Upload high-quality images. The first image will be set as the main Cover Image on product cards & search listings.
          </p>
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
            images.length >= maxImages
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-emerald-500/10 text-emerald-600'
          }`}
        >
          {images.length} / {maxImages} Images
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-500 bg-rose-500/5 scale-[1.01]'
              : 'border-border/60 hover:border-rose-500/50 bg-muted/20 hover:bg-muted/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
            className="hidden"
          />

          <div className="space-y-3 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-foreground">
                Drag & Drop product images here, or <span className="text-rose-500 underline">Browse Files</span>
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                Supports JPG, PNG, WEBP files up to 10 MB each (Max {maxImages} images).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Image URL Fallback */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1.5"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide Image URL Paste' : '+ Or Paste Image URL directly'}</span>
        </button>

        {showUrlInput && (
          <div className="flex items-center gap-2 mt-3 p-3 bg-muted/20 rounded-2xl border border-border/40">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-background border border-border/60 focus:border-rose-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        )}
      </div>

      {/* Image Gallery Grid */}
      {images.length > 0 ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-foreground">Uploaded Product Gallery</h4>
            <span className="text-[11px] text-foreground/50">Click "Set as Cover" to change main product image.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((url, idx) => {
              const isCover = idx === 0;

              return (
                <div
                  key={idx}
                  className={`group relative aspect-square bg-slate-50 dark:bg-slate-900/40 rounded-2xl border p-2 flex flex-col items-center justify-center overflow-hidden transition-all shadow-xs ${
                    isCover
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-border/60 hover:border-foreground/40'
                  }`}
                >
                  <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain rounded-xl" />

                  {/* Cover Badge */}
                  {isCover ? (
                    <span className="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md z-10">
                      <Star className="w-2.5 h-2.5 fill-current" /> Cover
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="absolute top-2 left-2 bg-black/70 text-white hover:bg-rose-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase transition-all opacity-0 group-hover:opacity-100 z-10"
                    >
                      Set Cover
                    </button>
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleMoveImage(idx, 'left')}
                      disabled={idx === 0}
                      className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all disabled:opacity-30"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-md"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveImage(idx, 'right')}
                      disabled={idx === images.length - 1}
                      className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all disabled:opacity-30"
                      title="Move Right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs font-semibold text-foreground/40 italic">
          No images uploaded yet. Please add at least 1 Cover Image.
        </div>
      )}

      {/* Additional Optional Media (Video URL & PDF Spec Sheet) */}
      <div className="pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-foreground mb-1 block flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-rose-500" />
            <span>Product Video URL (YouTube / Vimeo - Optional)</span>
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => onChangeVideoUrl && onChangeVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-foreground mb-1 block flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>Product Brochure / Specification PDF URL (Optional)</span>
          </label>
          <input
            type="url"
            value={pdfUrl}
            onChange={(e) => onChangePdfUrl && onChangePdfUrl(e.target.value)}
            placeholder="https://example.com/spec-sheet.pdf"
            className="w-full px-4 py-2.5 text-xs rounded-2xl bg-background border border-border/60 focus:border-rose-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}

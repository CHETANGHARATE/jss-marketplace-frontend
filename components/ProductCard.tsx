'use client';

import React from 'react';
import { Star, ShoppingCart, Heart, Eye, ShieldCheck } from 'lucide-react';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();

  const isWish = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    alert(`Proceeding to secure checkout with ${product.name}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const savingsAmount = product.originalPrice > product.offerPrice 
    ? product.originalPrice - product.offerPrice 
    : 0;

  return (
    <div className="group bg-card text-card-foreground border border-border-custom/80 hover:border-primary/50 rounded-3xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative hover:-translate-y-1">
      
      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-10 p-2.5 rounded-2xl border backdrop-blur-md transition-all duration-200 shadow-2xs ${
          isWish
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            : 'bg-card/90 border-border-custom/80 text-muted-custom hover:text-rose-500 hover:bg-card'
        }`}
        aria-label="Wishlist Toggle"
      >
        <Heart size={16} fill={isWish ? 'currentColor' : 'none'} className="transition-transform duration-200 group-active:scale-90" />
      </button>

      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* Image Container with aspect-square ratio */}
      <div 
        onClick={() => onQuickView(product.id)}
        className="w-full aspect-square bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center p-5 relative overflow-hidden shrink-0 cursor-pointer border-b border-border-custom/60"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick View Hover Tag */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-3xs">
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-md border border-slate-700/80">
            <Eye size={14} />
            {t('prod.quick_view')}
          </span>
        </div>
      </div>

      {/* Product Details Container */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          {/* Brand & Stock Status */}
          <div className="flex justify-between items-center text-[10px] text-muted-custom font-bold">
            <span className="uppercase tracking-wider truncate max-w-[110px] bg-background-secondary border border-border-custom/80 px-2 py-0.5 rounded-lg">
              {product.brand}
            </span>
            <span
              className={
                product.stockStatus === 'in_stock'
                  ? 'text-emerald-600 font-extrabold flex items-center gap-1'
                  : product.stockStatus === 'low_stock'
                  ? 'text-amber-600 font-extrabold flex items-center gap-1'
                  : 'text-rose-500 font-extrabold flex items-center gap-1'
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full ${
                product.stockStatus === 'in_stock' ? 'bg-emerald-500' : product.stockStatus === 'low_stock' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              {t(`prod.${product.stockStatus}`)}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product.id)}
            className="font-extrabold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Seller Tag */}
          <div className="flex items-center gap-1 text-[10px] text-muted-custom truncate">
            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate">Seller: <strong className="font-bold text-foreground">{product.seller.name}</strong></span>
          </div>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                />
              ))}
            </div>
            <span className="text-xs font-black text-foreground">{product.rating}</span>
            <span className="text-[10px] text-muted-custom font-semibold">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-3 border-t border-border-custom/60 space-y-3">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-primary">
                ₹{product.offerPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.offerPrice && (
                <span className="text-xs text-muted-custom line-through font-semibold">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                Save ₹{savingsAmount.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-2xl transition-all flex items-center justify-center shrink-0 shadow-2xs"
              title={t('prod.add_to_cart')}
            >
              <ShoppingCart size={16} />
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-black py-2.5 rounded-2xl transition-all text-center shadow-xs active:scale-95"
            >
              {t('prod.buy_now')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

'use client';

import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
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
    alert(`${product.name} ${t('prod.cart_added')}!`);
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

  return (
    <div className="group bg-card text-card-foreground border border-border-custom hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      
      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-xl border transition-all duration-200 ${
          isWish
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
            : 'bg-card/90 border-border-custom text-foreground/50 hover:text-rose-500 hover:bg-card'
        }`}
        aria-label="Wishlist Toggle"
      >
        <Heart size={15} fill={isWish ? 'currentColor' : 'none'} className="transition-transform duration-200 group-active:scale-90" />
      </button>

      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-foreground text-background text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
          {product.discountPercent}% OFF
        </span>
      )}

      {/* Image Container with aspect-square ratio */}
      <div 
        onClick={() => onQuickView(product.id)}
        className="w-full aspect-square bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4 relative overflow-hidden shrink-0 cursor-pointer border-b border-border-custom/50"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Quick View Hover Tag */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-card text-foreground text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-border-custom">
            <Eye size={13} />
            {t('prod.quick_view')}
          </span>
        </div>
      </div>

      {/* Product Details Container */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Stock Status */}
          <div className="flex justify-between items-center text-[10px] text-muted-custom font-semibold">
            <span className="truncate max-w-[120px]">{product.brand}</span>
            <span
              className={
                product.stockStatus === 'in_stock'
                  ? 'text-emerald-600 font-bold'
                  : product.stockStatus === 'low_stock'
                  ? 'text-amber-600 font-bold'
                  : 'text-rose-500 font-bold'
              }
            >
              {t(`prod.${product.stockStatus}`)}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product.id)}
            className="font-bold text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Seller Tag */}
          <p className="text-[10px] text-muted-custom truncate">
            {t('prod.seller')}: <span className="font-semibold text-foreground">{product.seller.name}</span>
          </p>

          {/* Star Ratings */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}
                />
              ))}
            </div>
            <span className="text-[10px] font-black text-foreground ml-0.5">{product.rating}</span>
            <span className="text-[9px] text-muted-custom">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-2.5 border-t border-border-custom/60 space-y-2.5">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-primary">
                ₹{product.offerPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.offerPrice && (
                <span className="text-xs text-muted-custom line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2 bg-background-secondary hover:bg-primary hover:text-white text-primary border border-border-custom rounded-xl transition-colors flex items-center justify-center shrink-0"
              title={t('prod.add_to_cart')}
            >
              <ShoppingCart size={15} />
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-xl hover:bg-primary-hover active:scale-95 transition-all text-center"
            >
              {t('prod.buy_now')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

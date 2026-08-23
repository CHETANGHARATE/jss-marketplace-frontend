'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, Eye, ShieldCheck, Scale } from 'lucide-react';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useComparison } from '../contexts/ComparisonContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';
import { Product } from '../types';

import { ProductImageFrame } from './ProductImageFrame';

interface ProductCardProps {
  product: Product;
  onQuickView: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const { compareItems, addToCompare, removeFromCompare, isInCompare } = useComparison();
  const { cartSuccess, wishlistSuccess } = useToast();
  const router = useRouter();

  const numericId = parseInt(product.id as string, 10) || Number(product.id);
  const isWish = isInWishlist(product.id);
  const isCompared = isInCompare(numericId);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(numericId);
    } else {
      addToCompare({
        id: numericId,
        name: product.name,
        slug: product.slug || String(product.id),
        image: product.image,
        price: product.offerPrice,
        original_price: product.originalPrice,
        rating: product.rating,
        brand: product.brand,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    cartSuccess('✓ Product added to cart successfully.');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasInWishlist = isInWishlist(product.id);
    toggleWishlist(product);
    if (!wasInWishlist) {
      wishlistSuccess('❤️ Added to Wishlist');
    }
  };

  const savingsAmount = product.originalPrice > product.offerPrice 
    ? product.originalPrice - product.offerPrice 
    : 0;

  const targetSlug = product.slug || product.id;

  const handleProductClick = () => {
    router.push(`/product/${targetSlug}`);
  };

  return (
    <div className="group bg-card text-card-foreground border border-border-custom/80 hover:border-primary/50 rounded-[16px] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative hover:-translate-y-1">
      
      {/* Top Action Overlay (Wishlist & Compare) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleWishlistClick}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 shadow-2xs ${
            isWish
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              : 'bg-card/90 border-border-custom/80 text-muted-custom hover:text-rose-500 hover:bg-card'
          }`}
          aria-label="Wishlist Toggle"
          title={isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={15} fill={isWish ? 'currentColor' : 'none'} className="transition-transform duration-200 group-active:scale-90" />
        </button>

        <button
          onClick={handleCompareClick}
          className={`p-2 rounded-xl border backdrop-blur-md transition-all duration-200 shadow-2xs ${
            isCompared
              ? 'bg-orange-500/15 border-orange-500/40 text-orange-600 dark:text-orange-400'
              : 'bg-card/90 border-border-custom/80 text-muted-custom hover:text-orange-500 hover:bg-card'
          }`}
          aria-label="Compare Toggle"
          title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
        >
          <Scale size={15} className="transition-transform duration-200 group-active:scale-90" />
        </button>
      </div>

      {/* Discount Badge */}
      {product.discountPercent > 0 && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
          {product.discountPercent}% {t('prod.off')}
        </span>
      )}

      {/* Premium Product Image Frame */}
      <ProductImageFrame
        src={product.image}
        alt={product.name}
        onClick={handleProductClick}
      >
        {/* Quick View Hover Tag */}
        <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-3xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product.id);
            }}
            className="bg-slate-950/85 hover:bg-primary backdrop-blur-md text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md border border-slate-700/80 transition-colors"
          >
            <Eye size={13} />
            {t('prod.quick_view')}
          </button>
        </div>
      </ProductImageFrame>

      {/* Product Details Container */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2.5">
        <div className="space-y-1.5">
          {/* Brand & Stock Status */}
          <div className="flex justify-between items-center text-[10px] text-muted-custom font-bold">
            <span className="uppercase tracking-wider truncate max-w-[110px] bg-background-secondary border border-border-custom/80 px-2 py-0.5 rounded-md">
              {product.brand}
            </span>
            <span
              className={
                product.stockStatus === 'in_stock'
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1'
                  : product.stockStatus === 'low_stock'
                  ? 'text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1'
                  : 'text-rose-500 dark:text-rose-400 font-extrabold flex items-center gap-1'
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
            onClick={handleProductClick}
            className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer min-h-[2.1rem]"
          >
            {product.name}
          </h3>

          {/* Seller Tag */}
          <div className="flex items-center gap-1 text-[10px] text-muted-custom truncate">
            <ShieldCheck size={12} className="text-emerald-500 shrink-0" />
            <span className="truncate">{t('prod.seller_label')} <strong className="font-bold text-foreground">{product.seller.name}</strong></span>
          </div>

          {/* Star Ratings */}
          <div className="flex items-center gap-1.5 pt-0.5">
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
            <span className="text-[11px] font-black text-foreground">{product.rating}</span>
            <span className="text-[9px] text-muted-custom font-semibold">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="pt-2 border-t border-border-custom/60 space-y-2">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-primary">
                ₹{product.offerPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.offerPrice && (
                <span className="text-[11px] text-muted-custom line-through font-semibold">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {savingsAmount > 0 && (
              <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                {t('prod.save')} ₹{savingsAmount.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl transition-all flex items-center justify-center shrink-0 shadow-2xs"
              title={t('prod.add_to_cart')}
            >
              <ShoppingCart size={15} />
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#1565D8] hover:bg-[#0D47A1] active:bg-[#0A3880] text-white text-xs font-black py-2 rounded-xl transition-all text-center shadow-2xs active:scale-95"
            >
              {t('prod.buy_now')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

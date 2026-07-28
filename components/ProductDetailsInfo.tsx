'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ApiProduct } from '../types/api';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface ProductDetailsInfoProps {
  product: ApiProduct;
}

export function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const { addToCart, wishlist, toggleWishlist } = useCartWishlist();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const isWishlisted = wishlist.some((item) => String(item.id) === String(product.id));

  const handleAddToCart = () => {
    addToCart({
      id: String(product.id),
      name: product.name,
      brand: product.brand?.name || 'Generic',
      seller: {
        id: String(product.seller_id || 1),
        name: 'Verified Marketplace Seller',
        rating: 4.8,
        location: 'India',
        joinedDate: '2024',
        description: 'Verified seller',
      },
      category: product.category?.slug || 'general',
      subcategory: '',
      originalPrice: product.originalPrice ?? product.original_price ?? 0,
      offerPrice: product.offerPrice ?? product.sale_price ?? product.originalPrice ?? product.original_price ?? 0,
      discountPercent: product.discountPercent ?? (product.sale_price && product.original_price ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100) : 0),
      rating: product.rating || 5,
      reviewsCount: product.reviewsCount || product.reviews_count || 0,
      stockStatus: (product.stockStatus || product.stock_status || 'in_stock') as any,
      image: product.image || product.images?.[0] || '/placeholder-product.png',
      description: product.description || '',
      features: product.features || [],
      reviews: [],
      tags: [],
    }, quantity);

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const origPrice = product.originalPrice ?? product.original_price ?? 0;
  const offerPrice = product.offerPrice ?? product.sale_price ?? origPrice;
  const discountPercent = product.discountPercent ?? (origPrice > offerPrice
    ? Math.round(((origPrice - offerPrice) / origPrice) * 100)
    : 0);

  const savingsAmount = origPrice > offerPrice ? origPrice - offerPrice : 0;

  return (
    <div className="space-y-6">
      {/* Brand & SKU bar */}
      <div className="flex items-center justify-between gap-4 border-b border-border-custom/80 pb-4">
        {product.brand ? (
          <Link
            href={`/brand/${product.brand.slug}`}
            className="text-xs font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl hover:bg-primary hover:text-white transition-all"
          >
            {product.brand.name}
          </Link>
        ) : (
          <span className="text-xs font-black uppercase tracking-wider text-muted-custom bg-background-secondary border border-border-custom px-3 py-1 rounded-xl">
            Verified Source
          </span>
        )}
        {product.sku && (
          <span className="text-xs text-muted-custom font-mono font-semibold">SKU: {product.sku}</span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating & Seller Row */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl text-xs font-black">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
        </div>
        <span className="text-xs text-muted-custom font-semibold">
          ({product.reviews_count || 0} verified customer reviews)
        </span>
      </div>

      {/* Price Showcase Card */}
      <div className="p-5 bg-background-secondary/80 border border-border-custom/80 rounded-3xl space-y-2">
        <div className="flex items-baseline flex-wrap gap-3">
          <span className="text-3xl sm:text-4xl font-black text-primary">
            ₹{offerPrice.toLocaleString()}
          </span>
          {origPrice > offerPrice && (
            <span className="text-base text-muted-custom line-through font-semibold">
              ₹{origPrice.toLocaleString()}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-xs font-black text-white bg-rose-500 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {savingsAmount > 0 && (
          <p className="text-xs font-black text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>You save ₹{savingsAmount.toLocaleString()} directly from vendor listing</span>
          </p>
        )}
      </div>

      {/* Stock Status Indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            product.stock_status === 'out_of_stock'
              ? 'bg-rose-500'
              : product.stock_status === 'low_stock'
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
        />
        <span className="text-xs font-black capitalize text-foreground">
          {product.stock_status === 'out_of_stock'
            ? 'Out of Stock'
            : product.stock_status === 'low_stock'
            ? 'Low Stock - Order Soon'
            : 'In Stock & Ready for Express Dispatch'}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <div className="space-y-2 border-t border-border-custom/80 pt-4">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-custom">Product Details</h4>
          <p className="text-xs sm:text-sm text-muted-custom leading-relaxed font-normal">
            {product.description}
          </p>
        </div>
      )}

      {/* Quantity & CTA Actions */}
      <div className="space-y-4 pt-4 border-t border-border-custom/80">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase text-muted-custom">Quantity:</span>
          <div className="flex items-center border border-border-custom/80 rounded-2xl bg-card">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 hover:bg-background-secondary text-foreground/70 hover:text-foreground rounded-l-2xl transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-5 text-sm font-black text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 hover:bg-background-secondary text-foreground/70 hover:text-foreground rounded-r-2xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_status === 'out_of_stock'}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{addedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
          </button>

          <button
            onClick={() =>
              toggleWishlist({
                id: String(product.id),
                name: product.name,
                brand: product.brand?.name || '',
                seller: { id: '1', name: '', rating: 5, location: '', joinedDate: '', description: '' },
                category: '',
                subcategory: '',
                originalPrice: origPrice,
                offerPrice: offerPrice,
                discountPercent: discountPercent,
                rating: product.rating || 5,
                reviewsCount: product.reviewsCount || product.reviews_count || 0,
                stockStatus: (product.stockStatus || product.stock_status || 'in_stock') as any,
                image: product.image || product.images?.[0] || '',
                description: '',
                features: [],
                reviews: [],
                tags: [],
              })
            }
            className={`p-3.5 border rounded-2xl transition-all ${
              isWishlisted
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                : 'border-border-custom/80 hover:border-primary text-muted-custom hover:text-primary bg-card'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border-custom/80 text-center">
        <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
          <span className="text-[10px] font-black text-foreground block uppercase">Verified Source</span>
        </div>
        <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
          <Truck className="w-5 h-5 text-primary mx-auto" />
          <span className="text-[10px] font-black text-foreground block uppercase">Express Dispatch</span>
        </div>
        <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
          <RotateCcw className="w-5 h-5 text-indigo-500 mx-auto" />
          <span className="text-[10px] font-black text-foreground block uppercase">7-Day Return</span>
        </div>
      </div>
    </div>
  );
}

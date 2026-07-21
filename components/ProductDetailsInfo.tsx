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
  Plus
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
      originalPrice: product.original_price,
      offerPrice: product.sale_price || product.original_price,
      discountPercent: product.sale_price
        ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
        : 0,
      rating: product.rating || 5,
      reviewsCount: product.reviews_count || 0,
      stockStatus: product.stock_status || 'in_stock',
      image: product.images?.[0] || '/placeholder-product.png',
      description: product.description || '',
      features: product.features || [],
      reviews: [],
      tags: [],
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const discountPercent = product.sale_price
    ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        {product.brand && (
          <Link
            href={`/brand/${product.brand.slug}`}
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
          >
            {product.brand.name}
          </Link>
        )}
        {product.sku && (
          <span className="text-xs text-foreground/50 font-mono">SKU: {product.sku}</span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
        </div>
        <span className="text-xs text-foreground/60 font-medium">
          ({product.reviews_count || 0} customer reviews)
        </span>
      </div>

      <div className="p-4 bg-muted/20 border border-border/40 rounded-2xl flex items-baseline gap-3">
        <span className="text-3xl font-black text-primary">
          ₹{(product.sale_price || product.original_price).toLocaleString()}
        </span>
        {product.sale_price && product.sale_price < product.original_price && (
          <span className="text-base text-foreground/50 line-through">
            ₹{product.original_price.toLocaleString()}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold text-white bg-rose-500 px-2.5 py-1 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>

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
        <span className="text-sm font-semibold capitalize text-foreground/80">
          {product.stock_status === 'out_of_stock'
            ? 'Out of Stock'
            : product.stock_status === 'low_stock'
            ? 'Low Stock - Order Soon'
            : 'In Stock & Ready to Ship'}
        </span>
      </div>

      {product.description && (
        <p className="text-sm text-foreground/70 leading-relaxed border-t border-border/40 pt-4">
          {product.description}
        </p>
      )}

      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground/80">Quantity:</span>
          <div className="flex items-center border border-border/40 rounded-xl bg-card">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-muted text-foreground/60 hover:text-foreground"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-bold text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-muted text-foreground/60 hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock_status === 'out_of_stock'}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-6 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <ShoppingBag className="w-5 h-5" />
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
                originalPrice: product.original_price,
                offerPrice: product.sale_price || product.original_price,
                discountPercent: 0,
                rating: 5,
                reviewsCount: 0,
                stockStatus: 'in_stock',
                image: product.images?.[0] || '',
                description: '',
                features: [],
                reviews: [],
                tags: [],
              })
            }
            className={`p-3.5 border rounded-2xl transition-all ${
              isWishlisted
                ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                : 'border-border/40 hover:border-primary text-foreground/70 hover:text-primary'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-border/40 text-center">
        <div className="p-3 bg-muted/20 rounded-2xl space-y-1">
          <ShieldCheck className="w-5 h-5 text-primary mx-auto" />
          <span className="text-[11px] font-semibold text-foreground/80 block">Verified Brand</span>
        </div>
        <div className="p-3 bg-muted/20 rounded-2xl space-y-1">
          <Truck className="w-5 h-5 text-primary mx-auto" />
          <span className="text-[11px] font-semibold text-foreground/80 block">Fast Express Delivery</span>
        </div>
        <div className="p-3 bg-muted/20 rounded-2xl space-y-1">
          <RotateCcw className="w-5 h-5 text-primary mx-auto" />
          <span className="text-[11px] font-semibold text-foreground/80 block">7 Days Return</span>
        </div>
      </div>
    </div>
  );
}

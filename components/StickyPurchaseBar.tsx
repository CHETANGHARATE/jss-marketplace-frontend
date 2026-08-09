'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, Heart } from 'lucide-react';
import { ApiProduct } from '../types/api';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useToast } from './Toast';

interface StickyPurchaseBarProps {
  product: ApiProduct;
}

export function StickyPurchaseBar({ product }: StickyPurchaseBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart, wishlist, toggleWishlist } = useCartWishlist();
  const { cartSuccess, wishlistSuccess } = useToast();

  const isWishlisted = wishlist.some((item) => String(item.id) === String(product.id));

  const origPrice = product.originalPrice ?? product.original_price ?? 0;
  const offerPrice = product.offerPrice ?? product.sale_price ?? origPrice;

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past main product actions (approx 650px)
      if (window.scrollY > 650) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const mappedProduct = {
    id: String(product.id),
    slug: product.slug || String(product.id),
    name: product.name,
    brand: product.brand?.name || 'Generic',
    seller: {
      id: String(product.seller_id || product.seller?.id || 1),
      name: product.seller?.name || 'Marketplace Vendor',
      rating: 4.8,
      location: 'India',
      joinedDate: '2024',
      description: 'Verified seller',
    },
    category: typeof product.category?.name === 'string' ? product.category.name : (product.category?.slug || 'general'),
    subcategory: '',
    originalPrice: origPrice,
    offerPrice: offerPrice,
    discountPercent: 0,
    rating: product.rating || 4.8,
    reviewsCount: product.reviews_count || product.reviewsCount || 0,
    stockStatus: (product.stock_status || 'in_stock') as any,
    image: product.image || product.images?.[0] || '/placeholder-product.png',
    description: product.description || '',
    features: product.features || [],
    reviews: [],
    tags: [],
  };

  const handleAddToCart = () => {
    addToCart(mappedProduct, 1);
    cartSuccess(`✓ ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(mappedProduct, 1);
    window.location.href = '/checkout';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[990] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-border-custom/80 shadow-2xl py-3 px-4 transition-all duration-300 animate-slide-up">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Compact Product Image & Name */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={mappedProduct.image}
            alt={product.name}
            className="w-11 h-11 rounded-xl object-cover border border-border-custom shrink-0 hidden sm:block"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black text-foreground truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-black text-primary">₹{offerPrice.toLocaleString()}</span>
              {origPrice > offerPrice && (
                <span className="text-[10px] text-muted-custom line-through font-semibold hidden sm:inline">
                  ₹{origPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Purchase Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => toggleWishlist(mappedProduct)}
            className={`p-2.5 rounded-xl border transition-all hidden md:flex items-center justify-center ${
              isWishlisted
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                : 'border-border-custom hover:border-rose-500 text-muted-custom hover:text-rose-500 bg-card'
            }`}
            title="Wishlist"
          >
            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_status === 'out_of_stock'}
            className="flex items-center gap-1.5 bg-card hover:bg-primary/10 text-primary border-2 border-primary px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs transition-all uppercase tracking-wider disabled:opacity-50"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Cart</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock_status === 'out_of_stock'}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-5 sm:px-8 py-2.5 rounded-xl font-black text-xs transition-all shadow-md uppercase tracking-wider disabled:opacity-50"
          >
            <Zap size={15} className="fill-current" />
            <span>Buy Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}

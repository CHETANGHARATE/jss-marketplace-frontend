'use client';

import React from 'react';
import Link from 'next/link';
import {
  usePersonalizedRecommendationsQuery,
  useTrendingProductsQuery
} from '../hooks/usePersonalization';
import { Sparkles, Star, ShoppingCart } from 'lucide-react';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ApiProduct } from '../types/api';
import { Product } from '../types';

export function PersonalizedSection() {
  const { data: recs = [] } = usePersonalizedRecommendationsQuery();
  const { data: trending = [] } = useTrendingProductsQuery();
  const { addToCart } = useCartWishlist();
  const { t } = useLanguage();

  const displayProducts = recs.length > 0 ? recs : trending;

  if (displayProducts.length === 0) return null;

  const mapToProduct = (p: ApiProduct): Product => {
    const origPrice = p.originalPrice ?? p.original_price ?? 0;
    const offerPrice = p.offerPrice ?? p.sale_price ?? origPrice;
    const stockQty = p.stockQuantity ?? p.stock_quantity ?? 0;
    const imgUrl = p.image || p.images?.[0] || '/placeholder-product.png';

    return {
      id: String(p.id),
      name: p.name,
      description: p.description || p.name,
      category: typeof p.category?.name === 'string' ? p.category.name : 'Electronics',
      subcategory: 'General',
      brand: p.brand?.name || 'Generic',
      originalPrice: origPrice,
      offerPrice: offerPrice,
      discountPercent: p.discountPercent ?? (origPrice > offerPrice ? Math.round(((origPrice - offerPrice) / origPrice) * 100) : 0),
      rating: p.rating ? Number(p.rating) : 5.0,
      reviewsCount: p.reviewsCount || p.reviews_count || 10,
      image: imgUrl,
      seller: { id: 's1', name: 'JSS Merchant', location: 'Mumbai', rating: 4.8, joinedDate: '2025', description: 'Verified JSS Merchant' },
      stockStatus: stockQty > 0 ? 'in_stock' : 'out_of_stock',
      features: [],
      reviews: [],
      tags: [],
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">{t('home.recommended_for_you')}</h2>
        </div>
        <span className="text-xs font-bold text-foreground/50">{t('home.personalized_insights')}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {displayProducts.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="group bg-card border border-border/40 rounded-3xl p-4 shadow-sm hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <Link href={`/product/${product.slug || product.id}`} className="space-y-3 block">
              <div className="h-36 w-full bg-background-secondary rounded-2xl overflow-hidden relative border border-border-custom/40">
                <img
                  src={product.images?.[0] || '/placeholder-product.png'}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-tight">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-sm text-primary">
                    ₹{(product.offerPrice ?? product.originalPrice ?? product.sale_price ?? product.original_price ?? 0).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{product.rating ? Number(product.rating).toFixed(1) : '5.0'}</span>
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => addToCart(mapToProduct(product), 1)}
              className="w-full py-2 bg-muted/40 hover:bg-primary hover:text-primary-foreground text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{t('prod.add_to_cart')}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

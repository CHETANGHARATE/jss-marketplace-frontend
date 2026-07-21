'use client';

import React from 'react';
import Link from 'next/link';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { Clock, Trash2 } from 'lucide-react';

export function RecentlyViewedSection() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 pt-8 border-t border-border/40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Recently Viewed Products</h3>
        </div>
        <button
          onClick={clearRecentlyViewed}
          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/50 hover:text-rose-500 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentlyViewed.map((prod) => (
          <Link
            key={prod.id}
            href={`/product/${prod.slug}`}
            className="group bg-card border border-border/40 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-primary/50 transition-all space-y-2"
          >
            <div className="aspect-square w-full bg-muted/20 rounded-xl p-2 flex items-center justify-center overflow-hidden">
              <img
                src={prod.images?.[0] || '/placeholder-product.png'}
                alt={prod.name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {prod.name}
            </h4>
            <span className="text-xs font-bold text-primary block">
              ₹{(prod.sale_price || prod.original_price).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

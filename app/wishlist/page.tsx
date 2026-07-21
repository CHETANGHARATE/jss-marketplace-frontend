'use client';

import React from 'react';
import Link from 'next/link';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />

        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Wishlist is Empty</h2>
          <p className="text-sm text-foreground/60 max-w-sm mx-auto">
            Save items you love to your wishlist so you can track prices and easily move them to your cart later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Discover Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <span>Saved Wishlist</span>
            <span className="text-xs bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full font-bold">
              {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
            </span>
          </h1>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            Manage your saved items and move them to your cart whenever you are ready.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((prod) => (
          <div
            key={prod.id}
            className="group bg-card border border-border/40 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="aspect-square w-full bg-muted/20 rounded-2xl p-4 flex items-center justify-center overflow-hidden relative">
              <img
                src={prod.image}
                alt={prod.name}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
              />
              <button
                onClick={() => toggleWishlist(prod)}
                className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-md rounded-xl text-foreground/40 hover:text-rose-500 transition-colors shadow-xs"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-primary uppercase">{prod.brand}</span>
              <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {prod.name}
              </h4>
            </div>

            <div className="pt-3 border-t border-border/40 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-primary">
                  ₹{prod.offerPrice.toLocaleString()}
                </span>
                {prod.originalPrice > prod.offerPrice && (
                  <span className="text-xs text-foreground/50 line-through">
                    ₹{prod.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  addToCart(prod);
                  toggleWishlist(prod);
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-xs active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

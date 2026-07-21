'use client';

import React from 'react';
import Link from 'next/link';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CartItemCard } from '../../components/CartItemCard';
import { CartSummary } from '../../components/CartSummary';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, cartItemCount } =
    useCartWishlist();

  if (cart.length === 0) {
    return (
      <div className="space-y-8">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-foreground/60 max-w-sm mx-auto">
            Looks like you haven't added any items to your cart yet. Explore our top categories and deals!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Marketplace Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            Review your selected items before proceeding to secure checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border/40 rounded-xl text-xs font-bold text-foreground/60 hover:text-rose-500 hover:border-rose-500/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <CartItemCard
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateCartQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4">
          <CartSummary subtotal={cartTotal} itemCount={cartItemCount} />
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartWishlist } from '../../contexts/CartWishlistContext';
import { useToast } from '../../components/Toast';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { CartItemCard } from '../../components/CartItemCard';
import { CartSummary } from '../../components/CartSummary';
import { cartService, SavedForLaterItem } from '../../services/cartService';
import { Product } from '../../types';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Bookmark,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const SAVED_STORAGE_KEY = 'jss_saved_for_later_guest';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, cartItemCount, addToCart } =
    useCartWishlist();
  const { success, error: toastError, info } = useToast();

  const [savedItems, setSavedItems] = useState<SavedForLaterItem[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // Load saved items from backend / local storage fallback
  useEffect(() => {
    cartService
      .getSavedForLater()
      .then((items) => {
        if (items && items.length > 0) {
          setSavedItems(items);
        } else {
          // Fallback to local storage for guest
          try {
            const raw = localStorage.getItem(SAVED_STORAGE_KEY);
            if (raw) setSavedItems(JSON.parse(raw));
          } catch (e) {}
        }
      })
      .catch(() => {
        try {
          const raw = localStorage.getItem(SAVED_STORAGE_KEY);
          if (raw) setSavedItems(JSON.parse(raw));
        } catch (e) {}
      })
      .finally(() => {
        setLoadingSaved(false);
      });
  }, []);

  const persistLocalSaved = (items: SavedForLaterItem[]) => {
    setSavedItems(items);
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  };

  const handleSaveForLater = async (productId: string) => {
    const itemToSave = cart.find((i) => String(i.product.id) === String(productId));
    if (!itemToSave) return;

    const numId = parseInt(productId, 10);
    const newSavedItem: SavedForLaterItem = {
      id: Date.now(),
      product_id: isNaN(numId) ? Date.now() : numId,
      name: itemToSave.product.name,
      slug: itemToSave.product.slug || productId,
      image: itemToSave.product.image,
      quantity: itemToSave.quantity,
      current_price: itemToSave.product.offerPrice,
      saved_price: itemToSave.product.offerPrice,
      price_changed: false,
      price_difference: 0,
      in_stock: itemToSave.product.stockStatus === 'in_stock',
      stock_quantity: 10,
      is_active: true,
      saved_at: new Date().toISOString(),
      brand: itemToSave.product.brand,
      category: itemToSave.product.category,
    };

    // Remove from active cart
    removeFromCart(productId);

    // Call backend API if possible
    try {
      if (!isNaN(numId)) {
        await cartService.saveForLater(numId);
      }
    } catch (e) {
      // Handled via local state fallback
    }

    const updated = [newSavedItem, ...savedItems.filter((s) => s.slug !== newSavedItem.slug)];
    persistLocalSaved(updated);
    success(`"${itemToSave.product.name}" moved to Saved for Later.`, 'Saved for Later');
  };

  const handleMoveToCart = async (item: SavedForLaterItem) => {
    if (!item.in_stock || !item.is_active) {
      toastError('This product is currently out of stock or unavailable.', 'Unavailable');
      return;
    }

    const mappedProduct: Product = {
      id: String(item.product_id),
      slug: item.slug,
      name: item.name,
      brand: item.brand || 'JSS Certified',
      seller: {
        id: '1',
        name: 'JSS Verified Seller',
        rating: 4.8,
        location: 'India',
        joinedDate: '2024',
        description: 'Verified merchant',
      },
      category: item.category || 'General',
      subcategory: '',
      originalPrice: item.saved_price,
      offerPrice: item.current_price,
      discountPercent: item.saved_price > item.current_price
        ? Math.round(((item.saved_price - item.current_price) / item.saved_price) * 100)
        : 0,
      rating: 4.8,
      reviewsCount: 45,
      stockStatus: 'in_stock',
      image: item.image,
      description: '',
      features: [],
      reviews: [],
      tags: [],
    };

    // Call backend moveToCart if applicable
    try {
      if (item.id && typeof item.id === 'number') {
        await cartService.moveToCart(item.id);
      }
    } catch (e) {
      // Local fallback
    }

    // Add back to active cart
    addToCart(mappedProduct, item.quantity || 1);

    // Remove from saved list
    const updated = savedItems.filter((s) => s.id !== item.id);
    persistLocalSaved(updated);

    if (item.price_changed) {
      info(
        `Price updated to ₹${item.current_price.toLocaleString('en-IN')}`,
        'Live Price Applied'
      );
    } else {
      success(`"${item.name}" moved back to active cart!`, 'Cart Updated');
    }
  };

  const handleRemoveSaved = async (id: number) => {
    try {
      await cartService.removeSavedItem(id);
    } catch (e) {}

    const updated = savedItems.filter((s) => s.id !== id);
    persistLocalSaved(updated);
    info('Item removed from Saved for Later.', 'Removed');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      {/* Main Cart Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-foreground/60 font-medium mt-1">
            {cart.length > 0
              ? 'Review your selected items before proceeding to secure checkout.'
              : 'Your active shopping cart is currently empty.'}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border/40 rounded-xl text-xs font-bold text-foreground/60 hover:text-rose-500 hover:border-rose-500/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* Cart Grid / Empty Cart View */}
      {cart.length === 0 ? (
        <div className="py-12 text-center bg-card border border-border/40 rounded-3xl space-y-4 shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-foreground/60 max-w-sm mx-auto">
            Explore our verified merchant catalog and discover great deals across all categories.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Marketplace Catalog</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
                onSaveForLater={handleSaveForLater}
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
      )}

      {/* Feature 15: Dedicated Saved for Later Section */}
      {savedItems.length > 0 && (
        <div className="pt-8 border-t border-border/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Saved for Later
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Items saved from your cart with live pricing and availability revalidation.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card border border-border/60 rounded-2xl flex items-start gap-4 shadow-sm hover:border-primary/30 transition-all group"
              >
                <div className="relative w-20 h-20 bg-muted/20 rounded-xl overflow-hidden shrink-0 border border-border/40">
                  <Image
                    src={item.image || '/images/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  {item.brand && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {item.brand}
                    </span>
                  )}
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-xs font-bold text-foreground truncate block hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>

                  {/* Price & Price Drop Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-foreground">
                      ₹{Number(item.current_price).toLocaleString('en-IN')}
                    </span>

                    {item.price_changed && (
                      <span
                        className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                          item.price_difference < 0
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.price_difference < 0 ? (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            ₹{Math.abs(item.price_difference)} cheaper
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            +₹{item.price_difference}
                          </>
                        )}
                      </span>
                    )}

                    {!item.in_stock && (
                      <span className="text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* Move to Cart & Remove Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={!item.in_stock}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        item.in_stock
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>

                    <button
                      onClick={() => handleRemoveSaved(item.id)}
                      className="px-2.5 py-1.5 text-xs text-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

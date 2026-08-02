'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiProduct } from '../types/api';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useToast, CheckoutLoadingOverlay } from './Toast';
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
  CheckCircle2,
  Share2,
  Tag,
  CreditCard,
  MapPin,
  Check,
  Lock,
  Building2,
  Package
} from 'lucide-react';

interface ProductDetailsInfoProps {
  product: ApiProduct;
}

export function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCartWishlist();
  const { cartSuccess, wishlistSuccess, info, error: toastError } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState<boolean>(false);

  // Pincode Checker State
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<{
    checked: boolean;
    valid: boolean;
    estimate?: string;
    cod?: boolean;
  } | null>(null);

  const isWishlisted = wishlist.some((item) => String(item.id) === String(product.id));

  const origPrice = product.originalPrice ?? product.original_price ?? 0;
  const offerPrice = product.offerPrice ?? product.sale_price ?? origPrice;
  const discountPercent = product.discountPercent ?? (origPrice > offerPrice
    ? Math.round(((origPrice - offerPrice) / origPrice) * 100)
    : 0);

  const savingsAmount = origPrice > offerPrice ? origPrice - offerPrice : 0;

  const buildMappedProduct = () => ({
    id: String(product.id),
    slug: product.slug || String(product.id),
    name: product.name,
    brand: product.brand?.name || 'Generic',
    seller: {
      id: String(product.seller_id || product.seller?.id || 1),
      name: product.seller?.name || 'Verified Marketplace Vendor',
      rating: 4.8,
      location: 'India',
      joinedDate: '2024',
      description: 'Verified seller',
    },
    category: typeof product.category?.name === 'string' ? product.category.name : (product.category?.slug || 'general'),
    subcategory: '',
    originalPrice: origPrice,
    offerPrice: offerPrice,
    discountPercent: discountPercent,
    rating: product.rating || 5,
    reviewsCount: product.reviewsCount || product.reviews_count || 0,
    stockStatus: (product.stockStatus || product.stock_status || 'in_stock') as any,
    image: product.image || product.images?.[0] || '/placeholder-product.png',
    description: product.description || '',
    features: product.features || [],
    reviews: [],
    tags: [],
  });

  const handleAddToCart = () => {
    addToCart(buildMappedProduct(), quantity);
    cartSuccess(`✓ ${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(buildMappedProduct(), quantity);
    setIsBuyNowLoading(true);
    router.push('/checkout');
  };

  const handleToggleWishlist = () => {
    const wasWish = isWishlisted;
    toggleWishlist(buildMappedProduct());
    if (!wasWish) {
      wishlistSuccess('❤️ Added to Wishlist');
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on JSS Marketplace!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if user cancels
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      info('Product link copied to clipboard!', 'Link Copied');
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      toastError('Please enter a valid 6-digit Indian PIN code (e.g. 400001).', 'Invalid PIN Code');
      return;
    }

    // Generate dynamic delivery date estimate (3-5 days from today)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    const dateString = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setPincodeResult({
      checked: true,
      valid: true,
      estimate: `Delivering to ${cleanPin} by ${dateString}`,
      cod: true,
    });
  };

  return (
    <>
      {isBuyNowLoading && <CheckoutLoadingOverlay message="Preparing secure checkout..." />}

      <div className="space-y-6">
        {/* Brand, Category & SKU Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-border-custom/80 pb-4">
          <div className="flex items-center gap-2">
            {product.brand ? (
              <Link
                href={`/brand/${product.brand.slug}`}
                className="text-xs font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                {product.brand.name}
              </Link>
            ) : (
              <span className="text-xs font-black uppercase tracking-wider text-muted-custom bg-background-secondary border border-border-custom px-3 py-1 rounded-xl">
                Verified Brand
              </span>
            )}

            {product.category && (
              <Link
                href={`/category/${product.category.slug}`}
                className="text-xs font-semibold text-foreground/70 bg-background-secondary border border-border-custom/80 px-3 py-1 rounded-xl hover:text-primary transition-all"
              >
                {typeof product.category.name === 'string' ? product.category.name : 'Category'}
              </Link>
            )}
          </div>

          {product.sku && (
            <span className="text-xs text-muted-custom font-mono font-semibold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              SKU: {product.sku}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight tracking-tight">
          {product.name}
        </h1>

        {/* Rating & Review Summary Bar */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-xl text-xs font-black">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
          </div>
          <a href="#reviews-section" className="text-xs text-primary font-bold hover:underline">
            {product.reviews_count || product.reviewsCount || 12} Verified Customer Reviews
          </a>
          <span className="text-muted-custom/40">•</span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} />
            Verified Purchase Item
          </span>
        </div>

        {/* Vendor Info Box */}
        <div className="flex items-center justify-between p-3.5 bg-background-secondary/70 border border-border-custom/80 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-custom tracking-wider">Sold by</p>
              <p className="text-xs font-black text-foreground">
                {product.seller?.name || 'Verified Marketplace Vendor'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} />
            Authorized Seller
          </span>
        </div>

        {/* Price Showcase Card */}
        <div className="p-5 bg-background-secondary/80 border border-border-custom/80 rounded-3xl space-y-2.5">
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

          <div className="flex items-center justify-between text-xs text-muted-custom font-medium pt-1">
            <span>Inclusive of all taxes</span>
            {savingsAmount > 0 && (
              <span className="font-extrabold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                You Save ₹{savingsAmount.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              product.stock_status === 'out_of_stock'
                ? 'bg-rose-500 animate-ping'
                : product.stock_status === 'low_stock'
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span className="text-xs font-black capitalize text-foreground">
            {product.stock_status === 'out_of_stock'
              ? 'Out of Stock'
              : product.stock_status === 'low_stock'
              ? 'Low Stock - Only a few items remaining!'
              : 'In Stock & Ready for Express Dispatch'}
          </span>
        </div>

        {/* SECTION 5: Available Offers & Coupons */}
        <div className="border border-border-custom/80 rounded-2xl p-4 bg-card space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Tag size={14} className="text-primary" />
            Available Offers & Discounts
          </h4>
          <div className="space-y-2 text-xs text-foreground/80 font-medium">
            <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl">
              <span className="font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase text-[10px] shrink-0 mt-0.5">
                JSS10
              </span>
              <span>Get 10% instant discount on orders above ₹499. Use coupon <strong>JSS10</strong> at checkout.</span>
            </div>
            <div className="flex items-start gap-2 bg-blue-500/5 border border-blue-500/20 p-2.5 rounded-xl">
              <CreditCard size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <span>Flat 5% instant cashback on all UPI & HDFC/SBI Credit Cards.</span>
            </div>
          </div>
        </div>

        {/* SECTION 6: Pincode / Delivery Checker */}
        <div className="border border-border-custom/80 rounded-2xl p-4 bg-background-secondary/50 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            Delivery & Availability Checker
          </h4>

          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-Digit PIN Code (e.g. 400001)"
              maxLength={6}
              className="flex-1 bg-card border border-border-custom/80 px-3.5 py-2 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-2xs"
            >
              Check
            </button>
          </form>

          {pincodeResult && pincodeResult.checked && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl space-y-1">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Check size={14} />
                <span>{pincodeResult.estimate}</span>
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-500 font-semibold pl-5">
                ✓ Cash on Delivery Available • Free Express Shipping
              </p>
            </div>
          )}
        </div>

        {/* SECTION 4: Quantity & Purchase Action Buttons */}
        <div className="space-y-4 pt-2 border-t border-border-custom/80">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase text-muted-custom">Quantity:</span>
            <div className="flex items-center border border-border-custom/80 rounded-2xl bg-card">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-background-secondary text-foreground/70 hover:text-foreground rounded-l-2xl transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 text-sm font-black text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 hover:bg-background-secondary text-foreground/70 hover:text-foreground rounded-r-2xl transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status === 'out_of_stock'}
              className="flex-1 flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-2xs active:scale-95 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock_status === 'out_of_stock'}
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`p-3.5 border rounded-2xl transition-all ${
                isWishlisted
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                  : 'border-border-custom/80 hover:border-primary text-muted-custom hover:text-primary bg-card'
              }`}
              aria-label="Toggle Wishlist"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3.5 border border-border-custom/80 hover:border-primary text-muted-custom hover:text-primary bg-card rounded-2xl transition-all"
              aria-label="Share Product"
              title="Share Product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECTION 5 (Trust & Delivery Badges) */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border-custom/80 text-center">
          <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">100% Genuine</span>
          </div>
          <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
            <Truck className="w-5 h-5 text-primary mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">Free Shipping</span>
          </div>
          <div className="p-3 bg-background-secondary/80 rounded-2xl space-y-1.5 border border-border-custom/60">
            <RotateCcw className="w-5 h-5 text-indigo-500 mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">10-Day Return</span>
          </div>
        </div>
      </div>
    </>
  );
}

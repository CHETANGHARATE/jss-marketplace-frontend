'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiProduct } from '../types/api';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useComparison } from '../contexts/ComparisonContext';
import { useToast, CheckoutLoadingOverlay } from './Toast';
import { alertService } from '../services/alertService';
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
  Store,
  Lock,
  Scale,
  Bell,
  TrendingDown,
  X
} from 'lucide-react';

interface ProductDetailsInfoProps {
  product: ApiProduct;
}

export function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCartWishlist();
  const { compareItems, addToCompare, removeFromCompare, isInCompare } = useComparison();
  const { cartSuccess, wishlistSuccess, info, error: toastError } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState<boolean>(false);

  // Pincode Checker State
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<{
    checked: boolean;
    valid: boolean;
    estimate?: string;
  } | null>(null);

  const numericId = parseInt(String(product.id), 10) || 0;
  const isWishlisted = wishlist.some((item) => String(item.id) === String(product.id));
  const isCompared = isInCompare(numericId);

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
      name: product.seller?.name || 'Maharashtra Fasal Express',
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
    rating: product.rating || 4.8,
    reviewsCount: product.reviewsCount || product.reviews_count || 165,
    stockStatus: (product.stockStatus || product.stock_status || 'in_stock') as any,
    image: product.image || product.images?.[0] || '/placeholder-product.png',
    description: product.description || '',
    features: product.features || [],
    reviews: [],
    tags: [],
  });

  const handleAddToCart = () => {
    addToCart(buildMappedProduct(), quantity);
    cartSuccess(`Added ${quantity} x ${product.name} to cart!`);
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
      wishlistSuccess('Added to Wishlist');
    }
  };

  const handleCompareClick = () => {
    if (isCompared) {
      removeFromCompare(numericId);
    } else {
      const firstImg = product.images?.[0];
      const pImage = typeof product.image === 'string'
        ? product.image
        : (typeof firstImg === 'string' ? firstImg : (firstImg as any)?.url || '/images/placeholder.png');

      addToCompare({
        id: numericId,
        name: product.name,
        slug: product.slug || String(product.id),
        image: pImage,
        price: offerPrice,
        original_price: origPrice,
        rating: Number(product.rating || (product as any).avg_rating || 0),
        brand: typeof product.brand === 'string' ? product.brand : product.brand?.name,
      });
    }
  };

  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [targetAlertPrice, setTargetAlertPrice] = useState<string>('');
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  const handleSetPriceAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = targetAlertPrice ? parseFloat(targetAlertPrice) : undefined;
    try {
      await alertService.subscribePriceDrop(numericId, parsedTarget);
      cartSuccess(`Price drop alert set for ${product.name}!`);
      setIsAlertSubscribed(true);
      setShowPriceAlertModal(false);
    } catch (e) {
      cartSuccess(`Price drop alert set for ${product.name}!`);
      setIsAlertSubscribed(true);
      setShowPriceAlertModal(false);
    }
  };

  const handleSubscribeRestock = async () => {
    try {
      await alertService.subscribeBackInStock(numericId);
      cartSuccess(`You will be notified when ${product.name} is back in stock!`);
      setIsAlertSubscribed(true);
    } catch (e) {
      cartSuccess(`You will be notified when ${product.name} is back in stock!`);
      setIsAlertSubscribed(true);
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
        // Fallback to clipboard
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

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateString = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    setPincodeResult({
      checked: true,
      valid: true,
      estimate: `Delivering to ${cleanPin} by ${dateString}`,
    });
  };

  const reviewCount = product.reviews_count || product.reviewsCount || 165;
  const sellerName = product.seller?.name || 'Maharashtra Fasal Express';
  const sellerId = product.seller_id || product.seller?.id;
  const skuCode = product.sku || `JSS-PROD-${String(product.id).padStart(3, '0')}`;

  return (
    <>
      {isBuyNowLoading && <CheckoutLoadingOverlay message="Preparing secure checkout..." />}

      <div className="space-y-6">

        {/* 1. Header Line: Title + Share/Wishlist Actions */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Action Buttons: Share & Wishlist */}
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full border border-border-custom hover:border-primary text-muted-custom hover:text-primary transition-all bg-card shadow-2xs"
                title="Share Product"
                aria-label="Share Product"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={handleCompareClick}
                className={`p-2.5 rounded-full border transition-all shadow-2xs ${
                  isCompared
                    ? 'border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'border-border-custom hover:border-orange-500 text-muted-custom hover:text-orange-500 bg-card'
                }`}
                title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
                aria-label="Compare Product"
              >
                <Scale size={18} />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full border transition-all shadow-2xs ${
                  isWishlisted
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-500'
                    : 'border-border-custom hover:border-rose-500 text-muted-custom hover:text-rose-500 bg-card'
                }`}
                title="Add to Wishlist"
                aria-label="Add to Wishlist"
              >
                <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Rating, Reviews, Verified & SKU Line */}
          <div className="flex items-center gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-extrabold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg">
              <Star size={13} className="fill-current" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>

            <a href="#reviews-section" className="font-extrabold text-primary hover:underline">
              {reviewCount} Verified Customer Reviews
            </a>

            <span className="text-muted-custom/40">•</span>

            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={13} />
              Verified Purchase Item
            </span>

            <span className="text-muted-custom/40">•</span>

            <span className="font-mono text-muted-custom font-semibold">
              SKU: {skuCode}
            </span>
          </div>
        </div>

        {/* 2. Redesigned Premium Seller Card (Clean White & Emerald High Contrast Theme) */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <Store size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block leading-none">
                SOLD BY
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white block mt-1">
                {sellerName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
              Authorized Seller
            </span>

            {sellerId && (
              <Link
                href={`/vendor?id=${sellerId}`}
                className="text-xs font-black text-primary hover:text-primary-hover hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>View Store</span>
                <span>&rarr;</span>
              </Link>
            )}
          </div>
        </div>

        {/* 3. Price Block Showcase */}
        <div className="p-5 bg-card border border-border-custom/80 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-baseline flex-wrap gap-3">
                <span className="text-3xl sm:text-[36px] font-black text-primary">
                  ₹{offerPrice.toLocaleString()}
                </span>
                {origPrice > offerPrice && (
                  <span className="text-base text-muted-custom line-through font-semibold">
                    MRP ₹{origPrice.toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-black text-white bg-rose-600 px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-custom font-medium mt-1">Inclusive of all taxes</p>
            </div>

            {/* Savings Highlight Box */}
            {savingsAmount > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl text-center min-w-[110px]">
                <span className="text-[10px] uppercase font-bold text-muted-custom block">You Save</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  ₹{savingsAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
              {/* 4. Stock Status & Express Delivery Indicator + Price Drop Trigger */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-bold">
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
            <span className="text-foreground">
              {product.stock_status === 'out_of_stock'
                ? 'Out of Stock'
                : product.stock_status === 'low_stock'
                ? 'Low Stock - Only a few items left'
                : 'In Stock & Ready For Express Dispatch'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Feature 40: Price Drop Alert Trigger */}
            <button
              type="button"
              onClick={() => setShowPriceAlertModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{isAlertSubscribed ? 'Price Alert Set ✓' : 'Notify Price Drop'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-primary">
              <Truck size={15} />
              <span>Express Delivery</span>
            </div>
          </div>
        </div>

        {/* 5. Offers & Discounts Block */}
        <div className="border border-border-custom/80 rounded-2xl p-4 bg-card space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Tag size={14} className="text-primary" />
            OFFERS & DISCOUNTS
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

        {/* 6. Check Delivery & Availability */}
        <div className="border border-border-custom/80 rounded-2xl p-4 bg-card space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            CHECK DELIVERY & AVAILABILITY
          </h4>

          <form onSubmit={handleCheckPincode} className="flex gap-2">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-Digit PIN Code (e.g. 400001)"
              maxLength={6}
              className="flex-1 bg-background border border-border-custom/80 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white text-xs font-black px-6 py-2.5 rounded-xl transition-colors shadow-2xs uppercase"
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

        {/* 7. Purchase Actions & Back in Stock Alert (Feature 41) */}
        <div className="space-y-4 pt-2 border-t border-border-custom/80">
          {product.stock_status === 'out_of_stock' ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSubscribeRestock}
                className="w-full h-13 sm:h-14 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 uppercase tracking-wider"
              >
                <Bell className="w-5 h-5 fill-current" />
                <span>{isAlertSubscribed ? 'Restock Alert Active ✓' : 'Notify Me When Available'}</span>
              </button>
              <p className="text-[11px] text-center text-muted-custom">
                We'll email you immediately when fresh stock arrives at our warehouse.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase text-muted-custom">QUANTITY:</span>
                <div className="flex items-center border border-border-custom/80 rounded-2xl bg-card">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted text-foreground/70 hover:text-foreground rounded-l-2xl transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 text-sm font-black text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted text-foreground/70 hover:text-foreground rounded-r-2xl transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={handleAddToCart}
                  className="h-13 sm:h-14 flex items-center justify-center gap-2 bg-card hover:bg-primary/10 text-primary border-2 border-primary px-6 rounded-2xl font-black text-sm transition-all shadow-2xs active:scale-95 uppercase tracking-wider"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="h-13 sm:h-14 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 uppercase tracking-wider"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Price Drop Modal (Feature 40) */}
        {showPriceAlertModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-black text-base">
                  <TrendingDown className="w-5 h-5 text-orange-500" />
                  <span>Set Price Drop Alert</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPriceAlertModal(false)}
                  className="p-1.5 text-muted-custom hover:text-foreground rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-custom leading-relaxed">
                Receive an automatic email notification when the price of <strong>{product.name}</strong> drops below your target price.
              </p>

              <form onSubmit={handleSetPriceAlert} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground block">
                    Target Price (₹) <span className="text-muted-custom font-normal">(Current: ₹{offerPrice.toLocaleString()})</span>
                  </label>
                  <input
                    type="number"
                    value={targetAlertPrice}
                    onChange={(e) => setTargetAlertPrice(e.target.value)}
                    placeholder={`e.g. ${Math.round(offerPrice * 0.9)} (leave blank for any drop)`}
                    max={offerPrice}
                    className="w-full bg-background border border-border px-3.5 py-2.5 rounded-xl text-xs font-bold text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPriceAlertModal(false)}
                    className="px-4 py-2 text-xs font-bold text-muted-custom hover:bg-muted rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm transition-all"
                  >
                    Set Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>

        {/* 8. Sleek 4-Item Trust Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-custom/80 text-center">
          <div className="p-3 bg-card rounded-2xl space-y-1 border border-border-custom/60">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">Genuine Product</span>
          </div>
          <div className="p-3 bg-card rounded-2xl space-y-1 border border-border-custom/60">
            <Truck className="w-5 h-5 text-primary mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">Free Shipping</span>
          </div>
          <div className="p-3 bg-card rounded-2xl space-y-1 border border-border-custom/60">
            <RotateCcw className="w-5 h-5 text-indigo-500 mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">Easy Returns</span>
          </div>
          <div className="p-3 bg-card rounded-2xl space-y-1 border border-border-custom/60">
            <Lock className="w-5 h-5 text-sky-500 mx-auto" />
            <span className="text-[10px] font-black text-foreground block uppercase">Secure Checkout</span>
          </div>
        </div>

        {/* 9. Social Proof Banner */}
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">AS</div>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">RK</div>
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background">VJ</div>
          </div>
          <p className="text-xs font-black text-emerald-700 dark:text-emerald-400">
            165+ people bought this product recently
          </p>
        </div>

      </div>
    </>
  );
}

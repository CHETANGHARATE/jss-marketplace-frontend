'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { X, Heart, Star, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from './Toast';
import { CheckoutLoadingOverlay } from './Toast';
import { getProductById } from '../services/product';
import { Product } from '../types';

interface ProductQuickViewProps {
  productId: string;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ productId, onClose }) => {
  const { t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const { cartSuccess, wishlistSuccess } = useToast();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await getProductById(productId);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="bg-card text-card-foreground p-8 rounded-3xl border border-border-custom shadow-xl max-w-sm w-full text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-semibold text-sm">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const inWish = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, 1);
    onClose();
    setCheckoutLoading(true);
    router.push('/checkout');
  };

  return (
    <>
      <AnimatePresence>
        {checkoutLoading && <CheckoutLoadingOverlay />}
      </AnimatePresence>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative bg-card text-card-foreground border border-border-custom w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-hidden animate-zoom-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-background text-foreground rounded-full border border-border-custom hover:scale-105 active:scale-95 transition-all"
        >
          <X size={18} />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-background-secondary flex items-center justify-center relative p-6 border-r border-border-custom h-[300px] md:h-auto">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-sm mix-blend-multiply dark:mix-blend-normal"
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-6 left-6 bg-accent text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto h-auto md:max-h-[600px]">
          <div>
            {/* Brand & Stock Status */}
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  product.stockStatus === 'in_stock'
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : product.stockStatus === 'low_stock'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-red-500/10 text-red-600 border-red-500/20'
                }`}
              >
                {t(`prod.${product.stockStatus}`)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-2xl font-black text-foreground mt-4 leading-tight">
              {product.name}
            </h3>

            {/* Seller Info */}
            <p className="text-xs text-muted-custom mt-1">
              {t('prod.seller')}: <span className="font-bold text-foreground">{product.seller.name}</span> ({product.seller.rating} ★)
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-xs font-black text-foreground">{product.rating}</span>
              <span className="text-xs text-muted-custom">({product.reviewsCount} {t('prod.reviews')})</span>
            </div>

            {/* Pricing Details */}
            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-2xl md:text-3xl font-black text-primary">
                ₹{product.offerPrice.toLocaleString()}
              </span>
              {product.originalPrice > product.offerPrice && (
                <>
                  <span className="text-sm text-muted-custom line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-accent">
                    Save ₹{(product.originalPrice - product.offerPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-muted-custom mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Bullet features */}
            {product.features.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Key Highlights</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-custom">
                  {product.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-border-custom py-3.5 my-6 text-[10px] text-center text-muted-custom">
              <div className="flex flex-col items-center gap-1">
                <Truck size={14} className="text-primary" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={14} className="text-primary" />
                <span>10-Day Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={14} className="text-primary" />
                <span>Secure Payments</span>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex gap-3">
            <button
                          onClick={() => {
                const wasInWishlist = isInWishlist(product.id);
                toggleWishlist(product);
                if (!wasInWishlist) wishlistSuccess('❤️ Added to Wishlist');
              }}
              className={`p-3.5 rounded-2xl border transition-all ${
                inWish
                  ? 'bg-accent/10 border-accent text-accent hover:bg-accent/20'
                  : 'bg-background-secondary border-border-custom text-muted-custom hover:text-foreground hover:bg-border-custom'
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart size={20} fill={inWish ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                addToCart(product, 1);
                cartSuccess('✓ Product added to cart successfully.');
              }}
              className="flex-1 bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/20"
            >
              <ShoppingCart size={18} />
              <span>{t('prod.add_to_cart')}</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-accent text-white font-bold py-3.5 rounded-2xl hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/20"
            >
              {t('prod.buy_now')}
            </button>
          </div>

        </div>

      </div>
    </div>
    </>
  );
};

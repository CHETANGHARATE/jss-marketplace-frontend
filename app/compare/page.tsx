'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useComparison } from '@/contexts/ComparisonContext';
import { useCartWishlist } from '@/contexts/CartWishlistContext';
import { useToast } from '@/components/Toast';
import { compareService, ComparedProduct } from '@/services/compareService';
import { Product } from '@/types';
import {
  Scale,
  X,
  Plus,
  ShoppingCart,
  Check,
  Star,
  Truck,
  ShieldCheck,
  Store,
  ArrowLeft,
  Trash2,
} from 'lucide-react';

function CompareContent() {
  const searchParams = useSearchParams();
  const { compareItems, removeFromCompare, clearCompare } = useComparison();
  const { addToCart } = useCartWishlist();
  const { cartSuccess, error: toastError } = useToast();

  const [products, setProducts] = useState<ComparedProduct[]>([]);
  const [specKeys, setSpecKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightDiff, setHighlightDiff] = useState(false);

  // Resolve product IDs: from URL params or from context
  useEffect(() => {
    let ids: number[] = [];
    const urlIds = searchParams.get('ids');
    if (urlIds) {
      ids = urlIds
        .split(',')
        .map((i) => parseInt(i.trim(), 10))
        .filter((i) => !isNaN(i) && i > 0);
    } else {
      ids = compareItems.map((item) => item.id);
    }

    if (ids.length < 2) {
      setProducts([]);
      setSpecKeys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    compareService
      .getComparison(ids)
      .then((res) => {
        if (res.success && res.data?.products) {
          setProducts(res.data.products);
          setSpecKeys(res.data.specification_keys || []);
        } else {
          toastError(res.message || 'Failed to fetch comparison data', 'Comparison Error');
        }
      })
      .catch((err) => {
        console.error('Error fetching comparison:', err);
        toastError('Failed to load comparison data. Please try again.', 'Error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, compareItems, toastError]);

  const handleAddToCart = (product: ComparedProduct) => {
    const mapped: Product = {
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      brand: product.brand?.name || 'JSS Certified',
      seller: {
        id: String(product.seller?.id || '1'),
        name: product.seller?.store_name || product.seller?.name || 'Verified Seller',
        rating: product.seller?.rating || 4.8,
        location: 'India',
        joinedDate: '2024',
        description: 'Verified seller on JSS Marketplace',
      },
      category: product.category?.name || 'General',
      subcategory: '',
      originalPrice: product.original_price,
      offerPrice: product.price,
      discountPercent: product.discount_percentage,
      rating: product.rating,
      reviewsCount: product.reviews_count,
      stockStatus: product.in_stock ? 'in_stock' : 'out_of_stock',
      image: product.image,
      description: product.summary || '',
      features: [],
      reviews: [],
      tags: [],
    };

    addToCart(mapped, 1);
    cartSuccess(`Added ${product.name} to your cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          Loading comparison matrix...
        </p>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 shadow-inner">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Compare Products
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          You need at least 2 products to see side-by-side comparisons of specifications, prices, and features.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/search"
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Browse Products
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            Product Comparison
            <span className="text-sm font-medium px-3 py-1 bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 rounded-full">
              {products.length} Products
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            <input
              type="checkbox"
              checked={highlightDiff}
              onChange={(e) => setHighlightDiff(e.target.checked)}
              className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
            />
            Highlight Differences
          </label>

          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          {/* Header Row: Products */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75">
              <th className="p-4 text-left w-1/5 min-w-[180px] align-top text-xs font-bold uppercase tracking-wider text-slate-500">
                Products
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className="p-4 text-left w-1/4 min-w-[220px] align-top relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title={`Remove ${p.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="relative w-full h-36 mb-3 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <Image
                      src={p.image || '/images/placeholder.png'}
                      alt={p.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {p.brand && (
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
                      {p.brand.name}
                    </p>
                  )}

                  <Link
                    href={`/product/${p.slug}`}
                    className="text-sm font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 line-clamp-2 mb-2 block"
                  >
                    {p.name}
                  </Link>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                    {p.original_price > p.price && (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(p.original_price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {p.discount_percentage}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Stock & Action */}
                  <div className="space-y-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      disabled={!p.in_stock}
                      className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                        p.in_stock
                          ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-orange-500/20'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {p.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {/* Section: Overview & Ratings */}
            <tr className="bg-slate-50 dark:bg-slate-800/40">
              <td
                colSpan={products.length + 1}
                className="p-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Overview & Ratings
              </td>
            </tr>

            <tr>
              <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Customer Rating
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-md">
                      <span>{Number(p.rating).toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="text-xs text-slate-500">
                      ({p.reviews_count} reviews)
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Availability
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  {p.in_stock ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="w-4 h-4" /> In Stock ({p.stock_quantity} units)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      <X className="w-4 h-4" /> Currently Unavailable
                    </span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Seller / Store
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200">
                    <Store className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-semibold">{p.seller?.store_name || 'JSS Verified Store'}</span>
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Delivery & Services
              </td>
              {products.map((p) => (
                <td key={p.id} className="p-4 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {p.delivery_info?.free_delivery ? 'Free Delivery' : 'Standard Delivery (₹40)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>7-Day Return / Replacement Guarantee</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Section: Specifications */}
            {specKeys.length > 0 && (
              <tr className="bg-slate-50 dark:bg-slate-800/40">
                <td
                  colSpan={products.length + 1}
                  className="p-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Key Specifications
                </td>
              </tr>
            )}

            {specKeys.map((key) => {
              const values = products.map((p) => p.specifications[key] || '—');
              const isDifferent =
                highlightDiff && values.some((val) => val !== values[0]);

              return (
                <tr
                  key={key}
                  className={
                    isDifferent
                      ? 'bg-amber-50/60 dark:bg-amber-950/20'
                      : ''
                  }
                >
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                    {key}
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="p-4 text-slate-800 dark:text-slate-200"
                    >
                      {p.specifications[key] || (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Section: Summary */}
            <tr className="bg-slate-50 dark:bg-slate-800/40">
              <td
                colSpan={products.length + 1}
                className="p-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
              >
                Product Summary
              </td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                Description
              </td>
              {products.map((p) => (
                <td
                  key={p.id}
                  className="p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                  {p.summary || 'No detailed summary provided.'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">Loading comparison matrix...</p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}

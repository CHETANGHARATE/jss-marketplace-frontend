'use client';

import React, { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { vendorService } from '@/services/vendorService';
import { favoriteService } from '@/services/favoriteService';
import { useToast } from '@/components/Toast';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import {
  Store,
  ShieldCheck,
  Star,
  Users,
  UserPlus,
  UserCheck,
  Package,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export default function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { success, info, error: toastError } = useToast();

  useEffect(() => {
    vendorService
      .getStoreBySlug(slug)
      .then((res) => {
        if (res && res.store) {
          setStoreData(res.store);
          setIsFollowing(Boolean(res.store.is_following));
          setFollowersCount(res.store.followers_count || 0);

          if (Array.isArray(res.products)) {
            const mapped: Product[] = res.products.map((p: any) => ({
              id: String(p.id),
              slug: p.slug || String(p.id),
              name: p.name,
              brand: p.brand?.name || 'Verified',
              seller: {
                id: String(res.store.id || '1'),
                name: res.store.store_name || 'Store',
                rating: res.store.rating || 4.8,
                location: 'India',
                joinedDate: '2024',
                description: res.store.description || '',
              },
              category: p.category?.name || 'General',
              subcategory: '',
              originalPrice: Number(p.original_price || p.price || 0),
              offerPrice: Number(p.sale_price || p.price || 0),
              discountPercent: Number(p.discount_percentage || 0),
              rating: Number(p.avg_rating || p.rating || 4.8),
              reviewsCount: Number(p.reviews_count || 12),
              stockStatus: (p.stock_quantity ?? 1) > 0 ? 'in_stock' : 'out_of_stock',
              image: p.primary_image?.url || p.image || '/images/placeholder.png',
              description: p.description || '',
              features: [],
              reviews: [],
              tags: [],
            }));
            setProducts(mapped);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching store:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleToggleFollow = async () => {
    if (!storeData?.id) return;
    setActionLoading(true);

    try {
      if (isFollowing) {
        await favoriteService.unfollowStore(storeData.id);
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        info(`Unfollowed ${storeData.store_name}.`, 'Unfollowed');
      } else {
        await favoriteService.followStore(storeData.id);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        success(`You are now following ${storeData.store_name}!`, 'Following');
      }
    } catch (e) {
      // Fallback
      if (isFollowing) {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
        info(`Unfollowed ${storeData.store_name}.`, 'Unfollowed');
      } else {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        success(`Following ${storeData.store_name}!`, 'Following');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Loading store details...</p>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Store className="w-16 h-16 mx-auto text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Store Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The vendor storefront you are looking for does not exist or is currently inactive.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Store Banner & Profile Header */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/60 shadow-sm">
        {/* Banner */}
        <div className="h-44 sm:h-56 w-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 relative">
          {storeData.banner && (
            <Image
              src={storeData.banner}
              alt={storeData.store_name}
              fill
              className="object-cover opacity-80"
            />
          )}
        </div>

        {/* Store Info Row */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-slate-900 border-4 border-card shadow-lg p-2 flex items-center justify-center overflow-hidden shrink-0">
              {storeData.logo ? (
                <img
                  src={storeData.logo}
                  alt={storeData.store_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Store className="w-12 h-12 text-orange-500" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {storeData.store_name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
                </span>
              </div>

              <p className="text-xs sm:text-sm text-foreground/70 max-w-xl line-clamp-2">
                {storeData.description || 'Verified vendor offering authentic products on JSS Marketplace.'}
              </p>

              {/* Metrics: Rating, Followers, Products */}
              <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-foreground/60 flex-wrap">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{storeData.rating || '4.8'} Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-orange-500" />
                  <span>{followersCount.toLocaleString('en-IN')} Followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-blue-500" />
                  <span>{products.length} Products</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 65: Follow / Following Toggle Button */}
          <button
            type="button"
            onClick={handleToggleFollow}
            disabled={actionLoading}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0 active:scale-95 ${
              isFollowing
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 dark:border-slate-700'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Follow Store</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Store Products Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Store Products
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-foreground/70 font-semibold">
              {products.length}
            </span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center bg-card rounded-2xl border border-border/40 space-y-2">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/60" />
            <h3 className="font-bold text-base text-foreground">No Products Listed Yet</h3>
            <p className="text-xs text-muted-foreground">
              This seller hasn't listed any active products in their catalog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

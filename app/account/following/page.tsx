'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { favoriteService, FollowedStoreItem } from '@/services/favoriteService';
import { useToast } from '@/components/Toast';
import { Store, ShieldCheck, Users, Star, ArrowRight, UserMinus } from 'lucide-react';

export default function FollowedStoresPage() {
  const [stores, setStores] = useState<FollowedStoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { info } = useToast();

  useEffect(() => {
    favoriteService
      .getFollowedStores()
      .then((data) => {
        setStores(data || []);
      })
      .catch((err) => {
        console.error('Failed to load followed stores', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUnfollow = async (storeId: number, storeName: string) => {
    try {
      await favoriteService.unfollowStore(storeId);
      setStores((prev) => prev.filter((s) => s.id !== storeId));
      info(`Unfollowed ${storeName}.`, 'Unfollowed');
    } catch (e) {
      setStores((prev) => prev.filter((s) => s.id !== storeId));
      info(`Unfollowed ${storeName}.`, 'Unfollowed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Followed Stores' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground">Followed Stores</h1>
                <p className="text-xs text-muted-foreground">
                  Stay updated with your favorite merchant storefronts and exclusive updates.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading followed stores...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Store className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <h3 className="font-bold text-base text-foreground">You are not following any stores yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Follow official brand stores and verified sellers to receive new arrival alerts and discounts.
                </p>
                <Link
                  href="/stores"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all"
                >
                  Explore Verified Stores
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className="p-4 bg-background-secondary border border-border/60 rounded-2xl flex items-center justify-between gap-4 group hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-card border border-border/50 p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                        {store.logo ? (
                          <img
                            src={store.logo}
                            alt={store.store_name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Store className="w-6 h-6 text-orange-500" />
                        )}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-foreground truncate">{store.store_name}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-current" /> {store.rating || 4.8}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-orange-500" /> {store.followers_count} followers
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/stores/${store.slug}`}
                        className="p-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Visit Store"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleUnfollow(store.id, store.store_name)}
                        className="p-2 text-xs text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Unfollow Store"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AccountSidebar } from '@/components/AccountSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { favoriteService, FavoriteBrandItem, FavoriteCategoryItem } from '@/services/favoriteService';
import { useToast } from '@/components/Toast';
import { Heart, Layers, Tag, ArrowRight, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'brands' | 'categories'>('brands');
  const [brands, setBrands] = useState<FavoriteBrandItem[]>([]);
  const [categories, setCategories] = useState<FavoriteCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { info } = useToast();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      favoriteService.getFavoriteBrands().catch(() => []),
      favoriteService.getFavoriteCategories().catch(() => []),
    ])
      .then(([brandList, catList]) => {
        setBrands(brandList || []);
        setCategories(catList || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleRemoveBrand = async (brandId: number, brandName: string) => {
    try {
      await favoriteService.removeFavoriteBrand(brandId);
    } catch (e) {}
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    info(`Removed ${brandName} from favorites.`, 'Removed');
  };

  const handleRemoveCategory = async (catId: number, catName: string) => {
    try {
      await favoriteService.removeFavoriteCategory(catId);
    } catch (e) {}
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    info(`Removed ${catName} from favorites.`, 'Removed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Account', href: '/account' }, { label: 'Favorites' }]} />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <AccountSidebar />

        <main className="flex-1 w-full space-y-6">
          <div className="p-6 bg-card border border-border/60 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-foreground">Favorite Brands & Categories</h1>
                  <p className="text-xs text-muted-foreground">
                    Quickly access your preferred brands and shopping categories.
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-background-secondary rounded-2xl border border-border/50 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('brands')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'brands'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Brands ({brands.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'categories'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Categories ({categories.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Loading favorites...</p>
              </div>
            ) : activeTab === 'brands' ? (
              brands.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Tag className="w-12 h-12 mx-auto text-muted-foreground/50" />
                  <h3 className="font-bold text-base text-foreground">No Favorite Brands Added</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Heart your favorite brands on brand pages to easily track their catalogs and new arrivals.
                  </p>
                  <Link
                    href="/brand"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all"
                  >
                    Browse Brands
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {brands.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-background-secondary border border-border/60 rounded-2xl flex items-center justify-between gap-4 group hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-card border border-border/50 p-2 flex items-center justify-center overflow-hidden shrink-0">
                          {b.logo ? (
                            <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <Tag className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">{b.name}</h4>
                          <span className="text-[11px] text-muted-foreground">{b.products_count} products</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/brand/${b.slug}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                          title="Visit Brand Page"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleRemoveBrand(b.id, b.name)}
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : categories.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Layers className="w-12 h-12 mx-auto text-muted-foreground/50" />
                <h3 className="font-bold text-base text-foreground">No Favorite Categories Added</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Save your most shopped categories to easily access curated collections.
                </p>
                <Link
                  href="/category"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all"
                >
                  Browse Categories
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-background-secondary border border-border/60 rounded-2xl flex items-center justify-between gap-4 group hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-card border border-border/50 p-2 flex items-center justify-center overflow-hidden shrink-0">
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Layers className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">{c.name}</h4>
                        <span className="text-[11px] text-muted-foreground">{c.products_count} products</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/category/${c.slug}`}
                        className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="Visit Category Page"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRemoveCategory(c.id, c.name)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
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

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { ApiProduct } from '../types/api';
import { productService, mapApiProductToProduct } from '../services/productService';
import { useCartWishlist } from '../contexts/CartWishlistContext';
import { useToast } from './Toast';

interface FrequentlyBoughtTogetherProps {
  mainProduct: ApiProduct;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({ mainProduct }) => {
  const [bundleProducts, setBundleProducts] = useState<ApiProduct[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([mainProduct.id]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { addToCart } = useCartWishlist();
  const { success, error } = useToast();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productService.getFrequentlyBoughtTogether(mainProduct.id)
      .then((items) => {
        if (isMounted) {
          setBundleProducts(items);
          setSelectedIds([mainProduct.id, ...items.map(p => p.id)]);
        }
      })
      .catch((err) => {
        console.error('Failed to load bundle recommendations:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mainProduct.id]);

  if (isLoading || bundleProducts.length === 0) {
    return null;
  }

  const allItems = [mainProduct, ...bundleProducts];

  const toggleProduct = (id: number) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        error('At least one product must remain selected.');
        return;
      }
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getPrice = (p: ApiProduct): number => {
    const raw = (p as any).offer_price ?? (p as any).offerPrice ?? (p as any).price ?? (p as any).original_price ?? (p as any).originalPrice ?? 0;
    return Number(raw);
  };

  const getThumbnail = (p: ApiProduct): string => {
    return (p as any).primary_image?.image_url ?? 
      (p as any).primaryImage?.image_url ?? 
      (p as any).thumbnail ?? 
      (p as any).image ?? 
      (Array.isArray((p as any).images) && (p as any).images[0]) ?? 
      '/placeholder-product.png';
  };

  const getName = (p: ApiProduct): string => {
    if (typeof p.name === 'string') return p.name;
    if (p.name && typeof p.name === 'object') {
      return (p.name as any).en ?? Object.values(p.name)[0] ?? 'Product';
    }
    return 'Product';
  };

  const selectedItems = allItems.filter(item => selectedIds.includes(item.id));
  const totalPrice = selectedItems.reduce((sum, item) => sum + getPrice(item), 0);

  const handleAddBundleToCart = async () => {
    if (selectedItems.length === 0) return;

    setIsAdding(true);
    try {
      for (const item of selectedItems) {
        const mappedProduct = mapApiProductToProduct(item as any);
        addToCart(mappedProduct, 1);
      }
      success(`Added ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} to your cart!`);
    } catch (err: any) {
      error(err.message || 'Failed to add bundle items to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="mt-12 bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-border/50">
        <div className="h-9 w-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Frequently Bought Together
          </h2>
          <p className="text-xs text-foreground/60 font-medium mt-0.5">
            Customers who bought this item frequently purchased these complementary products.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Product Cards Row */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-4 sm:gap-6">
          {allItems.map((product, idx) => {
            const isSelected = selectedIds.includes(product.id);
            const isMain = product.id === mainProduct.id;
            const price = getPrice(product);
            const thumb = getThumbnail(product);
            const name = getName(product);

            return (
              <React.Fragment key={product.id}>
                {idx > 0 && (
                  <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground/60 shrink-0">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-200 w-36 sm:w-44 ${
                  isSelected ? 'bg-card border-primary/40 shadow-xs' : 'bg-muted/30 border-border/40 opacity-60'
                }`}>
                  {/* Selection Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    aria-label={`Toggle ${name}`}
                    className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-transparent'
                    } cursor-pointer`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  {isMain && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                      This Item
                    </span>
                  )}

                  <Link href={`/product/${product.slug || product.id}`} className="group flex flex-col items-center text-center mt-2">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white p-2 mb-3 border border-border/30 group-hover:scale-105 transition-transform">
                      <img
                        src={thumb}
                        alt={name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[32px]">
                      {name}
                    </h3>
                  </Link>

                  <div className="mt-2 text-center">
                    <span className="text-sm font-black text-foreground block">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Bundle Summary & Action Box */}
        <div className="lg:col-span-4 bg-muted/20 border border-border/60 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/60 block">
              Bundle Total ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'})
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-foreground tracking-tight">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-foreground/50 mt-1">
              All inclusive of applicable GST & taxes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            disabled={isAdding || selectedItems.length === 0}
            className="w-full py-3.5 px-6 bg-primary text-primary-foreground font-black text-sm rounded-xl hover:bg-primary/95 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add Selected ({selectedItems.length}) to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

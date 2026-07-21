'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearch } from '../../hooks/useSearch';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ProductGridSkeleton } from '../../components/ProductGridSkeleton';
import { ApiProduct } from '../../types/api';
import {
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const sort = searchParams.get('sort') || 'popularity';
  const page = Number(searchParams.get('page') || 1);

  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [inputQuery, setInputQuery] = useState<string>(query);

  const { data, isLoading } = useSearch({
    query,
    category,
    brand,
    sort,
    page,
  });

  const products: ApiProduct[] = data?.data || [];
  const meta = data?.meta;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs items={[{ label: 'Search Results' }, ...(query ? [{ label: `"${query}"` }] : [])]} />

      <div className="bg-card border border-border/40 rounded-3xl p-6 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full bg-muted/30 border border-border/40 rounded-2xl py-3.5 pl-12 pr-28 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <Search className="w-5 h-5 text-foreground/40 absolute left-4" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-xs"
          >
            Search
          </button>
        </form>

        {query && (
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/70">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Search results for "{query}"</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/40 p-4 rounded-2xl">
        <p className="text-xs font-bold text-foreground/70">
          Showing <span className="text-primary">{meta?.total || products.length}</span> matching products
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/70">
            <span>Sort By:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-muted/30 border border-border/40 text-foreground text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary"
            >
              <option value="popularity">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="flex border border-border/40 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 ${isGridView ? 'bg-primary text-primary-foreground' : 'text-foreground/60'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 ${!isGridView ? 'bg-primary text-primary-foreground' : 'text-foreground/60'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-card border border-border/40 rounded-3xl space-y-4">
          <ShoppingBag className="w-12 h-12 text-foreground/30 mx-auto" />
          <h3 className="text-xl font-bold text-foreground">No Products Found</h3>
          <p className="text-sm text-foreground/60 max-w-sm mx-auto">
            We couldn't find any products matching "{query}". Try checking for spelling errors or using more generic keywords.
          </p>
        </div>
      ) : isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod: ApiProduct) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="group bg-card border border-border/40 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="aspect-square w-full bg-muted/20 rounded-2xl p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={prod.images?.[0] || '/placeholder-product.png'}
                  alt={prod.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-1">
                {prod.brand && (
                  <span className="text-[11px] font-bold text-primary uppercase">{prod.brand.name}</span>
                )}
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {prod.name}
                </h4>
              </div>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                <span className="text-base font-black text-primary">
                  ₹{(prod.sale_price || prod.original_price).toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-primary group-hover:underline">View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((prod: ApiProduct) => (
            <Link
              key={prod.id}
              href={`/product/${prod.slug}`}
              className="group bg-card border border-border/40 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col sm:flex-row gap-5 items-center justify-between"
            >
              <div className="h-32 w-32 shrink-0 bg-muted/20 rounded-2xl p-3 flex items-center justify-center">
                <img src={prod.images?.[0] || '/placeholder-product.png'} alt={prod.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                {prod.brand && <span className="text-xs font-bold text-primary uppercase">{prod.brand.name}</span>}
                <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{prod.name}</h4>
                <p className="text-xs text-foreground/60 line-clamp-2">{prod.description}</p>
              </div>
              <div className="shrink-0 text-center sm:text-right space-y-2">
                <span className="text-xl font-black text-primary block">
                  ₹{(prod.sale_price || prod.original_price).toLocaleString()}
                </span>
                <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                  Inspect Item
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(meta.current_page - 1)}
            disabled={meta.current_page === 1}
            className="p-2 border border-border/40 rounded-xl hover:border-primary disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-foreground/70">
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            onClick={() => handlePageChange(meta.current_page + 1)}
            disabled={meta.current_page === meta.last_page}
            className="p-2 border border-border/40 rounded-xl hover:border-primary disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <SearchResultsContent />
    </Suspense>
  );
}

'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductBySlug, useRelatedProducts } from '../../../hooks/useProducts';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ProductGallery } from '../../../components/ProductGallery';
import { ProductDetailsInfo } from '../../../components/ProductDetailsInfo';
import { RecentlyViewedSection } from '../../../components/RecentlyViewedSection';
import { Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(product?.id || '');
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-foreground/60">
        <Sparkles className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium">Loading Product Details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-sm text-foreground/60">
          The requested product could not be found or has been removed from our catalog.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-sm hover:bg-primary/90 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          ...(product.category
            ? [{ label: typeof product.category.name === 'string' ? product.category.name : 'Category', href: `/category/${product.category.slug}` }]
            : []),
          ...(product.brand
            ? [{ label: product.brand.name, href: `/brand/${product.brand.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-6">
          <ProductDetailsInfo product={product} />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-border/40">
          <h3 className="text-2xl font-black text-foreground tracking-tight">
            Related Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relProd) => (
              <Link
                key={relProd.id}
                href={`/product/${relProd.slug}`}
                className="group bg-card border border-border/40 rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all space-y-3"
              >
                <div className="aspect-square w-full bg-muted/20 rounded-2xl p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={relProd.images?.[0] || '/placeholder-product.png'}
                    alt={relProd.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {relProd.name}
                </h4>
                <span className="text-base font-black text-primary block">
                  ₹{(relProd.sale_price || relProd.original_price).toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <RecentlyViewedSection />
    </div>
  );
}

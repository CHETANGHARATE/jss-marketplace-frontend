'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductBySlug, useRelatedProducts } from '../../../hooks/useProducts';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ProductGallery } from '../../../components/ProductGallery';
import { ProductDetailsInfo } from '../../../components/ProductDetailsInfo';
import { ProductTabsSection } from '../../../components/ProductTabsSection';
import { RecentlyViewedSection } from '../../../components/RecentlyViewedSection';
import { seoService } from '../../../services/seoService';
import { Sparkles, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '../../../components/ProductCard';
import { mapApiProductToProduct } from '../../../services/productService';

export default function ProductDetailPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : '';

  const { data: product, isLoading, isError } = useProductBySlug(rawSlug);
  const { data: relatedProducts = [] } = useRelatedProducts(product?.id || '');
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-foreground/70 min-h-[50vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-sm font-black tracking-wide">Loading Product Details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto min-h-[50vh] flex flex-col justify-center items-center">
        <div className="h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Product Not Found</h2>
        <p className="text-xs text-muted-custom leading-relaxed font-medium">
          The requested product could not be found or has been removed from our marketplace catalog.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-black text-xs rounded-2xl shadow-xs hover:bg-primary-hover transition-all uppercase tracking-wider"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const productJsonLd = seoService.generateProductJsonLd(product);
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(product.category
      ? [
          {
            label: typeof product.category.name === 'string' ? product.category.name : 'Category',
            href: `/category/${product.category.slug}`,
          },
        ]
      : []),
    ...(product.brand
      ? [{ label: product.brand.name, href: `/brand/${product.brand.slug}` }]
      : []),
    { label: product.name },
  ];
  const breadcrumbJsonLd = seoService.generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <div className="space-y-10 sm:space-y-14 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Section 11: Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Main Details Card Grid (Section 1 - Gallery & Section 2-6 - Info/Pricing/Actions/Offers/Delivery) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start bg-card border border-border-custom/80 p-6 sm:p-10 rounded-3xl shadow-xs">
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-6">
          <ProductDetailsInfo product={product} />
        </div>
      </div>

      {/* Section 7 & 8: Tabs & Reviews */}
      <ProductTabsSection product={product} />

      {/* Section 9: Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-border-custom/80">
          <div className="flex justify-between items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
                <span>Category Showcase</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Related Marketplace Products
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relProd) => {
              const mappedProduct = mapApiProductToProduct(relProd);
              return (
                <ProductCard
                  key={relProd.id}
                  product={mappedProduct}
                  onQuickView={() => {}}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Section 10: Recently Viewed Products */}
      <RecentlyViewedSection />
    </div>
  );
}

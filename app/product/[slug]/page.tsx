'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProductBySlug, useRelatedProducts } from '../../../hooks/useProducts';
import { useRecentlyViewed } from '../../../hooks/useRecentlyViewed';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { ProductGallery } from '../../../components/ProductGallery';
import { ProductDetailsInfo } from '../../../components/ProductDetailsInfo';
import { ProductTabsSection } from '../../../components/ProductTabsSection';
import { FrequentlyBoughtTogether } from '../../../components/FrequentlyBoughtTogether';
import { RecentlyViewedSection } from '../../../components/RecentlyViewedSection';
import { StickyPurchaseBar } from '../../../components/StickyPurchaseBar';
import { seoService } from '../../../services/seoService';
import { AlertCircle, ShoppingBag } from 'lucide-react';
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

  const origPrice = product.originalPrice ?? product.original_price ?? 0;
  const offerPrice = product.offerPrice ?? product.sale_price ?? origPrice;
  const discountPercent = product.discountPercent ?? (origPrice > offerPrice
    ? Math.round(((origPrice - offerPrice) / origPrice) * 100)
    : 0);

  const productJsonLd = seoService.generateProductJsonLd(product);
  const categoryName = typeof product.category?.name === 'string'
    ? product.category.name
    : (product.category?.slug || 'General');

  const skuCode = product.sku || `JSS-PROD-${String(product.id).padStart(3, '0')}`;

  // Fix: Do NOT include 'Home' in items because Breadcrumbs component prepends Home with icon automatically
  const breadcrumbItems = [
    { label: categoryName, href: `/category/${product.category?.slug || 'general'}` },
    ...(product.brand ? [{ label: product.brand.name, href: `/brand/${product.brand.slug}` }] : []),
    { label: product.name }
  ];

  const fullBreadcrumbLd = [
    { label: 'Home', href: '/' },
    ...breadcrumbItems
  ];
  const breadcrumbJsonLd = seoService.generateBreadcrumbJsonLd(fullBreadcrumbLd);

  return (
    <div className="max-w-[1440px] mx-auto space-y-8 sm:space-y-10 pb-16 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Top Breadcrumb Navigation + SKU Code */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <Breadcrumbs items={breadcrumbItems} />
        <span className="text-xs text-muted-custom font-mono font-bold bg-card border border-border-custom/80 px-3 py-1 rounded-xl shadow-2xs">
          SKU: {skuCode}
        </span>
      </div>

      {/* Main Premium Product Layout Grid (Left 48% / Right 52%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Hero Gallery): 48% Width (~6 Cols in 12-col Grid) */}
        <div className="lg:col-span-6">
          <ProductGallery
            images={product.images || [product.image || '/placeholder-product.png']}
            galleryVariants={product.gallery_variants}
            name={product.name}
            discountPercent={discountPercent}
            productId={String(product.id)}
          />
        </div>

        {/* Right Column (Product Information & Purchase Area): 52% Width (~6 Cols) */}
        <div className="lg:col-span-6">
          <ProductDetailsInfo product={product} />
        </div>
      </div>

      {/* Product Information Tabs (Overview, Specifications, Vendor Info, Shipping, Reviews) */}
      <ProductTabsSection product={product} />

      {/* Frequently Bought Together Bundle Recommendations (Feature 19) */}
      <FrequentlyBoughtTogether mainProduct={product as any} />

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-border-custom/80">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-0.5 rounded-full mb-1.5 inline-block">
                Category Showcase
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                You May Also Like
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relProd: any) => {
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

      {/* Recently Viewed Products */}
      <RecentlyViewedSection />

      {/* Desktop & Mobile Scroll Sticky Purchase Bar */}
      <StickyPurchaseBar product={product} />
    </div>
  );
}

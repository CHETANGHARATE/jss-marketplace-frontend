import { ApiProduct } from '../types/api';
import { envConfig } from '../config/env';

export const seoService = {
  generateProductJsonLd(product: ApiProduct, siteUrl = envConfig.appUrl) {
    const price = product.offerPrice ?? product.sale_price ?? product.originalPrice ?? product.original_price ?? 0;
    const stockQty = product.stockQuantity ?? product.stock_quantity ?? 0;
    const imgUrl = product.image || product.images?.[0];

    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: imgUrl ? [imgUrl] : [],
      description: product.description || product.name,
      sku: product.sku || `SKU-${product.id}`,
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/product/${product.slug || product.id}`,
        priceCurrency: 'INR',
        price: price,
        availability:
          stockQty > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating ? Number(product.rating).toFixed(1) : '5.0',
        reviewCount: product.reviewsCount || product.reviews_count || 12,
      },
    };
  },

  generateBreadcrumbJsonLd(items: Array<{ label: string; href?: string }>, siteUrl = envConfig.appUrl) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.href ? `${siteUrl}${item.href}` : siteUrl,
      })),
    };
  },

  generateOrganizationJsonLd(siteUrl = envConfig.appUrl) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'JSS Marketplace',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://facebook.com/jssmarketplace',
        'https://twitter.com/jssmarketplace',
        'https://instagram.com/jssmarketplace',
      ],
    };
  },
};

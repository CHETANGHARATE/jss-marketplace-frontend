import { ApiProduct } from '../types/api';

export const seoService = {
  generateProductJsonLd(product: ApiProduct, siteUrl = 'http://localhost:3000') {
    const price = product.sale_price || product.original_price;
    return {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: product.images?.[0] ? [product.images[0]] : [],
      description: product.description || product.name,
      sku: product.sku || `SKU-${product.id}`,
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/product/${product.slug || product.id}`,
        priceCurrency: 'INR',
        price: price,
        availability:
          product.stock_quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating ? Number(product.rating).toFixed(1) : '5.0',
        reviewCount: product.reviews_count || 12,
      },
    };
  },

  generateBreadcrumbJsonLd(items: Array<{ label: string; href?: string }>, siteUrl = 'http://localhost:3000') {
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

  generateOrganizationJsonLd(siteUrl = 'http://localhost:3000') {
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

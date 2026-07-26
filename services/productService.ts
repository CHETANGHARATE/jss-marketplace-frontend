import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse, PaginatedApiResponse } from '../types/api';
import { Product } from '../types';

export interface ProductQueryParams {
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort?: 'newest' | 'price_low_high' | 'price_high_low' | 'popularity' | 'best_selling' | 'rating';
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Maps a backend ApiProduct into the legacy Product shape still expected by
 * ProductCard.tsx and other existing UI components. Kept here (rather than
 * duplicated per-file) since it's now used by app/page.tsx and
 * FeaturedCategories.tsx. Mirrors the mapping already established in
 * PersonalizedSection.tsx for consistency.
 */
export function mapApiProductToProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    description: p.description || p.name,
    category: typeof p.category?.name === 'string' ? p.category.name : (p.category?.name?.en || 'General'),
    subcategory: p.brand?.name || 'General',
    brand: p.brand?.name || 'Generic',
    originalPrice: p.original_price,
    offerPrice: p.sale_price || p.original_price,
    discountPercent: p.sale_price ? Math.round(((p.original_price - p.sale_price) / p.original_price) * 100) : 0,
    rating: p.rating ? Number(p.rating) : 5.0,
    reviewsCount: p.reviews_count || 0,
    image: p.images?.[0] || '/placeholder-product.png',
    seller: { id: String(p.seller_id ?? 's1'), name: 'JSS Merchant', location: 'Mumbai', rating: 4.8, joinedDate: '2025', description: 'Verified JSS Merchant' },
    stockStatus: p.stock_status,
    features: p.features || [],
    reviews: [],
    tags: [],
  };
}

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', { params });
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ApiProduct> {
    const response = await apiClient.get<ApiResponse<ApiProduct>>(`/products/${slug}`);
    return response.data.data;
  },

  async getFeaturedProducts(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/products/featured');
    return response.data.data;
  },

  async getTrendingProducts(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/products/trending');
    return response.data.data;
  },

  async getRelatedProducts(productId: number | string): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>(`/products/${productId}/related`);
    return response.data.data;
  },
};

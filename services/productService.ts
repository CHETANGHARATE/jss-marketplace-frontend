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

export function mapApiProductToProduct(apiProd: ApiProduct): Product {
  const originalPrice = apiProd.original_price || 0;
  const offerPrice = apiProd.sale_price || originalPrice;
  const discountPercent = originalPrice > offerPrice
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  const categorySlug = typeof apiProd.category?.name === 'string'
    ? apiProd.category.name
    : (apiProd.category?.slug || 'general');

  return {
    id: String(apiProd.id),
    name: apiProd.name,
    brand: apiProd.brand?.name || 'Generic',
    seller: {
      id: String(apiProd.seller_id || 1),
      name: 'Verified Marketplace Vendor',
      rating: 4.8,
      location: 'India',
      joinedDate: '2024',
      description: 'Verified marketplace vendor seller'
    },
    category: categorySlug,
    subcategory: '',
    originalPrice,
    offerPrice,
    discountPercent,
    rating: apiProd.rating || 5,
    reviewsCount: apiProd.reviews_count || 0,
    stockStatus: apiProd.stock_status || 'in_stock',
    image: apiProd.images?.[0] || '/placeholder-product.png',
    description: apiProd.description || '',
    features: apiProd.features || [],
    reviews: [],
    tags: []
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

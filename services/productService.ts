import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse, PaginatedApiResponse } from '../types/api';

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

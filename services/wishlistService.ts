import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse } from '../types/api';

export const wishlistService = {
  async getWishlist(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/wishlist');
    return response.data.data;
  },

  async toggleWishlist(productId: number): Promise<{ is_wishlisted: boolean }> {
    const response = await apiClient.post<ApiResponse<{ is_wishlisted: boolean }>>('/wishlist/toggle', {
      product_id: productId,
    });
    return response.data.data;
  },

  async removeWishlist(productId: number): Promise<void> {
    await apiClient.delete(`/wishlist/${productId}`);
  },
};

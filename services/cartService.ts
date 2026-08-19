import { apiClient } from './apiClient';
import { ApiCart, ApiResponse } from '../types/api';

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
}

export interface SavedForLaterItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  image: string;
  quantity: number;
  current_price: number;
  saved_price: number;
  price_changed: boolean;
  price_difference: number;
  in_stock: boolean;
  stock_quantity: number;
  is_active: boolean;
  saved_at: string;
  brand?: string;
  category?: string;
}

export const cartService = {
  async getCart(): Promise<ApiCart> {
    const response = await apiClient.get<ApiResponse<ApiCart>>('/cart');
    return response.data.data;
  },

  async addItem(payload: AddCartItemPayload): Promise<ApiCart> {
    const response = await apiClient.post<ApiResponse<ApiCart>>('/cart/items', payload);
    return response.data.data;
  },

  async updateItem(itemId: number, quantity: number): Promise<ApiCart> {
    const response = await apiClient.put<ApiResponse<ApiCart>>(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  async removeItem(itemId: number): Promise<ApiCart> {
    const response = await apiClient.delete<ApiResponse<ApiCart>>(`/cart/items/${itemId}`);
    return response.data.data;
  },

  async clearCart(): Promise<void> {
    await apiClient.post('/cart/clear');
  },

  async mergeCart(): Promise<ApiCart> {
    const response = await apiClient.post<ApiResponse<ApiCart>>('/cart/merge');
    return response.data.data;
  },

  // Feature 15: Save for Later Architecture
  async getSavedForLater(): Promise<SavedForLaterItem[]> {
    const response = await apiClient.get<ApiResponse<SavedForLaterItem[]>>('/cart/saved-for-later');
    return response.data.data || [];
  },

  async saveForLater(itemId: number): Promise<ApiCart> {
    const response = await apiClient.post<ApiResponse<ApiCart>>(`/cart/items/${itemId}/save-for-later`);
    return response.data.data;
  },

  async moveToCart(savedId: number): Promise<ApiCart> {
    const response = await apiClient.post<ApiResponse<ApiCart>>(`/cart/saved-for-later/${savedId}/move-to-cart`);
    return response.data.data;
  },

  async removeSavedItem(savedId: number): Promise<void> {
    await apiClient.delete(`/cart/saved-for-later/${savedId}`);
  },
};

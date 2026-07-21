import { apiClient } from './apiClient';
import { ApiCart, ApiResponse } from '../types/api';

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
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
};

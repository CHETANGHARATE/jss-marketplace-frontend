import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface PriceDropAlertItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  brand?: string;
  initial_price: number;
  target_price?: number | null;
  current_price: number;
  status: 'active' | 'triggered' | 'cancelled';
  created_at: string;
  triggered_at?: string | null;
}

export interface BackInStockSubscriptionItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  product_image: string;
  brand?: string;
  current_stock: number;
  in_stock: boolean;
  price: number;
  status: 'active' | 'notified' | 'cancelled';
  subscribed_at: string;
  notified_at?: string | null;
}

export const alertService = {
  // Feature 40: Price Drop Alerts
  async getPriceDropAlerts(): Promise<PriceDropAlertItem[]> {
    const response = await apiClient.get<ApiResponse<PriceDropAlertItem[]>>('/alerts/price-drop');
    return response.data.data || [];
  },

  async subscribePriceDrop(productId: number, targetPrice?: number): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/alerts/price-drop', {
      product_id: productId,
      target_price: targetPrice,
    });
    return response.data;
  },

  async cancelPriceDrop(productId: number): Promise<any> {
    const response = await apiClient.delete<ApiResponse<any>>(`/alerts/price-drop/${productId}`);
    return response.data;
  },

  // Feature 41: Back-in-Stock Alerts
  async getBackInStockSubscriptions(): Promise<BackInStockSubscriptionItem[]> {
    const response = await apiClient.get<ApiResponse<BackInStockSubscriptionItem[]>>('/alerts/back-in-stock');
    return response.data.data || [];
  },

  async subscribeBackInStock(productId: number): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>('/alerts/back-in-stock', {
      product_id: productId,
    });
    return response.data;
  },

  async cancelBackInStock(productId: number): Promise<any> {
    const response = await apiClient.delete<ApiResponse<any>>(`/alerts/back-in-stock/${productId}`);
    return response.data;
  },
};

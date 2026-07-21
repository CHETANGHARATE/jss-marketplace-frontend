import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface ApiShippingMethod {
  id: number;
  code: string;
  name: string;
  description?: string;
  cost: number;
  estimated_days: string;
  is_free_eligible?: boolean;
}

export interface ApiShipmentTracking {
  id: number;
  order_id: number;
  courier_name: string;
  tracking_number: string;
  status: 'order_confirmed' | 'packed' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  estimated_delivery_date?: string;
  history?: Array<{
    status: string;
    location?: string;
    description: string;
    timestamp: string;
  }>;
}

export const shippingService = {
  async getShippingMethods(addressId?: number): Promise<ApiShippingMethod[]> {
    const response = await apiClient.get<ApiResponse<ApiShippingMethod[]>>('/shipping/methods', {
      params: { address_id: addressId },
    });
    return response.data.data;
  },

  async calculateShippingCost(payload: { address_id: number; shipping_method_id: number }): Promise<{
    cost: number;
    estimated_delivery: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>('/shipping/calculate', payload);
    return response.data.data;
  },

  async getShipmentTracking(trackingNumber: string): Promise<ApiShipmentTracking> {
    const response = await apiClient.get<ApiResponse<ApiShipmentTracking>>(`/shipping/tracking/${trackingNumber}`);
    return response.data.data;
  },
};

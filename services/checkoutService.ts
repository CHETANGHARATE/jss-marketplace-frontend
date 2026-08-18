import { apiClient } from './apiClient';
import { ApiOrder, ApiResponse } from '../types/api';

export interface ProcessCheckoutPayload {
  shipping_address_id: number;
  billing_address_id?: number;
  payment_method?: 'razorpay' | 'stripe' | 'cod' | 'online' | 'upi' | 'wallet' | 'card' | 'netbanking';
  points_to_redeem?: number;
  coupon_code?: string;
  notes?: string;
}

export const checkoutService = {
  async processCheckout(payload: ProcessCheckoutPayload): Promise<ApiOrder> {
    const response = await apiClient.post<ApiResponse<ApiOrder>>('/checkout/process', payload);
    return response.data.data;
  },
};

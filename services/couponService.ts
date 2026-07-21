import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface ApiCoupon {
  id: number;
  code: string;
  type: 'fixed' | 'percentage';
  discount_amount: number;
  min_order_amount: number;
  max_discount_amount?: number;
  expires_at: string;
  is_valid?: boolean;
}

export interface ApplyCouponResult {
  code: string;
  discount_amount: number;
  formatted_discount: string;
  message: string;
}

export const couponService = {
  async getAvailableCoupons(): Promise<ApiCoupon[]> {
    const response = await apiClient.get<ApiResponse<ApiCoupon[]>>('/coupons');
    return response.data.data;
  },

  async applyCoupon(code: string, subtotal?: number): Promise<ApplyCouponResult> {
    const response = await apiClient.post<ApiResponse<ApplyCouponResult>>('/coupons/apply', {
      code,
      subtotal,
    });
    return response.data.data;
  },

  async removeCoupon(): Promise<void> {
    await apiClient.post('/coupons/remove');
  },
};

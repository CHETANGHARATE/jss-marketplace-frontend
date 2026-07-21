import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface LoyaltyLedgerItem {
  id: number;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  created_at: string;
}

export interface LoyaltySummary {
  available_points: number;
  tier_name: string;
  points_value_in_currency: number;
  history: LoyaltyLedgerItem[];
}

export const loyaltyService = {
  async getSummary(): Promise<LoyaltySummary> {
    const response = await apiClient.get<ApiResponse<LoyaltySummary>>('/loyalty');
    return response.data.data;
  },

  async redeemPoints(points: number): Promise<{ redeemed_points: number; discount_amount: number }> {
    const response = await apiClient.post<ApiResponse<{ redeemed_points: number; discount_amount: number }>>('/loyalty/redeem', { points });
    return response.data.data;
  },
};

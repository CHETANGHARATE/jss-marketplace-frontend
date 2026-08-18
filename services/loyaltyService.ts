import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface LoyaltyLedgerItem {
  id: number;
  type: 'earned' | 'redeemed' | 'refunded' | 'adjusted';
  points: number;
  description?: string;
  inr_value?: number;
  created_at: string;
}

export interface LoyaltyPointData {
  user_id: number;
  points_balance: number;
  total_earned: number;
}

export interface LoyaltySummary {
  available_points: number;
  tier_name: string;
  points_value_in_currency: number;
  history: LoyaltyLedgerItem[];
}

export const loyaltyService = {
  async getPointsBalance(): Promise<LoyaltyPointData> {
    try {
      const response = await apiClient.get<ApiResponse<LoyaltyPointData>>('/loyalty/points');
      return response.data.data;
    } catch {
      return { user_id: 0, points_balance: 0, total_earned: 0 };
    }
  },

  async getSummary(): Promise<LoyaltySummary> {
    try {
      const response = await apiClient.get<ApiResponse<LoyaltySummary>>('/loyalty');
      return response.data.data;
    } catch {
      const points = await this.getPointsBalance();
      return {
        available_points: points.points_balance || 0,
        tier_name: 'Bronze Member',
        points_value_in_currency: points.points_balance || 0,
        history: [],
      };
    }
  },

  async redeemPoints(points: number): Promise<{ redeemed_points: number; discount_amount: number }> {
    const response = await apiClient.post<ApiResponse<{ redeemed_points: number; discount_amount: number }>>('/loyalty/redeem', { points });
    return response.data.data;
  },
};

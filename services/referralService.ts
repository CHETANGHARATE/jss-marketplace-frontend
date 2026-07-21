import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface ReferralHistoryItem {
  id: number;
  referee_name: string;
  reward_amount: number;
  status: 'pending' | 'rewarded';
  created_at: string;
}

export interface ReferralSummary {
  referral_code: string;
  shareable_url: string;
  total_referrals: number;
  total_earnings: number;
  history: ReferralHistoryItem[];
}

export const referralService = {
  async getSummary(): Promise<ReferralSummary> {
    const response = await apiClient.get<ApiResponse<ReferralSummary>>('/referrals');
    return response.data.data;
  },
};

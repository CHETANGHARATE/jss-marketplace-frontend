import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse } from '../types/api';

export interface ApiFlashSale {
  id: number;
  title: string;
  banner_image: string;
  discount_percentage: number;
  starts_at: string;
  ends_at: string;
  products: ApiProduct[];
}

export interface ApiPromotionalBanner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  target_url: string;
  position: 'hero' | 'category' | 'sidebar';
}

export interface ApiCampaign {
  id: number;
  title: string;
  description: string;
  code: string;
  discount_badge: string;
  ends_at: string;
}

export const promotionService = {
  async getFlashSales(): Promise<ApiFlashSale[]> {
    const response = await apiClient.get<ApiResponse<ApiFlashSale[]>>('/promotions/flash-sales');
    return response.data.data;
  },

  async getBanners(): Promise<ApiPromotionalBanner[]> {
    const response = await apiClient.get<ApiResponse<ApiPromotionalBanner[]>>('/promotions/banners');
    return response.data.data;
  },

  async getCampaigns(): Promise<ApiCampaign[]> {
    const response = await apiClient.get<ApiResponse<ApiCampaign[]>>('/promotions/campaigns');
    return response.data.data;
  },
};

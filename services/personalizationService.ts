import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse } from '../types/api';

export const personalizationService = {
  async getPersonalizedRecommendations(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/recommendations/personalized');
    return response.data.data;
  },

  async getTrendingProducts(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/recommendations/trending');
    return response.data.data;
  },

  async getContinueShopping(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/personalization/continue-shopping');
    return response.data.data;
  },
};

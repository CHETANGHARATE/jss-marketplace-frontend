import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse } from '../types/api';

export const recommendationService = {
  async getTrendingRecommendations(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/recommendations/trending');
    return response.data.data;
  },

  async getPersonalizedRecommendations(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/recommendations/personalized');
    return response.data.data;
  },
};

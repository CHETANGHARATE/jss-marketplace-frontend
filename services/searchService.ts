import { apiClient } from './apiClient';
import { ApiProduct, PaginatedApiResponse, ApiResponse } from '../types/api';

export interface SearchParams {
  q?: string;
  query?: string;
  category_id?: number;
  category?: string;
  brand_id?: number;
  brand?: string;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort_by?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export type SearchQueryParams = SearchParams;

export interface SearchSuggestion {
  query: string;
  category?: string;
  product_name?: string;
  slug?: string;
}

export const searchService = {
  async searchProducts(params: SearchParams): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/search', {
      params,
    });
    return response.data;
  },

  async search(params: SearchParams): Promise<PaginatedApiResponse<ApiProduct>> {
    return this.searchProducts(params);
  },

  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) return [];
    const response = await apiClient.get<ApiResponse<SearchSuggestion[]>>('/search/suggestions', {
      params: { q: query },
    });
    return response.data.data;
  },

  async getAutocompleteSuggestions(query: string): Promise<SearchSuggestion[]> {
    return this.getSuggestions(query);
  },
};

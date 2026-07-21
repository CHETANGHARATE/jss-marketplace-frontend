import { apiClient } from './apiClient';
import { ApiProduct, ApiResponse, PaginatedApiResponse } from '../types/api';

export interface SearchQueryParams {
  query: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
}

export interface SearchFacets {
  categories?: Record<string, number>;
  brands?: Record<string, number>;
  price_range?: { min: number; max: number };
}

export interface SearchResultData {
  products: ApiProduct[];
  facets?: SearchFacets;
}

export const searchService = {
  async search(params: SearchQueryParams): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/search', { params });
    return response.data;
  },

  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) return [];
    const response = await apiClient.get<ApiResponse<string[]>>('/search/autocomplete', {
      params: { q: query },
    });
    return response.data.data;
  },
};

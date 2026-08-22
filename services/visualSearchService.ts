import { apiClient } from './apiClient';

export interface VisualSearchResultItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number;
  discount_percent: number;
  rating: number;
  reviews_count: number;
  image: string;
  brand: string;
  category: string;
  similarity_percent: number;
  in_stock: boolean;
}

export interface VisualSearchResponse {
  query_signature: {
    dominant_color: string;
    color_family: string;
  };
  total_matches: number;
  results: VisualSearchResultItem[];
}

export const visualSearchService = {
  /**
   * Search by photo upload or camera base64 data URI (Features 59 + 61)
   */
  async search(input: { file?: File; imageData?: string; limit?: number }): Promise<VisualSearchResponse> {
    if (input.file) {
      const formData = new FormData();
      formData.append('image', input.file);
      if (input.limit) formData.append('limit', String(input.limit));

      const res = await apiClient.post('/search/visual', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    } else if (input.imageData) {
      const res = await apiClient.post('/search/visual', {
        image_data: input.imageData,
        limit: input.limit || 12,
      });
      return res.data.data;
    }

    throw new Error('Either file or imageData is required for visual search');
  },
};

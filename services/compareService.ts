import { apiClient } from './apiClient';

export interface ComparedProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  rating: number;
  reviews_count: number;
  brand?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  seller?: {
    id: number;
    name: string;
    store_name: string;
    rating: number;
  } | null;
  in_stock: boolean;
  stock_quantity: number;
  delivery_info?: {
    estimated_days: number;
    free_delivery: boolean;
    cod_available: boolean;
  };
  offers?: string[];
  specifications: Record<string, string>;
  summary?: string;
}

export interface CompareApiResponse {
  success: boolean;
  data: {
    products: ComparedProduct[];
    specification_keys: string[];
    count: number;
  };
  message?: string;
}

export const compareService = {
  async getComparison(productIds: number[]): Promise<CompareApiResponse> {
    const params = new URLSearchParams();
    productIds.forEach((id) => params.append('ids[]', id.toString()));
    const response = await apiClient.get<CompareApiResponse>(`/products/compare?${params.toString()}`);
    return response.data;
  },
};

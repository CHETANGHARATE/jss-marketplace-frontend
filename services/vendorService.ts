import { apiClient } from './apiClient';
import { ApiProduct, ApiOrder, ApiVendorStore, ApiVendorWallet, ApiResponse, PaginatedApiResponse } from '../types/api';
import { Seller } from '../types';

export interface VendorDashboardData {
  total_sales: number;
  total_revenue: number;
  total_orders: number;
  total_products: number;
  low_stock_count: number;
  recent_orders: ApiOrder[];
}

export interface CreateVendorProductPayload {
  name: string | { en: string; hi?: string; mr?: string };
  slug?: string;
  category_id?: number;
  subcategory_id?: number;
  child_category_id?: number;
  brand_id?: number;
  sku?: string;
  short_description?: string | { en: string; hi?: string; mr?: string };
  description?: string | { en: string; hi?: string; mr?: string };
  original_price: number;
  offer_price?: number;
  sale_price?: number;
  cost_price?: number;
  gst_percent?: number;
  tax_inclusive?: boolean;
  stock_quantity: number;
  images?: string[];
  attribute_values?: number[];
  specifications?: any[];
  custom_specifications?: any[];
  variants?: any[];
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  dispatch_days?: number;
  shipping_charge?: number;
  is_free_shipping?: boolean;
  is_cod_available?: boolean;
  return_policy?: string;
  replacement_policy?: string;
  warranty_summary?: string;
  guarantee_summary?: string;
  cancellation_policy?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  highlights?: string[];
  search_keywords?: string;
  status?: string;
}

export interface VendorSettlement {
  id: number;
  settlement_number: string;
  amount: number;
  commission_fee: number;
  net_amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface VendorAnalyticsData {
  sales_trend: Array<{ date: string; amount: number }>;
  top_products: Array<{ id: number; name: string; sales_count: number }>;
  order_status_counts: Record<string, number>;
}

export function mapApiVendorStoreToSeller(store: ApiVendorStore): Seller {
  return {
    id: String(store.id),
    name: store.store_name,
    rating: 4.9,
    location: 'India',
    joinedDate: store.created_at ? store.created_at.substring(0, 4) : '2024',
    description: store.description || 'Verified multi-vendor partner store.'
  };
}

export const vendorService = {
  async getDashboard(): Promise<VendorDashboardData> {
    const response = await apiClient.get<ApiResponse<VendorDashboardData>>('/vendor/dashboard');
    return response.data.data;
  },

  async getProducts(params?: { search?: string; status?: string; page?: number }): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/vendor/products', { params });
    return response.data;
  },

  async createProduct(payload: CreateVendorProductPayload): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>('/vendor/products', payload);
    return response.data.data;
  },

  async updateProduct(id: number, payload: Partial<CreateVendorProductPayload>): Promise<ApiProduct> {
    const response = await apiClient.put<ApiResponse<ApiProduct>>(`/vendor/products/${id}`, payload);
    return response.data.data;
  },

  async submitProductForReview(id: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>(`/vendor/products/${id}/submit`);
    return response.data.data;
  },

  async duplicateProduct(id: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>(`/vendor/products/${id}/duplicate`);
    return response.data.data;
  },

  async getCategoryAttributes(categoryId: number): Promise<{ category_id: number; category_name: any; attributes: any[]; templates: any[] }> {
    const response = await apiClient.get<ApiResponse<{ category_id: number; category_name: any; attributes: any[]; templates: any[] }>>(`/categories/${categoryId}/attributes`);
    return response.data.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/vendor/products/${id}`);
  },

  async getInventory(): Promise<ApiProduct[]> {
    const response = await apiClient.get<ApiResponse<ApiProduct[]>>('/vendor/inventory');
    return response.data.data;
  },

  async updateInventory(productId: number, stock_quantity: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>('/vendor/inventory/update', {
      product_id: productId,
      stock_quantity,
    });
    return response.data.data;
  },

  async getOrders(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<ApiOrder>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiOrder>>('/vendor/orders', { params });
    return response.data;
  },

  async updateOrderStatus(orderId: number, status: string): Promise<ApiOrder> {
    const response = await apiClient.put<ApiResponse<ApiOrder>>(`/vendor/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  async getWallet(): Promise<ApiVendorWallet> {
    const response = await apiClient.get<ApiResponse<ApiVendorWallet>>('/vendor/wallet');
    return response.data.data;
  },

  async getSettlements(): Promise<VendorSettlement[]> {
    const response = await apiClient.get<ApiResponse<VendorSettlement[]>>('/vendor/settlements');
    return response.data.data;
  },

  async getAnalytics(range = '30d'): Promise<VendorAnalyticsData> {
    const response = await apiClient.get<ApiResponse<VendorAnalyticsData>>('/vendor/analytics', {
      params: { range },
    });
    return response.data.data;
  },

  async getStoreSettings(): Promise<ApiVendorStore> {
    const response = await apiClient.get<ApiResponse<ApiVendorStore>>('/vendor/store');
    return response.data.data;
  },

  async updateStoreSettings(payload: Partial<ApiVendorStore>): Promise<ApiVendorStore> {
    const response = await apiClient.put<ApiResponse<ApiVendorStore>>('/vendor/store', payload);
    return response.data.data;
  },

  async getVendorStores(): Promise<ApiVendorStore[]> {
    try {
      const response = await apiClient.get<ApiResponse<ApiVendorStore[]>>('/vendors');
      return response.data.data;
    } catch {
      try {
        const response = await apiClient.get<PaginatedApiResponse<ApiVendorStore>>('/admin/vendor/stores');
        return response.data.data;
      } catch {
        return [];
      }
    }
  },

  async registerVendorStore(payload: {
    store_name: string;
    store_email?: string;
    store_phone?: string;
    description?: string;
    gstin?: string;
    category?: string;
  }): Promise<ApiVendorStore> {
    const response = await apiClient.post<ApiResponse<ApiVendorStore>>('/vendor/store', payload);
    return response.data.data;
  },

  async getStoreBySlug(slug: string): Promise<{ store: any; products: any[] }> {
    const response = await apiClient.get<ApiResponse<{ store: any; products: any[] }>>(`/stores/${slug}`);
    return response.data.data;
  },
};

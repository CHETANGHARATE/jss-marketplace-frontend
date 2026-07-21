import { apiClient } from './apiClient';
import { ApiProduct, ApiOrder, ApiVendorStore, ApiVendorWallet, ApiResponse, PaginatedApiResponse } from '../types/api';

export interface VendorDashboardData {
  total_sales: number;
  total_revenue: number;
  total_orders: number;
  total_products: number;
  low_stock_count: number;
  recent_orders: ApiOrder[];
}

export interface CreateVendorProductPayload {
  name: string;
  category_id?: number;
  brand_id?: number;
  sku?: string;
  original_price: number;
  sale_price?: number;
  stock_quantity: number;
  description?: string;
  images?: string[];
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
};

import { apiClient } from './apiClient';
import { ApiUser, ApiVendorStore, ApiProduct, ApiOrder, ApiResponse, PaginatedApiResponse } from '../types/api';

export interface AdminDashboardMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_vendors: number;
  pending_vendor_approvals: number;
  pending_product_approvals: number;
  system_health: 'healthy' | 'degraded';
  recent_orders: ApiOrder[];
}

export interface AdminPaymentRecord {
  id: number;
  payment_id: string;
  order_number: string;
  amount: number;
  provider: string;
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  created_at: string;
}

export interface AdminShipmentRecord {
  id: number;
  tracking_number: string;
  order_number: string;
  courier_name: string;
  status: 'in_transit' | 'delivered' | 'out_for_delivery' | 'delayed';
  estimated_delivery: string;
  created_at: string;
}

export interface AdminReportData {
  sales_summary: Array<{ date: string; sales: number; revenue: number }>;
  top_vendors: Array<{ id: number; name: string; revenue: number }>;
  order_status_metrics: Record<string, number>;
}

export interface AdminPlatformSettings {
  marketplace_name: string;
  commission_percentage: number;
  tax_rate: number;
  support_email: string;
  maintenance_mode: boolean;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboardMetrics> {
    const response = await apiClient.get<ApiResponse<AdminDashboardMetrics>>('/admin/dashboard');
    return response.data.data;
  },

  async getCustomers(params?: { search?: string; status?: string; page?: number }): Promise<PaginatedApiResponse<ApiUser>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiUser>>('/admin/customers', { params });
    return response.data;
  },

  async toggleCustomerStatus(id: number): Promise<ApiUser> {
    const response = await apiClient.post<ApiResponse<ApiUser>>(`/admin/customers/${id}/toggle`);
    return response.data.data;
  },

  async getVendors(params?: { search?: string; status?: string; page?: number }): Promise<PaginatedApiResponse<ApiVendorStore>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiVendorStore>>('/admin/vendors', { params });
    return response.data;
  },

  async approveVendor(id: number): Promise<ApiVendorStore> {
    const response = await apiClient.post<ApiResponse<ApiVendorStore>>(`/admin/vendors/${id}/approve`);
    return response.data.data;
  },

  async suspendVendor(id: number): Promise<ApiVendorStore> {
    const response = await apiClient.post<ApiResponse<ApiVendorStore>>(`/admin/vendors/${id}/suspend`);
    return response.data.data;
  },

  async getProducts(params?: { search?: string; status?: string; page?: number }): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/admin/products', { params });
    return response.data;
  },

  async approveProduct(id: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>(`/admin/products/${id}/approve`);
    return response.data.data;
  },

  async rejectProduct(id: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>(`/admin/products/${id}/reject`);
    return response.data.data;
  },

  async toggleFeatureProduct(id: number): Promise<ApiProduct> {
    const response = await apiClient.post<ApiResponse<ApiProduct>>(`/admin/products/${id}/feature`);
    return response.data.data;
  },

  async getOrders(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<ApiOrder>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiOrder>>('/admin/orders', { params });
    return response.data;
  },

  async updateOrderStatus(id: number, status: string): Promise<ApiOrder> {
    const response = await apiClient.put<ApiResponse<ApiOrder>>(`/admin/orders/${id}/status`, { status });
    return response.data.data;
  },

  async getPayments(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<AdminPaymentRecord>> {
    const response = await apiClient.get<PaginatedApiResponse<AdminPaymentRecord>>('/admin/payments', { params });
    return response.data;
  },

  async getShipments(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<AdminShipmentRecord>> {
    const response = await apiClient.get<PaginatedApiResponse<AdminShipmentRecord>>('/admin/shipments', { params });
    return response.data;
  },

  async getReports(range = '30d'): Promise<AdminReportData> {
    const response = await apiClient.get<ApiResponse<AdminReportData>>('/admin/reports', { params: { range } });
    return response.data.data;
  },

  async getSettings(): Promise<AdminPlatformSettings> {
    const response = await apiClient.get<ApiResponse<AdminPlatformSettings>>('/admin/settings');
    return response.data.data;
  },

  async updateSettings(payload: Partial<AdminPlatformSettings>): Promise<AdminPlatformSettings> {
    const response = await apiClient.put<ApiResponse<AdminPlatformSettings>>('/admin/settings', payload);
    return response.data.data;
  },
};

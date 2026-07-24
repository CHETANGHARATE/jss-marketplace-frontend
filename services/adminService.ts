import { apiClient } from './apiClient';
import {
  ApiUser,
  ApiVendorStore,
  ApiProduct,
  ApiOrder,
  ApiCategory,
  ApiBrand,
  ApiReview,
  ApiCoupon,
  ApiResponse,
  PaginatedApiResponse,
} from '../types/api';

// ─── Dashboard & Analytics ────────────────────────────────────────────────────

export interface AdminDashboardMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_vendors: number;
  pending_vendor_approvals: number;
  pending_product_approvals: number;
  system_health: 'healthy' | 'degraded';
  recent_orders: ApiOrder[];
  // Extended fields returned by analytics/overview
  total_products?: number;
  total_categories?: number;
  low_stock_count?: number;
  sales_chart?: Array<{ date: string; revenue: number; orders: number }>;
}

export interface AdminSalesAnalytics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  revenue_by_day: Array<{ date: string; revenue: number }>;
  orders_by_status: Record<string, number>;
}

export interface AdminInventoryAnalytics {
  total_products: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface AdminPaymentRecord {
  id: number;
  payment_id: string;
  order_number: string;
  amount: number;
  provider: string;
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  created_at: string;
}

// ─── Shipments ────────────────────────────────────────────────────────────────

export interface AdminShipmentRecord {
  id: number;
  tracking_number: string;
  order_number: string;
  courier_name: string;
  status: 'in_transit' | 'delivered' | 'out_for_delivery' | 'delayed';
  estimated_delivery: string;
  created_at: string;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface AdminReportData {
  sales_summary: Array<{ date: string; sales: number; revenue: number }>;
  top_vendors: Array<{ id: number; name: string; revenue: number }>;
  order_status_metrics: Record<string, number>;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface AdminPlatformSettings {
  marketplace_name?: string;
  support_email?: string;
  support_phone?: string;
  address?: string;
  currency?: string;
  tax_rate?: number;
  commission_percentage?: number;
  maintenance_mode?: boolean;
  logo?: string;
  favicon?: string;
  [key: string]: unknown;
}

// ─── Coupons & Flash Sales ────────────────────────────────────────────────────

export interface AdminCoupon extends ApiCoupon {
  usage_count?: number;
  expires_at?: string;
  created_at?: string;
}

export interface AdminFlashSale {
  id: number;
  name: string;
  discount_percentage: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  products?: ApiProduct[];
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryRecord {
  id: number;
  product_id: number;
  product?: ApiProduct;
  warehouse_id?: number;
  quantity: number;
  reserved_quantity?: number;
  reorder_level?: number;
  updated_at?: string;
}

// ─── Shipping Zone ─────────────────────────────────────────────────────────────

export interface ShippingZone {
  id: number;
  name: string;
  states: string[];
  charge: number;
  created_at?: string;
}

// ─── Service Methods ──────────────────────────────────────────────────────────

export const adminService = {

  // ── Dashboard / Analytics ──────────────────────────────────────────────────

  /** GET /admin/analytics/overview — main dashboard metrics */
  async getDashboard(): Promise<AdminDashboardMetrics> {
    const response = await apiClient.get<ApiResponse<AdminDashboardMetrics>>('/admin/analytics/overview');
    return response.data.data;
  },

  /** GET /admin/analytics/sales */
  async getSalesAnalytics(params?: { start_date?: string; end_date?: string }): Promise<AdminSalesAnalytics> {
    const response = await apiClient.get<ApiResponse<AdminSalesAnalytics>>('/admin/analytics/sales', { params });
    return response.data.data;
  },

  /** GET /admin/analytics/inventory */
  async getInventoryAnalytics(): Promise<AdminInventoryAnalytics> {
    const response = await apiClient.get<ApiResponse<AdminInventoryAnalytics>>('/admin/analytics/inventory');
    return response.data.data;
  },

  // ── Customers ─────────────────────────────────────────────────────────────

  /** GET /admin/customers */
  async getCustomers(params?: { search?: string; status?: string; page?: number }): Promise<PaginatedApiResponse<ApiUser>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiUser>>('/admin/customers', { params });
    return response.data;
  },

  /** PATCH /admin/customers/{id}/toggle-status */
  async toggleCustomerStatus(id: number): Promise<ApiUser> {
    const response = await apiClient.patch<ApiResponse<ApiUser>>(`/admin/customers/${id}/toggle-status`);
    return response.data.data;
  },

  // ── Vendors ───────────────────────────────────────────────────────────────

  /** GET /admin/vendor/stores */
  async getVendors(params?: { search?: string; status?: string; kyc_status?: string; page?: number }): Promise<PaginatedApiResponse<ApiVendorStore>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiVendorStore>>('/admin/vendor/stores', { params });
    return response.data;
  },

  /** POST /admin/vendor/stores/{id}/approve */
  async approveVendor(id: number): Promise<ApiVendorStore> {
    const response = await apiClient.post<ApiResponse<ApiVendorStore>>(`/admin/vendor/stores/${id}/approve`);
    return response.data.data;
  },

  /** POST /admin/vendor/stores/{id}/suspend */
  async suspendVendor(id: number): Promise<ApiVendorStore> {
    const response = await apiClient.post<ApiResponse<ApiVendorStore>>(`/admin/vendor/stores/${id}/suspend`);
    return response.data.data;
  },

  /** PATCH /admin/vendor/stores/{id}/kyc */
  async updateVendorKYC(id: number, kyc_status: 'pending' | 'verified' | 'rejected'): Promise<ApiVendorStore> {
    const response = await apiClient.patch<ApiResponse<ApiVendorStore>>(`/admin/vendor/stores/${id}/kyc`, { kyc_status });
    return response.data.data;
  },

  // ── Products ──────────────────────────────────────────────────────────────

  /** GET /products (public endpoint, supports admin filters) */
  async getProducts(params?: { search?: string; status?: string; page?: number; per_page?: number }): Promise<PaginatedApiResponse<ApiProduct>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiProduct>>('/products', { params });
    return response.data;
  },

  /** PATCH /admin/products/{id}/status */
  async updateProductStatus(id: number, status: string): Promise<ApiProduct> {
    const response = await apiClient.patch<ApiResponse<ApiProduct>>(`/admin/products/${id}/status`, { status });
    return response.data.data;
  },

  /** DELETE /admin/products/{id} */
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`);
  },

  // ── Categories ────────────────────────────────────────────────────────────

  /** GET /categories */
  async getCategories(): Promise<ApiCategory[]> {
    const response = await apiClient.get<ApiResponse<ApiCategory[]>>('/categories');
    return response.data.data;
  },

  /** POST /admin/categories */
  async createCategory(payload: Partial<ApiCategory>): Promise<ApiCategory> {
    const response = await apiClient.post<ApiResponse<ApiCategory>>('/admin/categories', payload);
    return response.data.data;
  },

  /** PUT /admin/categories/{id} */
  async updateCategory(id: number, payload: Partial<ApiCategory>): Promise<ApiCategory> {
    const response = await apiClient.put<ApiResponse<ApiCategory>>(`/admin/categories/${id}`, payload);
    return response.data.data;
  },

  /** DELETE /admin/categories/{id} */
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`/admin/categories/${id}`);
  },

  // ── Brands ────────────────────────────────────────────────────────────────

  /** GET /brands */
  async getBrands(params?: { search?: string; page?: number }): Promise<PaginatedApiResponse<ApiBrand>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiBrand>>('/brands', { params });
    return response.data;
  },

  /** POST /admin/brands */
  async createBrand(payload: Partial<ApiBrand>): Promise<ApiBrand> {
    const response = await apiClient.post<ApiResponse<ApiBrand>>('/admin/brands', payload);
    return response.data.data;
  },

  /** PUT /admin/brands/{id} */
  async updateBrand(id: number, payload: Partial<ApiBrand>): Promise<ApiBrand> {
    const response = await apiClient.put<ApiResponse<ApiBrand>>(`/admin/brands/${id}`, payload);
    return response.data.data;
  },

  /** DELETE /admin/brands/{id} */
  async deleteBrand(id: number): Promise<void> {
    await apiClient.delete(`/admin/brands/${id}`);
  },

  // ── Orders ────────────────────────────────────────────────────────────────

  /** GET /admin/orders */
  async getOrders(params?: { status?: string; page?: number; search?: string }): Promise<PaginatedApiResponse<ApiOrder>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiOrder>>('/admin/orders', { params });
    return response.data;
  },

  /** GET /admin/orders/{id} */
  async getOrder(id: number): Promise<ApiOrder> {
    const response = await apiClient.get<ApiResponse<ApiOrder>>(`/admin/orders/${id}`);
    return response.data.data;
  },

  /** PATCH /admin/orders/{id}/status */
  async updateOrderStatus(id: number, status: string): Promise<ApiOrder> {
    const response = await apiClient.patch<ApiResponse<ApiOrder>>(`/admin/orders/${id}/status`, { status });
    return response.data.data;
  },

  // ── Payments ─────────────────────────────────────────────────────────────

  /** GET /admin/payments */
  async getPayments(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<AdminPaymentRecord>> {
    const response = await apiClient.get<PaginatedApiResponse<AdminPaymentRecord>>('/admin/payments', { params });
    return response.data;
  },

  /** POST /admin/payments/refund */
  async refundPayment(payload: { order_id: number; amount: number; reason?: string }): Promise<void> {
    await apiClient.post('/admin/payments/refund', payload);
  },

  // ── Shipments ─────────────────────────────────────────────────────────────

  /** GET /admin/shipments */
  async getShipments(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<AdminShipmentRecord>> {
    const response = await apiClient.get<PaginatedApiResponse<AdminShipmentRecord>>('/admin/shipments', { params });
    return response.data;
  },

  /** GET /admin/shipping-zones */
  async getShippingZones(): Promise<ShippingZone[]> {
    const response = await apiClient.get<ApiResponse<ShippingZone[]>>('/admin/shipping-zones');
    return response.data.data;
  },

  // ── Reviews ───────────────────────────────────────────────────────────────

  /** GET /admin/reviews */
  async getReviews(params?: { status?: string; page?: number }): Promise<PaginatedApiResponse<ApiReview>> {
    const response = await apiClient.get<PaginatedApiResponse<ApiReview>>('/admin/reviews', { params });
    return response.data;
  },

  /** PATCH /admin/reviews/{id}/moderate */
  async moderateReview(id: number, status: 'approved' | 'rejected'): Promise<ApiReview> {
    const response = await apiClient.patch<ApiResponse<ApiReview>>(`/admin/reviews/${id}/moderate`, { status });
    return response.data.data;
  },

  // ── Coupons ───────────────────────────────────────────────────────────────

  /** GET /admin/coupons */
  async getCoupons(): Promise<AdminCoupon[]> {
    const response = await apiClient.get<ApiResponse<AdminCoupon[]>>('/admin/coupons');
    return response.data.data;
  },

  /** POST /admin/coupons */
  async createCoupon(payload: Partial<AdminCoupon>): Promise<AdminCoupon> {
    const response = await apiClient.post<ApiResponse<AdminCoupon>>('/admin/coupons', payload);
    return response.data.data;
  },

  /** DELETE /admin/coupons/{id} */
  async deleteCoupon(id: number): Promise<void> {
    await apiClient.delete(`/admin/coupons/${id}`);
  },

  // ── Flash Sales / Promotions ──────────────────────────────────────────────

  /** GET /admin/flash-sales */
  async getFlashSales(): Promise<AdminFlashSale[]> {
    const response = await apiClient.get<ApiResponse<AdminFlashSale[]>>('/admin/flash-sales');
    return response.data.data;
  },

  /** POST /admin/flash-sales */
  async createFlashSale(payload: Partial<AdminFlashSale>): Promise<AdminFlashSale> {
    const response = await apiClient.post<ApiResponse<AdminFlashSale>>('/admin/flash-sales', payload);
    return response.data.data;
  },

  // ── Inventory ─────────────────────────────────────────────────────────────

  /** GET /admin/inventories */
  async getInventories(params?: { search?: string; page?: number }): Promise<PaginatedApiResponse<InventoryRecord>> {
    const response = await apiClient.get<PaginatedApiResponse<InventoryRecord>>('/admin/inventories', { params });
    return response.data;
  },

  /** GET /admin/inventories/low-stock */
  async getLowStockReport(): Promise<InventoryRecord[]> {
    const response = await apiClient.get<ApiResponse<InventoryRecord[]>>('/admin/inventories/low-stock');
    return response.data.data;
  },

  /** POST /admin/inventories/add-stock */
  async addStock(payload: { product_id: number; warehouse_id?: number; quantity: number; notes?: string }): Promise<void> {
    await apiClient.post('/admin/inventories/add-stock', payload);
  },

  /** POST /admin/inventories/adjust-stock */
  async adjustStock(payload: { product_id: number; quantity: number; type: 'add' | 'remove'; reason?: string }): Promise<void> {
    await apiClient.post('/admin/inventories/adjust-stock', payload);
  },

  // ── Settings ──────────────────────────────────────────────────────────────

  /** GET /settings (public) */
  async getSettings(): Promise<AdminPlatformSettings> {
    const response = await apiClient.get<ApiResponse<AdminPlatformSettings>>('/settings');
    return response.data.data;
  },

  /** PUT /admin/settings */
  async updateSettings(payload: Partial<AdminPlatformSettings>): Promise<AdminPlatformSettings> {
    const response = await apiClient.put<ApiResponse<AdminPlatformSettings>>('/admin/settings', payload);
    return response.data.data;
  },

  // ── Media Upload ──────────────────────────────────────────────────────────

  /** POST /admin/media/upload */
  async uploadMedia(file: File): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<{ url: string; path: string }>>('/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

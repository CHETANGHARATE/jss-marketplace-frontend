import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminService,
  AdminPlatformSettings,
  AdminCoupon,
  AdminFlashSale,
} from '../services/adminService';

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export function useAdminDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminSalesAnalyticsQuery(
  params?: { start_date?: string; end_date?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'sales', params],
    queryFn: () => adminService.getSalesAnalytics(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminInventoryAnalyticsQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'analytics', 'inventory'],
    queryFn: () => adminService.getInventoryAnalytics(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export function useAdminCustomersQuery(
  params?: { search?: string; status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => adminService.getCustomers(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useToggleCustomerStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.toggleCustomerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
}

// ─── Vendors ──────────────────────────────────────────────────────────────────

export function useAdminVendorsQuery(
  params?: { search?: string; status?: string; kyc_status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'vendors', params],
    queryFn: () => adminService.getVendors(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useApproveVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.approveVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useSuspendVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.suspendVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
    },
  });
}

export function useUpdateVendorKYCMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kyc_status }: { id: number; kyc_status: 'pending' | 'verified' | 'rejected' }) =>
      adminService.updateVendorKYC(id, kyc_status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
    },
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useAdminProductsQuery(
  params?: { search?: string; status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminService.getProducts(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateProductStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.updateProductStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

// Keep legacy aliases so existing pages continue to compile
export function useApproveProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.updateProductStatus(id, 'published'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useRejectProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.updateProductStatus(id, 'rejected'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useToggleFeatureProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.updateProductStatus(id, 'published'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useAdminCategoriesQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => adminService.getCategories(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: unknown }) =>
      adminService.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    },
  });
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export function useAdminBrandsQuery(
  params?: { search?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'brands', params],
    queryFn: () => adminService.getBrands(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminService.createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useUpdateBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: unknown }) =>
      adminService.updateBrand(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    },
  });
}

export function useDeleteBrandMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'brands'] });
    },
  });
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useAdminOrdersQuery(
  params?: { status?: string; page?: number; search?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminService.getOrders(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminOrderQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => adminService.getOrder(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export function useAdminPaymentsQuery(
  params?: { status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => adminService.getPayments(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useRefundPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { order_id: number; amount: number; reason?: string }) =>
      adminService.refundPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

// ─── Shipments ────────────────────────────────────────────────────────────────

export function useAdminShipmentsQuery(
  params?: { status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'shipments', params],
    queryFn: () => adminService.getShipments(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminShippingZonesQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'shipping-zones'],
    queryFn: () => adminService.getShippingZones(),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useAdminReviewsQuery(
  params?: { status?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => adminService.getReviews(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useModerateReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'approved' | 'rejected' }) =>
      adminService.moderateReview(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useAdminCouponsQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => adminService.getCoupons(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AdminCoupon>) => adminService.createCoupon(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

export function useDeleteCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

// ─── Flash Sales ──────────────────────────────────────────────────────────────

export function useAdminFlashSalesQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'flash-sales'],
    queryFn: () => adminService.getFlashSales(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateFlashSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AdminFlashSale>) => adminService.createFlashSale(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export function useAdminInventoriesQuery(
  params?: { search?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'inventories', params],
    queryFn: () => adminService.getInventories(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminLowStockQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'inventories', 'low-stock'],
    queryFn: () => adminService.getLowStockReport(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { product_id: number; warehouse_id?: number; quantity: number; notes?: string }) =>
      adminService.addStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventories'] });
    },
  });
}

export function useAdjustStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { product_id: number; quantity: number; type: 'add' | 'remove'; reason?: string }) =>
      adminService.adjustStock(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'inventories'] });
    },
  });
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function useAdminSettingsQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminService.getSettings(),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateAdminSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AdminPlatformSettings>) => adminService.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
}

// ─── Reports (legacy alias — maps to analytics) ───────────────────────────────

export function useAdminReportsQuery(range = '30d', enabled = true) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
  const end = new Date().toISOString().split('T')[0];
  const start = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  return useAdminSalesAnalyticsQuery({ start_date: start, end_date: end }, enabled);
}

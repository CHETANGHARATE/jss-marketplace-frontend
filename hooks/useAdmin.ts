import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  adminService,
  AdminPlatformSettings,
  AdminCoupon,
  AdminFlashSale,
} from '../services/adminService';

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export function useAdminDashboardQuery(
  params?: { start_date?: string; end_date?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'dashboard', params],
    queryFn: () => adminService.getDashboard(params),
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
  params?: { search?: string; status?: string; filter?: string; page?: number },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => adminService.getCustomers(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminCustomerQuery(id: number | null, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'customers', id],
    queryFn: () => adminService.getCustomer(id!),
    enabled: enabled && !!id,
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

export function useAdminVendorQuery(id: number | null, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'vendors', id],
    queryFn: () => adminService.getVendor(id!),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminVendorStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'vendors', 'stats'],
    queryFn: () => adminService.getVendorStats(),
    staleTime: 1000 * 30,
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

export function useRejectVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.rejectVendor(id),
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
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useActivateVendorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.activateVendor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
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
  params?: { search?: string; status?: string; category_id?: number | string; page?: number; per_page?: number },
  enabled = true
) {
  const mergedParams = { per_page: 500, ...params };
  return useQuery({
    queryKey: ['admin', 'products', mergedParams],
    queryFn: () => adminService.getProducts(mergedParams),
    enabled,
    staleTime: 0,
  });
}

export function useAdminPendingProductsQuery(params?: { page?: number; per_page?: number }, enabled = true) {
  const mergedParams = { per_page: 500, ...params };
  return useQuery({
    queryKey: ['admin', 'products', 'pending', mergedParams],
    queryFn: () => adminService.getPendingProducts(mergedParams),
    enabled,
    staleTime: 0,
  });
}

export function useApproveProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.approveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useAdminProductDetailsQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => adminService.getProductDetails(id),
    enabled: enabled && !!id,
  });
}

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, any>) => adminService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useUpdateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, any> }) => adminService.updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useDuplicateAdminProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.duplicateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function usePublishProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.publishProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUnpublishProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.unpublishProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useRejectProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => adminService.rejectProduct(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useArchiveProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.archiveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useRestoreProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.restoreProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useBulkActionProductsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      product_ids: number[];
      action: string;
      category_id?: number;
      brand_id?: number;
      gst_percent?: number;
      stock_quantity?: number;
      rejection_reason?: string;
    }) => adminService.bulkActionProducts(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}


export function useRequestProductChangesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, instructions }: { id: number; instructions: string }) => adminService.requestProductChanges(id, instructions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
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

export function useToggleFeatureProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.updateProductStatus(id, 'published'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

// ─── Attribute Templates ───────────────────────────────────────────────────

export function useAdminAttributeTemplatesQuery(params?: { category_id?: number; search?: string }, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'attribute-templates', params],
    queryFn: () => adminService.getAttributeTemplates(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateAttributeTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof adminService.createAttributeTemplate>[0]) =>
      adminService.createAttributeTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'attribute-templates'] });
    },
  });
}

export function useUpdateAttributeTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof adminService.updateAttributeTemplate>[1] }) =>
      adminService.updateAttributeTemplate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'attribute-templates'] });
    },
  });
}

export function useDeleteAttributeTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteAttributeTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'attribute-templates'] });
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
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ─── Subcategories ────────────────────────────────────────────────────────────

export function useAdminSubcategoriesQuery(
  params?: { category_id?: number; parent_id?: number; search?: string },
  enabled = true
) {
  return useQuery({
    queryKey: ['admin', 'subcategories', params],
    queryFn: () => adminService.getSubcategories(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminService.createSubcategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      adminService.updateSubcategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteSubcategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateSubcategoryStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { is_active?: boolean; sort_order?: number } }) =>
      adminService.updateSubcategoryStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'subcategories'] });
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

export function useUpdateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AdminCoupon> }) =>
      adminService.updateCoupon(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });
}

export function useToggleCouponStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.toggleCouponStatus(id),
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
    mutationFn: (payload: Partial<AdminFlashSale> & { title?: string; products?: any[] }) =>
      adminService.createFlashSale(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });
}

export function useUpdateFlashSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AdminFlashSale> & { title?: string } }) =>
      adminService.updateFlashSale(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });
}

export function useToggleFlashSaleStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.toggleFlashSaleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });
}

export function useDeleteFlashSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteFlashSale(id),
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

// ─── Bulk Product Import ──────────────────────────────────────────────────────

export function useValidateBulkImportMutation() {
  return useMutation({
    mutationFn: ({ products, updateExisting }: { products: any[]; updateExisting?: boolean }) =>
      adminService.validateBulkImport(products, updateExisting),
  });
}

export function useExecuteBulkImportMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      products,
      updateExisting,
      imagesMap,
    }: {
      products: any[];
      updateExisting?: boolean;
      imagesMap?: Record<string, string>;
    }) => adminService.executeBulkImport(products, updateExisting, imagesMap),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

// ─── CMS & Content ────────────────────────────────────────────────────────────

export function useAdminCmsBannersQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'cms', 'banners'],
    queryFn: () => adminService.getBanners(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => adminService.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'banners'] });
    },
  });
}

export function useUpdateBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      adminService.updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'banners'] });
    },
  });
}

export function useToggleBannerStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.toggleBannerStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'banners'] });
    },
  });
}

export function useDeleteBannerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'banners'] });
    },
  });
}

export function useAdminCmsPopupsQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'cms', 'popups'],
    queryFn: () => adminService.getPopups(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePopupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => adminService.updatePopup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'popups'] });
    },
  });
}

export function useAdminCmsPagesQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'cms', 'pages'],
    queryFn: () => adminService.getCmsPages(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateCmsPageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      adminService.updateCmsPage(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'pages'] });
    },
  });
}

export function useAdminCmsFaqsQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'cms', 'faqs'],
    queryFn: () => adminService.getFaqs(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateFaqMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => adminService.createFaq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'faqs'] });
    },
  });
}

export function useDeleteFaqMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cms', 'faqs'] });
    },
  });
}

// ─── Staff & RBAC ─────────────────────────────────────────────────────────────

export function useAdminStaffRolesQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'staff', 'roles'],
    queryFn: () => adminService.getStaffRoles(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminStaffListQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'staff', 'list'],
    queryFn: () => adminService.getStaffList(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => adminService.createStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
    },
  });
}

export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      adminService.updateStaff(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
    },
  });
}

export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] });
    },
  });
}

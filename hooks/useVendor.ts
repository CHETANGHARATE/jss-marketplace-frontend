import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService, CreateVendorProductPayload } from '../services/vendorService';
import { ApiVendorStore } from '../types/api';

export function useVendorDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'dashboard'],
    queryFn: () => vendorService.getDashboard(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useVendorProductsQuery(params?: { search?: string; status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'products', params],
    queryFn: () => vendorService.getProducts(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateVendorProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVendorProductPayload) => vendorService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
    },
  });
}

export function useDeleteVendorProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    },
  });
}

export function useVendorInventoryQuery(enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'inventory'],
    queryFn: () => vendorService.getInventory(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateVendorInventoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, stock_quantity }: { productId: number; stock_quantity: number }) =>
      vendorService.updateInventory(productId, stock_quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'inventory'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    },
  });
}

export function useVendorOrdersQuery(params?: { status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'orders', params],
    queryFn: () => vendorService.getOrders(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateVendorOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      vendorService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
    },
  });
}

export function useVendorWalletQuery(enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'wallet'],
    queryFn: () => vendorService.getWallet(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useVendorSettlementsQuery(enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'settlements'],
    queryFn: () => vendorService.getSettlements(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useVendorAnalyticsQuery(range = '30d', enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'analytics', range],
    queryFn: () => vendorService.getAnalytics(range),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useVendorStoreSettingsQuery(enabled = true) {
  return useQuery({
    queryKey: ['vendor', 'store'],
    queryFn: () => vendorService.getStoreSettings(),
    enabled,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateVendorStoreSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ApiVendorStore>) => vendorService.updateStoreSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'store'] });
    },
  });
}

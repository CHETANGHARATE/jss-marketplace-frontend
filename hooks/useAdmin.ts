import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, AdminPlatformSettings } from '../services/adminService';

export function useAdminDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminCustomersQuery(params?: { search?: string; status?: string; page?: number }, enabled = true) {
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

export function useAdminVendorsQuery(params?: { search?: string; status?: string; page?: number }, enabled = true) {
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

export function useAdminProductsQuery(params?: { search?: string; status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminService.getProducts(params),
    enabled,
    staleTime: 1000 * 60 * 2,
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

export function useRejectProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.rejectProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useToggleFeatureProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminService.toggleFeatureProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useAdminOrdersQuery(params?: { status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminService.getOrders(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

export function useAdminPaymentsQuery(params?: { status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: () => adminService.getPayments(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminShipmentsQuery(params?: { status?: string; page?: number }, enabled = true) {
  return useQuery({
    queryKey: ['admin', 'shipments', params],
    queryFn: () => adminService.getShipments(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAdminReportsQuery(range = '30d', enabled = true) {
  return useQuery({
    queryKey: ['admin', 'reports', range],
    queryFn: () => adminService.getReports(range),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

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

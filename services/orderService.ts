import { apiClient } from './apiClient';
import { ApiOrder, ApiResponse, PaginatedApiResponse } from '../types/api';

export const orderService = {
  async getOrders(): Promise<ApiOrder[]> {
    const response = await apiClient.get<PaginatedApiResponse<ApiOrder>>('/orders');
    return response.data.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiOrder> {
    const response = await apiClient.get<ApiResponse<ApiOrder>>(`/orders/${orderNumber}`);
    return response.data.data;
  },

  async cancelOrder(orderNumber: string, reason: string = 'Customer requested cancellation'): Promise<ApiOrder> {
    const response = await apiClient.post<ApiResponse<ApiOrder>>(`/orders/${orderNumber}/cancel`, { reason });
    return response.data.data;
  },

  async cancelOrderItem(orderNumber: string, itemId: number, reason: string): Promise<ApiOrder> {
    const response = await apiClient.post<ApiResponse<ApiOrder>>(`/orders/${orderNumber}/items/${itemId}/cancel`, { reason });
    return response.data.data;
  },

  async downloadInvoicePdf(orderNumber: string): Promise<Blob> {
    const response = await apiClient.get(`/orders/${orderNumber}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async getOrderShipment(orderNumber: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(`/orders/${orderNumber}/shipment`);
    return response.data.data;
  },
};

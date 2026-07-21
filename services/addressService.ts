import { apiClient } from './apiClient';
import { ApiAddress, ApiResponse } from '../types/api';

export interface CreateAddressPayload {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export const addressService = {
  async getAddresses(): Promise<ApiAddress[]> {
    const response = await apiClient.get<ApiResponse<ApiAddress[]>>('/addresses');
    return response.data.data;
  },

  async createAddress(payload: CreateAddressPayload): Promise<ApiAddress> {
    const response = await apiClient.post<ApiResponse<ApiAddress>>('/addresses', payload);
    return response.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/addresses/${id}`);
  },
};

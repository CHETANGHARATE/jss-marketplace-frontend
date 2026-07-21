import { apiClient } from './apiClient';
import { ApiPayment, ApiResponse } from '../types/api';

export interface PaymentMethodOption {
  id: 'razorpay' | 'stripe' | 'cod' | 'bank_transfer';
  name: string;
  description: string;
  icon?: string;
  is_active: boolean;
}

export interface CreatePaymentOrderPayload {
  order_id: number;
  gateway: 'razorpay' | 'stripe' | 'cod';
}

export interface VerifyPaymentPayload {
  payment_id?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  stripe_payment_intent_id?: string;
}

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethodOption[]> {
    const response = await apiClient.get<ApiResponse<PaymentMethodOption[]>>('/payments/methods');
    return response.data.data;
  },

  async createPaymentOrder(payload: CreatePaymentOrderPayload): Promise<{
    payment_id: number;
    gateway_order_id: string;
    amount: number;
    currency: string;
    key?: string;
  }> {
    const response = await apiClient.post<ApiResponse<any>>('/payments/create-order', payload);
    return response.data.data;
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<ApiPayment> {
    const response = await apiClient.post<ApiResponse<ApiPayment>>('/payments/verify', payload);
    return response.data.data;
  },

  async getPaymentStatus(paymentId: number | string): Promise<ApiPayment> {
    const response = await apiClient.get<ApiResponse<ApiPayment>>(`/payments/${paymentId}/status`);
    return response.data.data;
  },
};

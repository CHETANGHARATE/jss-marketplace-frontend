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
  gateway?: 'razorpay' | 'stripe' | 'cod';
}

export interface RazorpayOrderResponse {
  gateway: string;
  key_id?: string;
  key?: string;
  razorpay_order_id: string;
  gateway_order_id?: string;
  amount: number;
  currency: string;
  order_number: string;
  payment_number?: string;
  payment_id?: number;
}

export interface VerifyPaymentPayload {
  order_id: number;
  gateway: 'razorpay' | 'stripe' | 'cod';
  payload: {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    payment_intent_id?: string;
    [key: string]: any;
  };
}

export const paymentService = {
  async getPaymentMethods(): Promise<PaymentMethodOption[]> {
    const response = await apiClient.get<ApiResponse<PaymentMethodOption[]>>('/payments/methods');
    return response.data.data;
  },

  async createPaymentOrder(payload: CreatePaymentOrderPayload): Promise<RazorpayOrderResponse> {
    const response = await apiClient.post<ApiResponse<RazorpayOrderResponse>>('/payments/initiate', {
      order_id: payload.order_id,
      gateway: payload.gateway || 'razorpay',
    });
    const data = response.data.data;
    // Map backwards-compatible fields
    return {
      ...data,
      key: data.key_id || data.key,
      gateway_order_id: data.razorpay_order_id || data.gateway_order_id,
    };
  },

  async verifyPayment(payload: VerifyPaymentPayload): Promise<ApiPayment> {
    const response = await apiClient.post<ApiResponse<ApiPayment>>('/payments/verify', payload);
    return response.data.data;
  },

  async getPaymentStatus(paymentNumberOrId: number | string): Promise<ApiPayment> {
    const response = await apiClient.get<ApiResponse<ApiPayment>>(`/payments/${paymentNumberOrId}`);
    return response.data.data;
  },
};


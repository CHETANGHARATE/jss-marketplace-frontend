import { apiClient } from './apiClient';
import { ApiResponse } from '../types/api';

export interface ReturnTimelineStage {
  key: string;
  label: string;
  completed: boolean;
}

export interface ApiOrderReturn {
  id: number;
  return_number: string;
  order_id: number;
  order_item_id?: number | null;
  user_id: number;
  reason: string;
  notes?: string | null;
  evidence_urls?: string[];
  pickup_address_snapshot?: any;
  status:
    | 'requested'
    | 'approved'
    | 'pickup_scheduled'
    | 'picked_up'
    | 'received'
    | 'inspected'
    | 'approved_for_refund'
    | 'refund_processing'
    | 'refunded'
    | 'rejected';
  refund_amount: number;
  courier_name?: string | null;
  tracking_number?: string | null;
  rejection_reason?: string | null;
  processed_at?: string | null;
  created_at: string;
  order?: any;
  order_item?: any;
}

export interface CreateReturnPayload {
  order_id: number;
  order_item_id?: number | null;
  reason: string;
  notes?: string;
  evidence_urls?: string[];
  pickup_address_snapshot?: any;
}

export interface ReturnDetailsResponse {
  return: ApiOrderReturn;
  timeline: ReturnTimelineStage[];
  courier: {
    courier_name: string;
    tracking_number: string;
  };
}

export const returnService = {
  async getReturns(): Promise<ApiOrderReturn[]> {
    const response = await apiClient.get<ApiResponse<ApiOrderReturn[]>>('/returns');
    return response.data.data || [];
  },

  async createReturn(payload: CreateReturnPayload): Promise<ApiOrderReturn> {
    const response = await apiClient.post<ApiResponse<ApiOrderReturn>>('/returns', payload);
    return response.data.data;
  },

  async getReturnDetails(returnNumber: string): Promise<ReturnDetailsResponse> {
    const response = await apiClient.get<ApiResponse<ReturnDetailsResponse>>(`/returns/${returnNumber}`);
    return response.data.data;
  },
};

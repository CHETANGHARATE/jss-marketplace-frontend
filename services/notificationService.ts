import { apiClient } from './apiClient';
import { ApiNotification, ApiResponse } from '../types/api';

export interface UserNotificationPreference {
  id?: number;
  user_id?: number;
  email_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  in_app_enabled: boolean;
  order_updates: boolean;
  price_alerts: boolean;
  stock_alerts: boolean;
  store_updates: boolean;
  promotions: boolean;
  abandoned_cart: boolean;
  preferred_language: string;
}

export interface NotificationTemplateItem {
  id: number;
  template_key: string;
  event_name: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  language: string;
  subject?: string;
  body: string;
  variables?: string[];
  dlt_template_id?: string;
  whatsapp_template_name?: string;
  is_active: boolean;
  is_system_locked: boolean;
}

export interface NotificationLogItem {
  id: number;
  user_id?: number;
  recipient_target: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp';
  event_key: string;
  template_key?: string;
  subject?: string;
  message_content: string;
  provider: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  error_message?: string;
  retry_count: number;
  queued_at?: string;
  sent_at?: string;
  failed_at?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    mobile?: string;
  };
}

export interface NotificationStats {
  total: number;
  sent: number;
  failed: number;
  queued: number;
  success_rate: number;
  by_channel: Array<{
    channel: string;
    total: number;
    success_count: number;
    fail_count: number;
  }>;
}

export const notificationService = {
  // Customer Inbox
  async getNotifications(): Promise<ApiNotification[]> {
    const response = await apiClient.get<ApiResponse<ApiNotification[]>>('/notifications');
    return response.data.data;
  },

  async markAsRead(id: number | string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post('/notifications/read-all');
  },

  // Customer Preferences (Phase 5)
  async getPreferences(): Promise<UserNotificationPreference> {
    const response = await apiClient.get<ApiResponse<UserNotificationPreference>>('/notifications/preferences');
    return response.data.data;
  },

  async updatePreferences(prefs: Partial<UserNotificationPreference>): Promise<UserNotificationPreference> {
    const response = await apiClient.put<ApiResponse<UserNotificationPreference>>('/notifications/preferences', prefs);
    return response.data.data;
  },

  // Admin Notification Engine (Phase 5I)
  async getAdminTemplates(params?: { channel?: string; language?: string; template_key?: string }): Promise<NotificationTemplateItem[]> {
    const response = await apiClient.get<ApiResponse<NotificationTemplateItem[]>>('/admin/notifications/templates', { params });
    return response.data.data;
  },

  async updateAdminTemplate(id: number, data: Partial<NotificationTemplateItem>): Promise<NotificationTemplateItem> {
    const response = await apiClient.put<ApiResponse<NotificationTemplateItem>>(`/admin/notifications/templates/${id}`, data);
    return response.data.data;
  },

  async getAdminLogs(params?: { channel?: string; status?: string; event_key?: string; search?: string; page?: number }): Promise<{ data: NotificationLogItem[]; total: number; current_page: number; last_page: number }> {
    const response = await apiClient.get('/admin/notifications/logs', { params });
    return response.data.data;
  },

  async getAdminStats(): Promise<NotificationStats> {
    const response = await apiClient.get<ApiResponse<NotificationStats>>('/admin/notifications/stats');
    return response.data.data;
  },

  async retryFailedLog(id: number): Promise<void> {
    await apiClient.post(`/admin/notifications/logs/${id}/retry`);
  },
};

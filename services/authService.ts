import { apiClient } from './apiClient';
import { ApiResponse, ApiUser } from '../types/api';

export interface LoginPayload {
  email?: string;
  password?: string;
  phone?: string;
  login?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role?: 'customer' | 'seller';
}

export interface AuthResponseData {
  user: ApiUser;
  access_token?: string;
  token?: string;
  token_type?: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: ApiUser; token: string }> {
    const loginCredential = payload.login || payload.email || payload.phone || '';
    const body = {
      login: loginCredential,
      email: payload.email || (loginCredential.includes('@') ? loginCredential : undefined),
      phone: payload.phone || (!loginCredential.includes('@') ? loginCredential : undefined),
      password: payload.password,
    };
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', body);
    const data = response.data.data;
    const token = data.access_token || data.token || '';
    return {
      user: data.user,
      token,
    };
  },

  async register(payload: RegisterPayload): Promise<{ user: ApiUser; token: string }> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', payload);
    const data = response.data.data;
    const token = data.access_token || data.token || '';
    return {
      user: data.user,
      token,
    };
  },

  async getProfile(): Promise<ApiUser> {
    const response = await apiClient.get<ApiResponse<ApiUser>>('/me');
    return response.data.data;
  },

  async updateProfile(payload: Partial<RegisterPayload>): Promise<ApiUser> {
    const response = await apiClient.put<ApiResponse<ApiUser>>('/auth/profile', payload);
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Clear token locally regardless
    }
  },
};

import { apiClient } from './apiClient';
import { ApiResponse, ApiUser } from '../types/api';

export interface LoginPayload {
  email?: string;
  password?: string;
  phone?: string;
  login?: string;
  rememberMe?: boolean;
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
  requires_verification?: boolean;
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
    const response = await apiClient.post<ApiResponse<AuthResponseData> & { requires_verification?: boolean }>('/auth/login', body);
    const data = response.data.data;
    const token = data?.access_token || data?.token || '';
    return {
      user: data?.user,
      token,
    };
  },

  async register(payload: RegisterPayload): Promise<{ user?: ApiUser; token?: string; requires_verification?: boolean; email: string; demo_otp?: string }> {
    const response = await apiClient.post<ApiResponse<{ email: string; otp?: string; user?: ApiUser; access_token?: string }> & { requires_verification?: boolean }>('/auth/register', payload);
    const resData = response.data;
    const data = resData.data;
    return {
      requires_verification: resData.requires_verification ?? true,
      email: payload.email,
      demo_otp: data?.otp,
      user: data?.user,
      token: data?.access_token,
    };
  },

  async verifyEmailOtp(email: string, otp: string): Promise<{ user: ApiUser; token: string }> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/verify-email-otp', { email, otp });
    const data = response.data.data;
    return {
      user: data.user,
      token: data.access_token || data.token || '',
    };
  },

  async forgotPassword(email: string): Promise<{ message: string; demo_otp?: string }> {
    const response = await apiClient.post<ApiResponse<{ email?: string; otp?: string }>>('/auth/forgot-password', { email });
    return {
      message: response.data.message || 'OTP verification code sent to your email.',
      demo_otp: response.data.data?.otp,
    };
  },

  async verifyOtp(email: string, otp: string, type: string = 'password_reset'): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<any>>('/auth/verify-otp', { email, otp, type });
    return response.data.success;
  },

  async resetPassword(payload: { email: string; otp: string; password: string; password_confirmation: string }): Promise<string> {
    const response = await apiClient.post<ApiResponse<any>>('/auth/reset-password', {
      email: payload.email,
      otp: payload.otp,
      token: payload.otp,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
    });
    return response.data.message || 'Your password has been reset successfully.';
  },

  async resendOtp(email: string, type: string = 'email_verification'): Promise<{ message: string; demo_otp?: string }> {
    const response = await apiClient.post<ApiResponse<{ email?: string; otp?: string }>>('/auth/resend-otp', { email, type });
    return {
      message: response.data.message || 'A new verification code has been sent.',
      demo_otp: response.data.data?.otp,
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

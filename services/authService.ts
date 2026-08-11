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

export interface SendMobileOtpPayload {
  mobile: string;
  purpose: 'login' | 'signup';
}

export interface VerifyMobileOtpPayload {
  mobile: string;
  otp: string;
  purpose: 'login' | 'signup';
  req_id?: string;
  name?: string;
  email?: string;
}

export interface AuthResponseData {
  user: ApiUser;
  access_token?: string;
  token?: string;
  token_type?: string;
  requires_verification?: boolean;
}

export interface OtpResponseData {
  success: boolean;
  transaction_id?: string;
  req_id?: string;
  code?: string;
  message: string;
  user?: ApiUser;
  token?: string;
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

  async sendMobileOtp(payload: SendMobileOtpPayload): Promise<OtpResponseData> {
    try {
      const response = await apiClient.post<{ success: boolean; transaction_id?: string; req_id?: string; code?: string; message: string }>('/auth/send-otp', payload);
      return {
        success: response.data.success ?? true,
        transaction_id: response.data.transaction_id || response.data.req_id,
        req_id: response.data.req_id || response.data.transaction_id,
        code: response.data.code,
        message: response.data.message || 'OTP sent successfully',
      };
    } catch (err: any) {
      const errRes = err?.response?.data;
      return {
        success: false,
        code: errRes?.code,
        message: errRes?.message || 'Unable to send OTP right now. Please try again later.',
      };
    }
  },

  async verifyMobileOtp(payload: VerifyMobileOtpPayload): Promise<OtpResponseData> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseData> & { success?: boolean; code?: string; message?: string }>('/auth/verify-otp', payload);
      const resData = response.data;
      const data = resData.data;
      const token = data?.access_token || data?.token || '';

      return {
        success: resData.success ?? true,
        transaction_id: payload.req_id,
        req_id: payload.req_id,
        code: resData.code,
        message: resData.message || 'OTP verified successfully',
        user: data?.user,
        token: token,
      };
    } catch (err: any) {
      const errRes = err?.response?.data;
      return {
        success: false,
        code: errRes?.code,
        message: errRes?.message || 'Incorrect OTP. Please check the OTP and try again.',
      };
    }
  },

  async resendMobileOtp(payload: { mobile: string; purpose?: 'login' | 'signup'; req_id?: string }): Promise<OtpResponseData> {
    try {
      const response = await apiClient.post<{ success: boolean; transaction_id?: string; req_id?: string; code?: string; message: string }>('/auth/resend-otp', payload);
      return {
        success: response.data.success ?? true,
        transaction_id: response.data.transaction_id || response.data.req_id || payload.req_id,
        req_id: response.data.req_id || response.data.transaction_id || payload.req_id,
        code: response.data.code,
        message: response.data.message || 'OTP resent successfully',
      };
    } catch (err: any) {
      const errRes = err?.response?.data;
      return {
        success: false,
        code: errRes?.code,
        message: errRes?.message || 'Unable to resend OTP right now. Please try again later.',
      };
    }
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
    const response = await apiClient.get<ApiResponse<ApiUser>>('/auth/me');
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

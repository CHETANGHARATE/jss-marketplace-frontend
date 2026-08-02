'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiUser } from '../types/api';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLatestProfile = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      if (localStorage.getItem('auth_token')) {
        localStorage.setItem('user_profile', JSON.stringify(userData));
      } else if (sessionStorage.getItem('auth_token')) {
        sessionStorage.setItem('user_profile', JSON.stringify(userData));
      }
      return userData;
    } catch (err: any) {
      const isUnauth =
        err?.response?.status === 401 ||
        err?.status === 401 ||
        err?.message?.includes('401') ||
        err?.message?.includes('Unauthenticated');
      if (isUnauth) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_profile');
        setToken(null);
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_profile') || sessionStorage.getItem('user_profile');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
      fetchLatestProfile().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchLatestProfile]);

  // Sync latest user profile on window focus to immediately capture Admin approval/revocation
  useEffect(() => {
    const onFocus = () => {
      const activeToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (activeToken) {
        fetchLatestProfile();
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchLatestProfile]);

  const login = async (payload: LoginPayload & { rememberMe?: boolean }): Promise<ApiUser> => {
    setIsLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      setUser(data.user);

      const remember = payload.rememberMe !== false;
      if (remember) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('user_profile');
      } else {
        sessionStorage.setItem('auth_token', data.token);
        sessionStorage.setItem('user_profile', JSON.stringify(data.user));
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_profile');
      }

      // Re-fetch latest profile from /api/v1/auth/me to ensure role synchronization
      try {
        const freshUser = await authService.getProfile();
        setUser(freshUser);
        if (remember) {
          localStorage.setItem('user_profile', JSON.stringify(freshUser));
        } else {
          sessionStorage.setItem('user_profile', JSON.stringify(freshUser));
        }
      } catch (e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('jss-login', { detail: data.user }));
      }
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<ApiUser> => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('jss-login', { detail: data.user }));
        }
      }
      return (data.user as ApiUser) || { id: 0, name: payload.name, email: payload.email, role: 'customer' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout().catch(() => {});
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('jss-cart');
      localStorage.removeItem('jss-wishlist');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('recent_searches');
      sessionStorage.clear();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('jss-logout'));
      }

      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchLatestProfile();
  };

  const roleStr = String(user?.role || '').toLowerCase();
  const isSeller = roleStr === 'seller' || roleStr === 'vendor';
  const isAdmin = roleStr === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isSeller,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

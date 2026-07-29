'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiUser } from '../types/api';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user_profile');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {}
      }
      authService
        .getProfile()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('user_profile', JSON.stringify(userData));
        })
        .catch((err: any) => {
          const isUnauth = err?.response?.status === 401 || err?.status === 401 || err?.message?.includes('401') || err?.message?.includes('Unauthenticated');
          if (isUnauth) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_profile');
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (payload: LoginPayload): Promise<ApiUser> => {
    setIsLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_profile', JSON.stringify(data.user));

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
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_profile', JSON.stringify(data.user));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('jss-login', { detail: data.user }));
      }
      return data.user;
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
    const activeToken = token || localStorage.getItem('auth_token');
    if (!activeToken) return;
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      localStorage.setItem('user_profile', JSON.stringify(userData));
    } catch {
      // Handle error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
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

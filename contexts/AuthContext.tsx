'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiUser } from '../types/api';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';
import { cartService } from '../services/cartService';

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  can: (permission?: string | null) => boolean;
  canAny: (permissions: string[]) => boolean;
  login: (payload: LoginPayload) => Promise<ApiUser>;
  register: (payload: RegisterPayload) => Promise<ApiUser>;
  setAuthSession: (user: ApiUser, token: string, rememberMe?: boolean) => Promise<void>;
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

  const setAuthSession = async (userData: ApiUser, userToken: string, rememberMe = true) => {
    setToken(userToken);
    setUser(userData);

    if (rememberMe) {
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('user_profile', JSON.stringify(userData));
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_profile');
    } else {
      sessionStorage.setItem('auth_token', userToken);
      sessionStorage.setItem('user_profile', JSON.stringify(userData));
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_profile');
    }

    // Merge any guest cart items with authenticated account
    try {
      await cartService.mergeCart();
    } catch (e) {
      console.warn('Guest cart merge check complete:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jss-login', { detail: userData }));
    }
  };

  const login = async (payload: LoginPayload & { rememberMe?: boolean }): Promise<ApiUser> => {
    setIsLoading(true);
    try {
      const data = await authService.login(payload);
      await setAuthSession(data.user, data.token, payload.rememberMe !== false);

      try {
        const freshUser = await authService.getProfile();
        setUser(freshUser);
        if (payload.rememberMe !== false) {
          localStorage.setItem('user_profile', JSON.stringify(freshUser));
        } else {
          sessionStorage.setItem('user_profile', JSON.stringify(freshUser));
        }
      } catch (e) {}

      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<ApiUser> => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);
      if (data.token && data.user) {
        await setAuthSession(data.user, data.token, true);
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
      localStorage.removeItem('jss_seller_registration_draft_v2');
      localStorage.removeItem('jss_seller_registration_draft');
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

  const isSuperAdmin = Boolean(
    user?.is_super_admin ||
    user?.roles?.includes('super_admin') ||
    user?.role_slug === 'super_admin' ||
    (user?.id === 1 && user?.role === 'admin')
  );

  const can = useCallback(
    (permission?: string | null): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      if (!permission) return true;
      const perms = user.permissions || [];
      return perms.includes(permission) || perms.includes('*');
    },
    [user, isSuperAdmin]
  );

  const canAny = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      if (!permissions || permissions.length === 0) return true;
      const perms = user.permissions || [];
      if (perms.includes('*')) return true;
      return permissions.some((p) => perms.includes(p));
    },
    [user, isSuperAdmin]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isSeller,
        isAdmin,
        isSuperAdmin,
        can,
        canAny,
        login,
        register,
        setAuthSession,
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

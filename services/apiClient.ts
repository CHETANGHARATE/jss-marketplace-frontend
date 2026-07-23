import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * API Base URL resolution — triple-layer guarantee:
 *  1. NEXT_PUBLIC_API_BASE_URL from Vercel dashboard (baked at build time by Next.js)
 *  2. next.config.ts env block guarantees this is never undefined/empty in production
 *  3. Literal fallback string — the final backstop, always points to production
 *
 * Result: localhost:8000 can NEVER appear in a production bundle.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://api.jsssolutions.in/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});


/**
 * Request Interceptor: Attach bearer token & guest session header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Guest session ID for cart synchronization
      let guestSessionId = localStorage.getItem('guest_session_id');
      if (!guestSessionId) {
        guestSessionId = 'guest_' + Math.random().toString(36).substring(2, 11) + Date.now();
        localStorage.setItem('guest_session_id', guestSessionId);
      }
      if (config.headers) {
        config.headers['X-Session-ID'] = guestSessionId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Normalize API error messages & handle 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject(new Error(message));
  }
);

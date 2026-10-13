/**
 * Centralized Environment Configuration & Validation
 */

export const envConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.jdsmart.in/api/v1',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'JSS Marketplace',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://jdsmart.in',
  appEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Telemetry & Analytics keys
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_ID || '',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

  // Feature Flags
  enableLoyalty: process.env.NEXT_PUBLIC_ENABLE_LOYALTY !== 'false',
  enableReferrals: process.env.NEXT_PUBLIC_ENABLE_REFERRALS !== 'false',
  enableRazorpay: process.env.NEXT_PUBLIC_ENABLE_RAZORPAY !== 'false',
};

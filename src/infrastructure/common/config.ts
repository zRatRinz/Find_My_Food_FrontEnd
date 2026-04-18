export const APP_CONFIG = {
  /**
   * API Configuration
   */
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 10000, // 10 seconds
  },

  /**
   * Authentication Configuration
   */
  auth: {
    tokenKey: 'auth_token',
    userKey: 'user_info',
    redirectToLogin: '/login',
  },

  /**
   * Application Metadata
   */
  app: {
    name: 'Find My Food',
    description: 'Savor the Art of Taste - Discover luxury recipes',
    version: '1.0.0',
  },

  /**
   * UI/UX Constants
   */
  ui: {
    paginationLimit: 12,
    defaultTheme: 'system',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

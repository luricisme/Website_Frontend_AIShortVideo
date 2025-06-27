/**
 * Authentication-related routes
 */
export const AUTH_ROUTES = {
    LOGIN: "/user/signin",
    REGISTER: "/user/signup",
    LOGOUT: "/api/auth/signout",
    CALLBACK: "/api/auth/callback",
    GOOGLE_CALLBACK: "/api/auth/google-callback",
    DASHBOARD: "/dashboard",
} as const;

/**
 * Backend authentication endpoints
 */
export const AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    GOOGLE_VERIFY: "/auth/google-verify",
    GOOGLE_LOGIN: "/auth/google",
    REFRESH_TOKEN: "/auth/refresh-token",
    REGISTER: "/auth/register",
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
    AUTH_ROUTES.LOGIN,
    AUTH_ROUTES.REGISTER,
    "/api/auth",
    AUTH_ROUTES.GOOGLE_CALLBACK,
] as const;

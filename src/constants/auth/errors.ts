import { AuthErrorType } from "@/types/auth/errors";

/**
 * Authentication error codes
 */
export const AUTH_ERROR_CODES = {
    INVALID_CREDENTIALS: "auth/invalid-credentials",
    EXPIRED_TOKEN: "auth/expired-token",
    REFRESH_ERROR: "auth/refresh-error",
    NETWORK_ERROR: "auth/network-error",
    SERVER_ERROR: "auth/server-error",
    MISSING_CREDENTIALS: "auth/missing-credentials",
    GOOGLE_AUTH_ERROR: "auth/google-error",
} as const;

/**
 * User-friendly error messages
 */
export const AUTH_ERROR_MESSAGES = {
    [AuthErrorType.INVALID_CREDENTIALS]: "Invalid email or password",
    [AuthErrorType.EXPIRED_TOKEN]: "Your session has expired, please log in again",
    [AuthErrorType.REFRESH_ERROR]: "Unable to refresh your session, please log in again",
    [AuthErrorType.NETWORK_ERROR]: "Network error, please check your connection and try again",
    [AuthErrorType.SERVER_ERROR]: "Server error, please try again later",
    [AuthErrorType.MISSING_CREDENTIALS]: "Please enter all required login information",
    [AuthErrorType.GOOGLE_AUTH_ERROR]: "Google authentication error, please try again",
} as const;

/**
 * Mapping from NextAuth error codes to AuthErrorType
 */
export const NEXTAUTH_ERROR_MAP: Record<string, AuthErrorType> = {
    CredentialsSignin: AuthErrorType.INVALID_CREDENTIALS,
    SessionRequired: AuthErrorType.EXPIRED_TOKEN,
    RefreshAccessTokenError: AuthErrorType.REFRESH_ERROR,
} as const;

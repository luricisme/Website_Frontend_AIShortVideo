/**
 * Authentication error types
 */
export enum AuthErrorType {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    EXPIRED_TOKEN = "EXPIRED_TOKEN",
    REFRESH_ERROR = "REFRESH_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    MISSING_CREDENTIALS = "MISSING_CREDENTIALS",
    GOOGLE_AUTH_ERROR = "GOOGLE_AUTH_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
}

/**
 * Authentication error interface
 */
export interface AuthError {
    type: AuthErrorType;
    code: string;
    message: string;
    status?: number;
    details?: Record<string, unknown>;
}

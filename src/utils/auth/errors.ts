import { AuthError, AuthErrorType } from "@/types/auth/errors";
import { AUTH_ERROR_MESSAGES, NEXTAUTH_ERROR_MAP } from "@/constants/auth/errors";

/**
 * Create AuthError from error information
 */
export function createAuthError(
    type: AuthErrorType,
    code: string,
    message?: string,
    status?: number,
    details?: Record<string, unknown>
): AuthError {
    return {
        type,
        code,
        message: message || AUTH_ERROR_MESSAGES[type as keyof typeof AUTH_ERROR_MESSAGES],
        status,
        details,
    };
}

/**
 * Parse NextAuth error code to AuthError
 */
export function parseNextAuthError(errorCode: string): AuthError | null {
    if (!errorCode) return null;

    const errorType = NEXTAUTH_ERROR_MAP[errorCode] || AuthErrorType.SERVER_ERROR;

    return createAuthError(
        errorType,
        errorCode,
        AUTH_ERROR_MESSAGES[errorType as keyof typeof AUTH_ERROR_MESSAGES]
    );
}

/**
 * Create error from API response
 */
export function createErrorFromResponse(
    response: Response,
    data: { message?: string } | Record<string, unknown>
): AuthError {
    let type: AuthErrorType;

    switch (response.status) {
        case 401:
            type = AuthErrorType.INVALID_CREDENTIALS;
            break;
        case 403:
            type = AuthErrorType.EXPIRED_TOKEN;
            break;
        case 500:
            type = AuthErrorType.SERVER_ERROR;
            break;
        default:
            type = AuthErrorType.SERVER_ERROR;
    }

    const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as Record<string, unknown>).message === "string"
            ? ((data as Record<string, unknown>).message as string)
            : AUTH_ERROR_MESSAGES[type];

    return createAuthError(type, `server/${response.status}`, message, response.status, data);
}

import { useSearchParams } from "next/navigation";
import { AuthErrorType } from "@/types/auth/errors";
import { parseNextAuthError } from "@/utils/auth/errors";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth/errors";

interface AuthErrorResult {
    message: string;
    code: string;
    type: AuthErrorType;
}

export function useAuthError(): AuthErrorResult | null {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    // No error
    if (!errorParam) return null;

    // Parse standard NextAuth error
    const nextAuthError = parseNextAuthError(errorParam);
    if (nextAuthError) {
        return {
            message: nextAuthError.message,
            code: nextAuthError.code,
            type: nextAuthError.type,
        };
    }

    // Handle other errors
    if (errorParam === "session_expired") {
        return {
            message: AUTH_ERROR_MESSAGES[AuthErrorType.EXPIRED_TOKEN],
            code: "session_expired",
            type: AuthErrorType.EXPIRED_TOKEN,
        };
    }

    // Try to parse error from JSON
    try {
        const errorString = decodeURIComponent(errorParam);
        const parsedError = JSON.parse(errorString);

        if (parsedError && parsedError.message && parsedError.type) {
            return {
                message: parsedError.message,
                code: parsedError.code,
                type: parsedError.type,
            };
        }
    } catch (e) {
        // Not JSON, ignore
        console.error("Failed to parse error from search params:", e);
    }

    // Unknown error
    return {
        message: "An unknown error occurred",
        code: "unknown_error",
        type: AuthErrorType.SERVER_ERROR,
    };
}

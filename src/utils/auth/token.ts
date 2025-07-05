import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/schemas/auth/responses";

/**
 * Get token expiration time from JWT
 */
export function getTokenExpiration(token: string): number {
    try {
        const decoded = jwtDecode<JWTPayload>(token);
        // JWT exp is in seconds, convert to milliseconds
        return decoded.exp * 1000;
    } catch (error) {
        console.error("Failed to decode token:", error);
        // Fallback: assume token is valid for 1 hour from now
        return Date.now() + 3600 * 1000;
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiryTime: number): boolean {
    return Date.now() >= expiryTime;
}

/**
 * Extract information from token
 */
export function extractTokenInfo(token: string): Partial<JWTPayload> {
    try {
        return jwtDecode<JWTPayload>(token);
    } catch (error) {
        console.error("Failed to extract token info:", error);
        return {};
    }
}

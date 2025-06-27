import { getSession, signOut } from "next-auth/react";
import { HttpError, HttpErrorType } from "../errors/HttpError";
import { validateResponse } from "./responseValidator";
import { z } from "zod";
import { envPublic } from "@/constants/env.public";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const baseUrl = envPublic.NEXT_PUBLIC_API_URL || "";

    try {
        // Get current session
        const session = await getSession();

        if (!session?.accessToken) {
            throw HttpError.fromAuthError("No access token available");
        }

        // Check for refresh token error
        if (session.error === "RefreshAccessTokenError") {
            await signOut({ redirect: true, callbackUrl: "/user/signin?error=session_expired" });
            throw HttpError.fromAuthError("Session expired");
        }

        // Create headers with token
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
            ...options.headers,
        };

        // Call API
        let response: Response;
        try {
            response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers,
            });
        } catch (error) {
            // Handle network errors
            throw HttpError.fromNetworkError(
                error instanceof Error ? error : new Error(String(error))
            );
        }

        // Handle token expiration
        if (response.status === 401) {
            // Try to get a new session (may have been refreshed)
            const newSession = await getSession();

            // If still refresh error or no new session
            if (newSession?.error === "RefreshAccessTokenError" || !newSession?.accessToken) {
                await signOut({
                    redirect: true,
                    callbackUrl: "/user/signin?error=session_expired",
                });
                throw HttpError.fromAuthError();
            }

            // Retry request with new token
            const newHeaders = {
                ...headers,
                Authorization: `Bearer ${newSession.accessToken}`,
            };

            try {
                return await fetch(`${baseUrl}${endpoint}`, {
                    ...options,
                    headers: newHeaders,
                });
            } catch (error) {
                throw HttpError.fromNetworkError(
                    error instanceof Error ? error : new Error(String(error))
                );
            }
        }

        return response;
    } catch (error) {
        // Handle high-level errors
        if (error instanceof HttpError) {
            // Already an HttpError, rethrow
            throw error;
        } else {
            // Not an HttpError, wrap it
            console.error("API error:", error);
            throw new HttpError(
                HttpErrorType.UNKNOWN,
                error instanceof Error ? error.message : "Unknown error",
                0,
                [],
                error
            );
        }
    }
}

const http = {
    async get<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        try {
            const response = await apiClient(endpoint, { method: "GET", ...options });
            return validateResponse<T>(response, schema);
        } catch (error) {
            console.error("GET request failed:", error);
            throw error; // Already converted to HttpError above
        }
    },

    async post<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const response = await apiClient(endpoint, {
                method: "POST",
                body: JSON.stringify(validatedBody),
                ...options,
            });
            return validateResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    },

    async put<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const response = await apiClient(endpoint, {
                method: "PUT",
                body: JSON.stringify(validatedBody),
                ...options,
            });
            return validateResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    },

    async delete<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        try {
            const response = await apiClient(endpoint, { method: "DELETE", ...options });
            return validateResponse<T>(response, schema);
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    },

    async patch<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const response = await apiClient(endpoint, {
                method: "PATCH",
                body: JSON.stringify(validatedBody),
                ...options,
            });
            return validateResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("PATCH request failed:", error);
            throw error;
        }
    },
};

export default http;

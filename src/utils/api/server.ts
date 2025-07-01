import { cookies } from "next/headers";
import { HttpError, HttpErrorType } from "../errors/HttpError";
import { validateResponse } from "./responseValidator";
import { z } from "zod";
import { envServer } from "@/constants/env.server";

// Base configuration
const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
} as const;

const DEFAULT_OPTIONS: RequestInit = {
    cache: "no-store",
} as const;

// Common token getter (returns null if no token)
async function getAuthToken(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("next-auth.session-token")?.value;
        return token || null;
    } catch (error) {
        console.error("Failed to get auth token from cookies:", error);
        // In some contexts (like middleware), cookies might not be available
        return null;
    }
}

// Required token getter (throws error if no token)
async function getRequiredAuthToken(): Promise<string> {
    const token = await getAuthToken();

    if (!token) {
        throw new HttpError(
            HttpErrorType.UNAUTHORIZED,
            "Authentication required - please sign in",
            401
        );
    }

    return token;
}

// Base request function
async function makeRequest<T>(
    method: string,
    endpoint: string,
    schema?: z.ZodType<T>,
    options: {
        body?: unknown;
        requestSchema?: z.ZodType<unknown>;
        token?: string | null;
        requireAuth?: boolean;
        requestOptions?: RequestInit;
    } = {}
): Promise<T> {
    const baseUrl = envServer.BACKEND_URL || "";
    const { body, requestSchema, token, requireAuth = true, requestOptions = {} } = options;

    try {
        // Validate request body if schema provided
        let validatedBody = body;
        if (requestSchema && body !== undefined) {
            validatedBody = requestSchema.parse(body);
        }

        // Handle authentication
        let authToken: string | null = null;
        if (token !== undefined) {
            // Explicit token provided (including null for no auth)
            authToken = token;
        } else if (requireAuth) {
            // Auth required, get token from cookies
            authToken = await getRequiredAuthToken();
        } else {
            // Auth optional, try to get token from cookies
            authToken = await getAuthToken();
        }

        console.log(">>> authToken:", authToken);

        // Build headers
        let normalizedHeaders: Record<string, string> = { ...DEFAULT_HEADERS };
        if (requestOptions.headers) {
            if (requestOptions.headers instanceof Headers) {
                requestOptions.headers.forEach((value, key) => {
                    normalizedHeaders[key] = value;
                });
            } else if (Array.isArray(requestOptions.headers)) {
                requestOptions.headers.forEach(([key, value]) => {
                    normalizedHeaders[key] = value;
                });
            } else {
                normalizedHeaders = { ...normalizedHeaders, ...requestOptions.headers };
            }
        }
        const headers: Record<string, string> = normalizedHeaders;

        // Add auth header if token exists
        if (authToken) {
            // headers.Authorization = `Bearer ${authToken}`;
        }

        const fetchOptions: RequestInit = {
            ...DEFAULT_OPTIONS,
            ...requestOptions,
            method,
            headers,
        };

        // Add body for methods that support it
        if (body !== undefined && ["POST", "PUT", "PATCH"].includes(method)) {
            fetchOptions.body = JSON.stringify(validatedBody);
        }

        console.log(">>> url:", `${baseUrl}${endpoint}`);
        console.log(">>> options:", fetchOptions);

        const response = await fetch(`${baseUrl}${endpoint}`, fetchOptions);

        return await validateResponse(response, schema);
    } catch (error) {
        console.error(`${method} request failed: ${endpoint}`, error);

        if (error instanceof z.ZodError) {
            throw new HttpError(
                HttpErrorType.VALIDATION,
                "Invalid request data",
                400,
                error.errors.map((e) => ({
                    message: e.message,
                    field: e.path.join("."),
                }))
            );
        }

        if (error instanceof HttpError) {
            throw error;
        }

        throw new HttpError(
            HttpErrorType.UNKNOWN,
            error instanceof Error ? error.message : "Unknown error",
            500,
            [],
            error
        );
    }
}

// Server HTTP client (for Server Components & Server Actions)
export const serverHttp = {
    // 🔒 Authenticated requests (default behavior)
    async get<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        return makeRequest("GET", endpoint, schema, {
            requireAuth: true,
            requestOptions: options,
        });
    },

    async post<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("POST", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: true,
            requestOptions: options,
        });
    },

    async put<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PUT", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: true,
            requestOptions: options,
        });
    },

    async patch<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PATCH", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: true,
            requestOptions: options,
        });
    },

    async delete<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        return makeRequest("DELETE", endpoint, schema, {
            requireAuth: true,
            requestOptions: options,
        });
    },

    // 🌐 Public requests (no authentication required)
    async getPublic<T>(
        endpoint: string,
        schema?: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("GET", endpoint, schema, {
            requireAuth: false,
            requestOptions: options,
        });
    },

    async postPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("POST", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: false,
            requestOptions: options,
        });
    },

    async putPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PUT", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: false,
            requestOptions: options,
        });
    },

    async patchPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PATCH", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: false,
            requestOptions: options,
        });
    },

    async deletePublic<T>(
        endpoint: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("DELETE", endpoint, schema, {
            requireAuth: false,
            requestOptions: options,
        });
    },

    // 🔓 Optional auth requests (send token if available)
    async getOptionalAuth<T>(
        endpoint: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("GET", endpoint, schema, {
            requireAuth: false, // Will still send token if available
            requestOptions: options,
        });
    },

    async postOptionalAuth<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("POST", endpoint, responseSchema, {
            body,
            requestSchema,
            requireAuth: false,
            requestOptions: options,
        });
    },
} as const;

// API Routes HTTP client (with explicit token)
export const serverApiHttp = {
    // 🔒 With authentication
    async getWithAuth<T>(
        endpoint: string,
        token: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("GET", endpoint, schema, {
            token,
            requestOptions: options,
        });
    },

    async postWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("POST", endpoint, responseSchema, {
            body,
            token,
            requestSchema,
            requestOptions: options,
        });
    },

    async putWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PUT", endpoint, responseSchema, {
            body,
            token,
            requestSchema,
            requestOptions: options,
        });
    },

    async patchWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PATCH", endpoint, responseSchema, {
            body,
            token,
            requestSchema,
            requestOptions: options,
        });
    },

    async deleteWithAuth<T>(
        endpoint: string,
        token: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("DELETE", endpoint, schema, {
            token,
            requestOptions: options,
        });
    },

    // 🌐 Without authentication (public endpoints)
    async getPublic<T>(
        endpoint: string,
        schema?: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("GET", endpoint, schema, {
            token: null, // Explicitly no auth
            requestOptions: options,
        });
    },

    async postPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("POST", endpoint, responseSchema, {
            body,
            token: null, // Explicitly no auth
            requestSchema,
            requestOptions: options,
        });
    },

    async putPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PUT", endpoint, responseSchema, {
            body,
            token: null,
            requestSchema,
            requestOptions: options,
        });
    },

    async patchPublic<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        return makeRequest("PATCH", endpoint, responseSchema, {
            body,
            token: null,
            requestSchema,
            requestOptions: options,
        });
    },

    async deletePublic<T>(
        endpoint: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        return makeRequest("DELETE", endpoint, schema, {
            token: null,
            requestOptions: options,
        });
    },
} as const;

// Export types for better TypeScript support
export type ServerHttpClient = typeof serverHttp;
export type ServerApiHttpClient = typeof serverApiHttp;

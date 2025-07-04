import { getSession, signOut } from "next-auth/react";
import { HttpError, HttpErrorType } from "../errors/HttpError";
import { validateResponse } from "./responseValidator";
import { z } from "zod";
import { envPublic } from "@/constants/env.public";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

interface ApiClientOptions {
    method?: string;
    body?: JsonValue | FormData;
    headers?: Record<string, string>;
    requireAuth?: boolean;
    customOptions?: RequestInit;
}

interface HttpRequestOptions<Req extends JsonValue | FormData, Res> {
    body?: Req;
    responseSchema?: z.ZodType<Res>;
    requestSchema?: z.ZodType<Req>;
    requireAuth?: boolean;
    headers?: Record<string, string>;
    fetchOptions?: Omit<RequestInit, "method" | "body" | "headers">;
}

export async function apiClient(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<Response> {
    const {
        method = "GET",
        body,
        headers: customHeaders = {},
        requireAuth = true,
        customOptions = {},
    } = options;

    const baseUrl = envPublic.NEXT_PUBLIC_API_URL || "";

    try {
        // Khởi tạo headers mặc định
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...customHeaders,
        };

        // console.log(">>> API Request:");
        // Thêm Authorization nếu endpoint yêu cầu xác thực
        if (requireAuth) {
            // Lấy phiên hiện tại
            const session = await getSession();
            // console.log(">>> Current session:", session);

            if (!session?.accessToken) {
                throw HttpError.fromAuthError("No access token available");
            }

            // Kiểm tra lỗi refresh token
            if (session.error === "RefreshAccessTokenError") {
                await signOut({
                    redirect: true,
                    callbackUrl: "/user/signin?error=session_expired",
                });
                throw HttpError.fromAuthError("Session expired");
            }

            // Thêm token vào headers
            // console.log(">>> Using access token:", session.accessToken);
            headers.Authorization = `Bearer ${session.accessToken}`;
        }

        // Chuẩn bị request config
        const requestConfig: RequestInit = {
            method,
            headers,
            ...customOptions,
        };

        // Thêm body nếu có
        if (body !== undefined) {
            requestConfig.body = JSON.stringify(body);
        }

        // Gọi API
        let response: Response;
        try {
            // console.log(">>> Fetching:", `${baseUrl}${endpoint}`)
            response = await fetch(`${baseUrl}${endpoint}`, requestConfig);
        } catch (error) {
            // Xử lý lỗi mạng
            throw HttpError.fromNetworkError(
                error instanceof Error ? error : new Error(String(error))
            );
        }

        // Xử lý token hết hạn (chỉ khi endpoint yêu cầu xác thực)
        if (requireAuth && response.status === 401) {
            // Thử lấy phiên mới (có thể đã được refresh)
            const newSession = await getSession();

            // Nếu vẫn lỗi refresh hoặc không có phiên mới
            if (newSession?.error === "RefreshAccessTokenError" || !newSession?.accessToken) {
                await signOut({
                    redirect: true,
                    callbackUrl: "/user/signin?error=session_expired",
                });
                throw HttpError.fromAuthError("Session expired");
            }

            // Thử lại request với token mới
            headers.Authorization = `Bearer ${newSession.accessToken}`;
            requestConfig.headers = headers;

            try {
                return await fetch(`${baseUrl}${endpoint}`, requestConfig);
            } catch (error) {
                throw HttpError.fromNetworkError(
                    error instanceof Error ? error : new Error(String(error))
                );
            }
        }

        return response;
    } catch (error) {
        // Xử lý lỗi tổng quát
        if (error instanceof HttpError) {
            // Đã là HttpError, throw lại
            throw error;
        } else {
            // Chưa là HttpError, wrap lại
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

// Hàm helper để xử lý response
async function handleResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
    if (schema) {
        return validateResponse<T>(response, schema);
    }

    // Nếu không có schema, kiểm tra status trước khi parse JSON
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw HttpError.fromResponse(response, errorData);
    }

    const data = await response.json();
    return data as T;
}

// Thêm metadata header tự động nếu cần
function addMetadataHeaders(headers: Record<string, string> = {}): Record<string, string> {
    // const now = new Date().toISOString();
    return {
        ...headers,
        // Thêm các headers metadata nếu cần
        // "X-Request-Timestamp": now,
        // "X-User": "HLeNam",
    };
}

const http = {
    async get<Res>(
        endpoint: string,
        options: Omit<HttpRequestOptions<never, Res>, "body" | "requestSchema"> = {}
    ): Promise<Res> {
        try {
            const { responseSchema, requireAuth = true, headers = {}, fetchOptions = {} } = options;

            const response = await apiClient(endpoint, {
                method: "GET",
                headers: addMetadataHeaders(headers),
                requireAuth,
                customOptions: fetchOptions,
            });

            return handleResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("GET request failed:", error);
            throw error;
        }
    },

    async post<Req extends JsonValue | FormData, Res>(
        endpoint: string,
        options: HttpRequestOptions<Req, Res> = {}
    ): Promise<Res> {
        try {
            const {
                body,
                responseSchema,
                requestSchema,
                requireAuth = true,
                headers = {},
                fetchOptions = {},
            } = options;

            // Validate request body nếu có schema
            let validatedBody: Req | undefined = body;
            if (body !== undefined && requestSchema) {
                validatedBody = requestSchema.parse(body) as Req;
            }

            const response = await apiClient(endpoint, {
                method: "POST",
                body: validatedBody,
                headers: addMetadataHeaders(headers),
                requireAuth,
                customOptions: fetchOptions,
            });

            return handleResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("POST request failed:", error);
            throw error;
        }
    },

    async put<Req extends JsonValue, Res>(
        endpoint: string,
        options: HttpRequestOptions<Req, Res> = {}
    ): Promise<Res> {
        try {
            const {
                body,
                responseSchema,
                requestSchema,
                requireAuth = true,
                headers = {},
                fetchOptions = {},
            } = options;

            // Validate request body nếu có schema
            let validatedBody: Req | undefined = body;
            if (body !== undefined && requestSchema) {
                validatedBody = requestSchema.parse(body) as Req;
            }

            const response = await apiClient(endpoint, {
                method: "PUT",
                body: validatedBody,
                headers: addMetadataHeaders(headers),
                requireAuth,
                customOptions: fetchOptions,
            });

            return handleResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("PUT request failed:", error);
            throw error;
        }
    },

    async delete<Res>(
        endpoint: string,
        options: Omit<HttpRequestOptions<never, Res>, "body" | "requestSchema"> = {}
    ): Promise<Res> {
        try {
            const { responseSchema, requireAuth = true, headers = {}, fetchOptions = {} } = options;

            const response = await apiClient(endpoint, {
                method: "DELETE",
                headers: addMetadataHeaders(headers),
                requireAuth,
                customOptions: fetchOptions,
            });

            return handleResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("DELETE request failed:", error);
            throw error;
        }
    },

    async patch<Req extends JsonValue, Res>(
        endpoint: string,
        options: HttpRequestOptions<Req, Res> = {}
    ): Promise<Res> {
        try {
            const {
                body,
                responseSchema,
                requestSchema,
                requireAuth = true,
                headers = {},
                fetchOptions = {},
            } = options;

            // Validate request body nếu có schema
            let validatedBody: Req | undefined = body;
            if (body !== undefined && requestSchema) {
                validatedBody = requestSchema.parse(body) as Req;
            }

            const response = await apiClient(endpoint, {
                method: "PATCH",
                body: validatedBody,
                headers: addMetadataHeaders(headers),
                requireAuth,
                customOptions: fetchOptions,
            });

            return handleResponse<Res>(response, responseSchema);
        } catch (error) {
            console.error("PATCH request failed:", error);
            throw error;
        }
    },
};

export default http;

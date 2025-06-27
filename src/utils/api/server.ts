import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HttpError, HttpErrorType } from "../errors/HttpError";
import { validateResponse } from "./responseValidator";
import { z } from "zod";
import { envServer } from "@/constants/env.server";

// Server API client
export const serverHttp = {
    async get<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            // Get token from cookies
            const cookieStore = await cookies();
            const token = cookieStore.get("next-auth.session-token")?.value;

            if (!token) {
                // No token, redirect to login page
                redirect("/user/signin");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers,
                cache: options.cache || "no-store",
                next: options.next,
            });

            // Validate and parse response with schema
            return await validateResponse(response, schema);
        } catch (error) {
            console.error(`Server GET request failed: ${endpoint}`, error);

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
    },

    async post<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const cookieStore = await cookies();
            const token = cookieStore.get("next-auth.session-token")?.value;

            if (!token) {
                redirect("/user/signin");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            // Validate and parse response with schema
            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`Server POST request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                // Request validation error
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },

    // Similarly for PUT, DELETE, PATCH methods
    async put<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const cookieStore = await cookies();
            const token = cookieStore.get("next-auth.session-token")?.value;

            if (!token) {
                redirect("/user/signin");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PUT",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`Server PUT request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },

    async delete<T>(endpoint: string, schema: z.ZodType<T>, options: RequestInit = {}): Promise<T> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("next-auth.session-token")?.value;

            if (!token) {
                redirect("/user/signin");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "DELETE",
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, schema);
        } catch (error) {
            console.error(`Server DELETE request failed: ${endpoint}`, error);

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
    },

    async patch<Req, Res>(
        endpoint: string,
        body: Req,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            // Validate request body if schema provided
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const cookieStore = await cookies();
            const token = cookieStore.get("next-auth.session-token")?.value;

            if (!token) {
                redirect("/user/signin");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PATCH",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`Server PATCH request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },
};

// Special method for use in Route Handlers (API Routes)
export const serverApiHttp = {
    async getWithAuth<T>(
        endpoint: string,
        token: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, schema);
        } catch (error) {
            console.error(`API GET request failed: ${endpoint}`, error);

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
    },

    // Similarly implement other methods (POST, PUT, DELETE, PATCH)
    async postWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`API POST request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },

    async putWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PUT",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`API PUT request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },

    async deleteWithAuth<T>(
        endpoint: string,
        token: string,
        schema: z.ZodType<T>,
        options: RequestInit = {}
    ): Promise<T> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "DELETE",
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, schema);
        } catch (error) {
            console.error(`API DELETE request failed: ${endpoint}`, error);

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
    },

    async patchWithAuth<Req, Res>(
        endpoint: string,
        body: Req,
        token: string,
        responseSchema: z.ZodType<Res>,
        requestSchema?: z.ZodType<Req>,
        options: RequestInit = {}
    ): Promise<Res> {
        const baseUrl = envServer.BACKEND_URL || "";

        try {
            let validatedBody = body;
            if (requestSchema) {
                validatedBody = requestSchema.parse(body);
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };

            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: "PATCH",
                body: JSON.stringify(validatedBody),
                ...options,
                headers,
                cache: "no-store",
            });

            return await validateResponse(response, responseSchema);
        } catch (error) {
            console.error(`API PATCH request failed: ${endpoint}`, error);

            if (error instanceof z.ZodError) {
                throw new HttpError(
                    HttpErrorType.VALIDATION,
                    "Invalid request data",
                    400,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
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
    },
};

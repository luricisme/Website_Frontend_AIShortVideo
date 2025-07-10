import { envPublic } from "@/constants/env.public";
import { getSession, signOut } from "next-auth/react";

export async function apiClient(endpoint: string, options: RequestInit = {}) {
    const baseUrl = envPublic.NEXT_PUBLIC_API_URL || "";

    try {
        // Lấy session hiện tại
        const session = await getSession();

        if (!session?.accessToken) {
            throw new Error("Không có access token");
        }

        // Kiểm tra lỗi refresh token
        if (session.error === "RefreshAccessTokenError") {
            await signOut({ redirect: true, callbackUrl: "/login?error=session_expired" });
            throw new Error("Phiên đăng nhập hết hạn");
        }

        // Tạo headers với token
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
            ...options.headers,
        };

        // Gọi API
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        // Xử lý token hết hạn
        if (response.status === 401) {
            // Thử lấy session mới (có thể đã được refresh)
            const newSession = await getSession();

            // Nếu vẫn bị lỗi refresh hoặc không có session mới
            if (newSession?.error === "RefreshAccessTokenError" || !newSession?.accessToken) {
                await signOut({ redirect: true, callbackUrl: "/login?error=session_expired" });
                throw new Error("Phiên đăng nhập hết hạn");
            }

            // Thử lại request với token mới
            const newHeaders = {
                ...headers,
                Authorization: `Bearer ${newSession.accessToken}`,
            };

            return fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers: newHeaders,
            });
        }

        return response;
    } catch (error) {
        console.error("API error:", error);
        throw error;
    }
}

const http = {
    get<Response>(endpoint: string, options: RequestInit = {}): Promise<Response> {
        return apiClient(endpoint, { method: "GET", ...options })
            .then((res) => res.json())
            .catch((error) => {
                console.error("GET request failed:", error);
                throw error;
            });
    },

    post<Request, Response>(
        endpoint: string,
        body: Request,
        options: RequestInit = {}
    ): Promise<Response> {
        return apiClient(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
            ...options,
        })
            .then((res) => res.json())
            .catch((error) => {
                console.error("POST request failed:", error);
                throw error;
            });
    },

    put<Request, Response>(
        endpoint: string,
        body: Request,
        options: RequestInit = {}
    ): Promise<Response> {
        return apiClient(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
            ...options,
        })
            .then((res) => res.json())
            .catch((error) => {
                console.error("PUT request failed:", error);
                throw error;
            });
    },

    delete<Response>(endpoint: string, options: RequestInit = {}): Promise<Response> {
        return apiClient(endpoint, { method: "DELETE", ...options })
            .then((res) => res.json())
            .catch((error) => {
                console.error("DELETE request failed:", error);
                throw error;
            });
    },
};

export default http;

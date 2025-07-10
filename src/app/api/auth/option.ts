import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

import { authResponseSchema, refreshTokenResponseSchema } from "@/schemas/auth/responses";
import { loginRequestSchema } from "@/schemas/auth/requests";
import { AUTH_ENDPOINTS, AUTH_ERROR_CODES } from "@/constants";
import { AuthErrorType } from "@/types/auth/errors";
import { ZodError } from "zod";
import { createAuthError, createErrorFromResponse } from "@/utils/auth/errors";
import { getTokenExpiration } from "@/utils/auth/token";
import { envServer } from "@/constants/env.server";

async function refreshAccessToken(token: JWT): Promise<JWT> {
    // Nếu không có refresh token, đánh dấu lỗi và yêu cầu đăng nhập lại
    if (!token.refreshToken) {
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }

    try {
        const response = await fetch(`${envServer.BACKEND_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw createErrorFromResponse(response, errorData);
        }

        const rawData = await response.json();
        const refreshedTokens = refreshTokenResponseSchema.parse(rawData);

        let newAccessToken = "";
        let newRefreshToken = token.refreshToken;

        if (refreshedTokens.data?.jwt) {
            newAccessToken = refreshedTokens.data.jwt;
            if (refreshedTokens.data.refreshToken) {
                newRefreshToken = refreshedTokens.data.refreshToken;
            }
        }

        const newExpiration = getTokenExpiration(newAccessToken);

        return {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenExpires: newExpiration,
        };
    } catch (error) {
        console.error("Error refreshing token:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // Validate credentials với schema
                    const validatedCredentials = loginRequestSchema.parse({
                        username: credentials?.email,
                        password: credentials?.password,
                    });

                    const body = {
                        username: validatedCredentials.username,
                        password: validatedCredentials.password,
                    };

                    const response = await fetch(
                        `${envServer.BACKEND_URL}${AUTH_ENDPOINTS.LOGIN}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        }
                    );

                    const rawData = await response.json();

                    // Validate response với schema
                    if (response.ok && rawData.status >= 200 && rawData.status < 300) {
                        try {
                            const data = authResponseSchema.parse(rawData);

                            const accessToken = data.data.jwt;
                            const tokenExpiration = getTokenExpiration(accessToken);

                            return {
                                id: data.data.id,
                                name: data.data.username,
                                email: data.data.username,
                                role: data.data.role,
                                accessToken: accessToken,
                                accessTokenExpires: tokenExpiration,
                            };
                        } catch (error) {
                            if (error instanceof ZodError) {
                                console.error("Invalid API response format:", error.errors);
                                throw new Error(
                                    JSON.stringify(
                                        createAuthError(
                                            AuthErrorType.SERVER_ERROR,
                                            AUTH_ERROR_CODES.SERVER_ERROR,
                                            "Server data format error"
                                        )
                                    )
                                );
                            }

                            throw error;
                        }
                    } else {
                        // Tạo lỗi từ response API và lưu vào biến
                        const apiError = createErrorFromResponse(response, rawData);
                        // Throw Error với JSON stringified của apiError
                        throw new Error(JSON.stringify(apiError));
                    }
                } catch (error) {
                    // Khai báo biến để theo dõi trạng thái xử lý lỗi
                    let errorHandled = false;
                    let errorToThrow: Error = new Error(
                        JSON.stringify(
                            createAuthError(
                                AuthErrorType.SERVER_ERROR,
                                AUTH_ERROR_CODES.SERVER_ERROR,
                                "An unexpected error occurred"
                            )
                        )
                    );

                    if (error instanceof ZodError) {
                        // Xử lý lỗi validation từ schema
                        const fieldErrors = error.errors
                            .map((err) => `${err.path.join(".")}: ${err.message}`)
                            .join(", ");

                        errorToThrow = new Error(
                            JSON.stringify(
                                createAuthError(
                                    AuthErrorType.VALIDATION_ERROR,
                                    AUTH_ERROR_CODES.MISSING_CREDENTIALS,
                                    `Invalid data: ${fieldErrors}`
                                )
                            )
                        );
                        errorHandled = true;
                    } else if (error instanceof Error && error.message) {
                        try {
                            // Thử parse message để kiểm tra xem đã là AuthError chưa
                            const parsedError = JSON.parse(error.message);
                            if (
                                parsedError.type &&
                                parsedError.code &&
                                typeof parsedError.message === "string"
                            ) {
                                // Đã là AuthError, sử dụng lỗi này
                                console.error(">>> Using existing AuthError:", parsedError);
                                errorToThrow = error;
                                errorHandled = true;
                            }
                        } catch (parseError) {
                            // Không phải JSON, bỏ qua
                            console.error("Error parsing AuthError:", parseError);
                        }
                    }

                    // Nếu chưa xử lý lỗi, tạo lỗi server mặc định
                    if (!errorHandled) {
                        console.error(">>> Unhandled auth error:", error);
                        errorToThrow = new Error(
                            JSON.stringify(
                                createAuthError(
                                    AuthErrorType.SERVER_ERROR,
                                    AUTH_ERROR_CODES.SERVER_ERROR,
                                    "An unexpected error occurred"
                                )
                            )
                        );
                    }

                    // Throw lỗi đã được xử lý
                    throw errorToThrow;
                }
            },
        }),

        CredentialsProvider({
            id: "google-oauth",
            name: "Google OAuth",
            credentials: {
                code: { label: "Authorization Code", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.code) {
                    throw new Error(
                        JSON.stringify(
                            createAuthError(
                                AuthErrorType.MISSING_CREDENTIALS,
                                AUTH_ERROR_CODES.MISSING_CREDENTIALS,
                                "Google authorization code is required"
                            )
                        )
                    );
                }

                try {
                    // Gửi authorization code đến backend để xác thực
                    console.log(">>> Processing Google OAuth with code:", credentials.code);

                    const response = await fetch(
                        `${envServer.BACKEND_URL}${AUTH_ENDPOINTS.GOOGLE_AUTH}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                authorizeCode: credentials.code,
                            }),
                        }
                    );

                    const rawData = await response.json();

                    console.log(">>> Google OAuth response:", rawData);

                    if (!response.ok) {
                        const apiError = createErrorFromResponse(response, rawData);
                        throw new Error(JSON.stringify(apiError));
                    }

                    try {
                        const data = authResponseSchema.parse(rawData);

                        const accessToken = data.data.jwt;
                        const tokenExpiration = getTokenExpiration(accessToken);

                        return {
                            id: data.data.id || data.data.username,
                            name: data.data.username,
                            email: data.data.username,
                            role: data.data.role,
                            accessToken: accessToken,
                            accessTokenExpires: tokenExpiration,
                        };
                    } catch (error) {
                        if (error instanceof ZodError) {
                            console.error(
                                "Invalid Google OAuth API response format:",
                                error.errors
                            );
                            throw new Error(
                                JSON.stringify(
                                    createAuthError(
                                        AuthErrorType.SERVER_ERROR,
                                        AUTH_ERROR_CODES.SERVER_ERROR,
                                        "Server data format error"
                                    )
                                )
                            );
                        }
                        throw error;
                    }
                } catch (error) {
                    let errorHandled = false;
                    let errorToThrow: Error = new Error(
                        JSON.stringify(
                            createAuthError(
                                AuthErrorType.SERVER_ERROR,
                                AUTH_ERROR_CODES.SERVER_ERROR,
                                "Google OAuth authentication failed"
                            )
                        )
                    );

                    if (error instanceof Error && error.message) {
                        try {
                            const parsedError = JSON.parse(error.message);
                            if (
                                parsedError.type &&
                                parsedError.code &&
                                typeof parsedError.message === "string"
                            ) {
                                console.error(
                                    ">>> Using existing Google OAuth AuthError:",
                                    parsedError
                                );
                                errorToThrow = error;
                                errorHandled = true;
                            }
                        } catch (parseError) {
                            console.error("Error parsing Google OAuth AuthError:", parseError);
                        }
                    }

                    if (!errorHandled) {
                        console.error("Google OAuth auth error:", error);
                    }

                    throw errorToThrow;
                }
            },
        }),

        // Google provider with improved error handling
        CredentialsProvider({
            id: "google-credential",
            name: "Google",
            credentials: {
                credential: { label: "Credential", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.credential) {
                    throw new Error(
                        JSON.stringify(
                            createAuthError(
                                AuthErrorType.MISSING_CREDENTIALS,
                                AUTH_ERROR_CODES.MISSING_CREDENTIALS,
                                "Google credential cannot be empty"
                            )
                        )
                    );
                }

                try {
                    const response = await fetch(
                        `${envServer.BACKEND_URL}${AUTH_ENDPOINTS.GOOGLE_VERIFY}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                credential: credentials.credential,
                            }),
                        }
                    );

                    const data = await response.json();

                    if (!response.ok) {
                        const apiError = createErrorFromResponse(response, data);
                        throw new Error(JSON.stringify(apiError));
                    }

                    let accessToken = "";
                    let username = "";
                    let role = "";

                    if (data.data?.jwt) {
                        accessToken = data.data.jwt;
                        username = data.data.username;
                        role = data.data.role;
                    } else {
                        accessToken = data.accessToken;
                        username = data.user?.email || "";
                        role = data.user?.role || "";
                    }

                    const tokenExpiration = getTokenExpiration(accessToken);

                    return {
                        id: username,
                        email: username,
                        role: role,
                        accessToken: accessToken,
                        accessTokenExpires: tokenExpiration,
                    };
                } catch (error) {
                    // Khai báo biến để theo dõi trạng thái xử lý lỗi
                    let errorHandled = false;
                    let errorToThrow: Error = new Error(
                        JSON.stringify(
                            createAuthError(
                                AuthErrorType.SERVER_ERROR,
                                AUTH_ERROR_CODES.SERVER_ERROR,
                                "Google authentication server error, please try again later"
                            )
                        )
                    );

                    if (error instanceof Error && error.message) {
                        try {
                            // Thử parse message để kiểm tra xem đã là AuthError chưa
                            const parsedError = JSON.parse(error.message);
                            if (
                                parsedError.type &&
                                parsedError.code &&
                                typeof parsedError.message === "string"
                            ) {
                                // Đã là AuthError, sử dụng lỗi này
                                console.error(">>> Using existing Google AuthError:", parsedError);
                                errorToThrow = error;
                                errorHandled = true;
                            }
                        } catch (parseError) {
                            // Không phải JSON, bỏ qua
                            console.error("Error parsing Google AuthError:", parseError);
                        }
                    }

                    // Nếu chưa xử lý lỗi, tạo lỗi server mặc định
                    if (!errorHandled) {
                        console.error("Google auth error:", error);
                        errorToThrow = new Error(
                            JSON.stringify(
                                createAuthError(
                                    AuthErrorType.SERVER_ERROR,
                                    AUTH_ERROR_CODES.SERVER_ERROR,
                                    "Google authentication server error, please try again later"
                                )
                            )
                        );
                    }

                    // Throw lỗi đã được xử lý
                    throw errorToThrow;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback:", { token, user });
            if (user) {
                token.id = user.id;
                token.accessToken = user.accessToken;
                token.role = user.role;
                if (user.refreshToken) {
                    token.refreshToken = user.refreshToken;
                }
                token.accessTokenExpires =
                    user.accessTokenExpires || getTokenExpiration(user.accessToken);
            }

            console.log("JWT token after processing:", token);

            // Kiểm tra nếu token hết hạn
            const shouldRefreshTime = Math.round(token.accessTokenExpires - Date.now());

            // Nếu token còn hạn thì trả về token hiện tại
            if (shouldRefreshTime > 0) {
                return token;
            }

            // Nếu không có refresh token, đánh dấu lỗi ngay
            if (!token.refreshToken) {
                return {
                    ...token,
                    error: "RefreshAccessTokenError",
                };
            }

            // Refresh token nếu hết hạn và có refresh token
            return await refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email || "";
            session.user.role = token.role;
            session.accessToken = token.accessToken;
            if (token.refreshToken) {
                session.refreshToken = token.refreshToken;
            }
            session.error = token.error;

            return session;
        },

        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/user/signin",
        error: "/user/signin",
    },
    debug: envServer.NODE_ENV === "development",
    secret: envServer.NEXTAUTH_SECRET,
};

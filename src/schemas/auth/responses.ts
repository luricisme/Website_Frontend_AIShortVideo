import { z } from "zod";

// JWT payload schema
export const jwtPayloadSchema = z.object({
    sub: z.string(),
    iat: z.number(),
    exp: z.number(),
    role: z.string().optional(),
});

// Auth response data schema
export const authResponseDataSchema = z.object({
    jwt: z.string(),
    username: z.string(),
    role: z.string(),
    id: z.number().or(z.string()), // ID can be a number or string
});

// Auth response schema
export const authResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: authResponseDataSchema,
});

// Refresh token response schema
export const refreshTokenResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        jwt: z.string(),
        refreshToken: z.string().optional(),
    }),
});

// register response schema
export const registerResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.object({
        username: z.string(),
        role: z.string(),
    }),
});

// Infer types from schemas
export type JWTPayload = z.infer<typeof jwtPayloadSchema>;
export type AuthResponseData = z.infer<typeof authResponseDataSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

import { z } from "zod";

// ApiError schema
export const apiErrorSchema = z.object({
    code: z.string().optional(),
    field: z.string().optional(),
    message: z.string(),
});

// ApiResponse schema (generic)
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        status: z.number(),
        message: z.string(),
        data: dataSchema,
        errors: z.array(apiErrorSchema).optional(),
    });

export const apiBasicResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    errors: z.array(apiErrorSchema).optional(),
});

// ApiRequest schema (optional, nếu cần validate object bất kỳ)
export const apiRequestSchema = z.record(z.unknown());

// Type aliases
export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiRequest = z.infer<typeof apiRequestSchema>;
export type ApiBasicResponse = z.infer<typeof apiBasicResponseSchema>;

// export type ApiResponse<T> = T extends z.ZodTypeAny
//     ? z.infer<ReturnType<typeof apiResponseSchema<T>>>
//     : never;

export interface ApiResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
    errors?: ApiError[];
}

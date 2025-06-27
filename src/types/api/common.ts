/**
 * Generic API response structure
 */
export interface ApiResponse<T = unknown> {
    status: number;
    message: string;
    data: T;
    errors?: ApiError[];
}

/**
 * API error structure
 */
export interface ApiError {
    code?: string;
    field?: string;
    message: string;
}

/**
 * Generic request structure
 */
export interface ApiRequest {
    [key: string]: unknown;
}

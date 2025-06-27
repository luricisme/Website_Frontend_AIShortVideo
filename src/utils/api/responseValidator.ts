import { z } from "zod";
import { HttpError, HttpErrorType } from "../errors/HttpError";

/**
 * Validate và parse API response sử dụng Zod schema
 */
export async function validateResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
    // Xử lý response không có body nhưng trả về lỗi
    if (!response.ok) {
        if (response.status === 204) {
            throw new HttpError(HttpErrorType.UNKNOWN, "Empty error response", response.status);
        } else if (response.status === 401) {
            throw new HttpError(
                HttpErrorType.AUTHENTICATION,
                "Authentication required",
                response.status
            );
        }
    }

    // Parse JSON response
    let data: unknown;
    try {
        data = await response.json();
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        // Nếu không parse được JSON nhưng response là OK
        if (response.ok) {
            // Trả về empty object cho các response không có content
            return {} as T;
        }

        throw HttpError.fromNetworkError(new Error("Invalid JSON response"));
    }

    // Xử lý response thành công
    if (response.ok) {
        try {
            // Validate data với schema
            const validatedData = schema.parse(data);
            return validatedData;
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Schema validation thất bại
                console.error("API response schema validation failed:", error.errors);
                throw new HttpError(
                    HttpErrorType.SERVER,
                    "Invalid API response format",
                    response.status,
                    error.errors.map((e) => ({ message: e.message, field: e.path.join(".") }))
                );
            }
            throw error;
        }
    }

    // Xử lý response lỗi
    throw HttpError.fromResponse(response, data);
}

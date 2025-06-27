export enum HttpErrorType {
    NETWORK = "NETWORK",
    AUTHENTICATION = "AUTHENTICATION",
    VALIDATION = "VALIDATION",
    SERVER = "SERVER",
    NOT_FOUND = "NOT_FOUND",
    TIMEOUT = "TIMEOUT",
    UNKNOWN = "UNKNOWN",
}

export interface HttpErrorDetail {
    code?: string;
    field?: string;
    message: string;
}

// Định nghĩa interface cho cấu trúc data từ API response
export interface ApiErrorResponse {
    message?: string;
    error?: string;
    errors?: Array<HttpErrorDetail | Record<string, unknown>>;
    [key: string]: unknown;
}

export class HttpError extends Error {
    readonly type: HttpErrorType;
    readonly status: number;
    readonly details: HttpErrorDetail[];
    readonly originalError?: unknown;

    constructor(
        type: HttpErrorType,
        message: string,
        status: number = 0,
        details: HttpErrorDetail[] = [],
        originalError?: unknown
    ) {
        super(message);
        this.name = "HttpError";
        this.type = type;
        this.status = status;
        this.details = details;
        this.originalError = originalError;

        // Đảm bảo chuỗi prototype được duy trì đúng
        Object.setPrototypeOf(this, HttpError.prototype);
    }

    static fromResponse(response: Response, data: unknown): HttpError {
        // Xác định loại lỗi dựa trên status code
        let type: HttpErrorType;
        let message = "An error occurred";
        let details: HttpErrorDetail[] = [];

        // Type guard để kiểm tra cấu trúc data
        const isApiErrorResponse = (obj: unknown): obj is ApiErrorResponse => {
            return obj !== null && typeof obj === "object";
        };

        // Chuyển đổi unknown thành ApiErrorResponse nếu hợp lệ
        if (isApiErrorResponse(data)) {
            // Lấy message từ response nếu có
            if (typeof data.message === "string") {
                message = data.message;
            }

            // Kiểm tra và xử lý chi tiết lỗi
            if (Array.isArray(data.errors)) {
                details = data.errors
                    .filter(
                        (error): error is HttpErrorDetail | Record<string, unknown> =>
                            error !== null && typeof error === "object"
                    )
                    .map((error) => {
                        if ("message" in error && typeof error.message === "string") {
                            return {
                                code:
                                    "code" in error && typeof error.code === "string"
                                        ? error.code
                                        : undefined,
                                field:
                                    "field" in error && typeof error.field === "string"
                                        ? error.field
                                        : undefined,
                                message: error.message,
                            };
                        }
                        return { message: "Invalid error format" };
                    });
            } else if (typeof data.error === "string") {
                details = [{ message: data.error }];
            }
        }

        // Xác định loại lỗi dựa trên status
        switch (response.status) {
            case 400:
                type = HttpErrorType.VALIDATION;
                break;
            case 401:
            case 403:
                type = HttpErrorType.AUTHENTICATION;
                break;
            case 404:
                type = HttpErrorType.NOT_FOUND;
                break;
            case 408:
                type = HttpErrorType.TIMEOUT;
                break;
            case 500:
            case 502:
            case 503:
            case 504:
                type = HttpErrorType.SERVER;
                break;
            default:
                type = HttpErrorType.UNKNOWN;
        }

        return new HttpError(type, message, response.status, details);
    }

    static fromNetworkError(error: Error): HttpError {
        return new HttpError(
            HttpErrorType.NETWORK,
            "Cannot connect to server. Please check your network connection.",
            0,
            [],
            error
        );
    }

    static fromAuthError(message: string = "Session expired"): HttpError {
        return new HttpError(HttpErrorType.AUTHENTICATION, message, 401, [{ message }]);
    }

    // Kiểm tra loại lỗi
    isNetworkError(): boolean {
        return this.type === HttpErrorType.NETWORK;
    }

    isAuthError(): boolean {
        return this.type === HttpErrorType.AUTHENTICATION;
    }

    isValidationError(): boolean {
        return this.type === HttpErrorType.VALIDATION;
    }

    isServerError(): boolean {
        return this.type === HttpErrorType.SERVER;
    }

    isNotFoundError(): boolean {
        return this.type === HttpErrorType.NOT_FOUND;
    }

    // Lấy thông báo lỗi thân thiện với người dùng
    getFriendlyMessage(): string {
        switch (this.type) {
            case HttpErrorType.NETWORK:
                return "Cannot connect to server. Please check your network connection.";
            case HttpErrorType.AUTHENTICATION:
                return "Your session has expired. Please log in again.";
            case HttpErrorType.VALIDATION:
                return this.details.length > 0
                    ? this.details.map((d) => d.message).join(". ")
                    : "Invalid input data.";
            case HttpErrorType.SERVER:
                return "A server error occurred. Please try again later.";
            case HttpErrorType.NOT_FOUND:
                return "Requested resource not found.";
            case HttpErrorType.TIMEOUT:
                return "Request timed out. Please try again.";
            default:
                return this.message || "An unknown error occurred.";
        }
    }
}

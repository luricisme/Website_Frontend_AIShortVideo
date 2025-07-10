import { useCallback } from "react";
import { toast } from "react-hot-toast"; // or other toast library
import { HttpError, HttpErrorType } from "@/utils/errors/HttpError";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export function useErrorHandler() {
    const router = useRouter();

    const handleError = useCallback(
        async (error: unknown, showToast = true) => {
            if (error instanceof HttpError) {
                // Handle different HttpError types
                switch (error.type) {
                    case HttpErrorType.AUTHENTICATION:
                        // Log out for authentication errors
                        await signOut({
                            redirect: true,
                            callbackUrl: "/user/signin?error=session_expired",
                        });
                        break;

                    case HttpErrorType.VALIDATION:
                        // Show validation error
                        if (showToast) {
                            toast.error(error.getFriendlyMessage());
                        }
                        break;

                    case HttpErrorType.NETWORK:
                        // Show network error
                        if (showToast) {
                            toast.error(error.getFriendlyMessage());
                        }
                        break;

                    case HttpErrorType.SERVER:
                        // Show server error
                        if (showToast) {
                            toast.error(error.getFriendlyMessage());
                        }
                        break;

                    case HttpErrorType.NOT_FOUND:
                        // Redirect to 404 page or show message
                        if (showToast) {
                            toast.error(error.getFriendlyMessage());
                        }
                        break;

                    default:
                        // Unknown error
                        if (showToast) {
                            toast.error(error.getFriendlyMessage());
                        }
                        break;
                }

                // Return HttpError for further handling in component
                return error;
            } else {
                // Not an HttpError
                const message =
                    error instanceof Error ? error.message : "An unknown error occurred";
                if (showToast) {
                    toast.error(message);
                }
                console.error("Unhandled error:", error);

                // Wrap error as HttpError and return
                return new HttpError(HttpErrorType.UNKNOWN, message, 0, [], error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router]
    );

    return { handleError };
}

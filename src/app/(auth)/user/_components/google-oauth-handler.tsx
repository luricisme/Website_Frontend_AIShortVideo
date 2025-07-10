"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { LoaderCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthResponseUser } from "@/types/user.types";

export default function GoogleOAuthHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(3);
    const [userInfo, setUserInfo] = useState<AuthResponseUser>();

    const hasProcessed = useRef(false);
    const redirectTimer = useRef<NodeJS.Timeout | null>(null);
    const countdownTimer = useRef<NodeJS.Timeout | null>(null);
    const isRedirecting = useRef(false);

    const googleCode = searchParams.get("google_code");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    useEffect(() => {
        return () => {
            if (redirectTimer.current) {
                clearTimeout(redirectTimer.current);
            }
            if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleGoogleOAuth = async () => {
            if (!googleCode || hasProcessed.current || isRedirecting.current) {
                return;
            }

            hasProcessed.current = true;
            setIsProcessing(true);
            setError(null);
            setIsSuccess(false);

            try {
                const result = await signIn("google-oauth", {
                    code: googleCode,
                    redirect: false,
                });

                if (result?.error) {
                    console.error(">>> Google OAuth sign-in failed:", result.error);
                    setIsProcessing(false);

                    try {
                        if (result.error.startsWith("{")) {
                            const errorData = JSON.parse(result.error);
                            setError(
                                errorData.message || "Google sign-in failed. Please try again."
                            );
                        } else {
                            setError("Google sign-in failed. Please try again.");
                        }
                    } catch (parseError) {
                        console.error(">>> Error parsing sign-in error:", parseError);
                        setError("Google sign-in failed. Please try again.");
                    }
                } else if (result?.ok) {
                    const session = await getSession();

                    if (session?.user) {
                        localStorage.setItem("user", JSON.stringify(session.user));
                        setUserInfo(session.user);
                    }

                    setIsProcessing(false);
                    setIsSuccess(true);

                    countdownTimer.current = setInterval(() => {
                        setCountdown((prev) => {
                            const newCount = prev - 1;
                            if (newCount <= 0) {
                                if (countdownTimer.current) {
                                    clearInterval(countdownTimer.current);
                                }
                                return 0;
                            }
                            return newCount;
                        });
                    }, 1000);

                    redirectTimer.current = setTimeout(() => {
                        if (!isRedirecting.current) {
                            isRedirecting.current = true;
                            router.replace(callbackUrl);
                        }
                    }, 3000);
                } else {
                    setError("An error occurred during Google sign-in.");
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error(">>> Exception during OAuth processing:", error);
                setError("An error occurred during Google sign-in.");
                setIsProcessing(false);
            }
        };

        handleGoogleOAuth();
    }, [googleCode, callbackUrl, router]);

    useEffect(() => {
        if (googleCode) {
            hasProcessed.current = false;
            isRedirecting.current = false;
        }
    }, [googleCode]);

    const redirectNow = () => {
        if (isRedirecting.current) {
            return;
        }

        isRedirecting.current = true;

        if (redirectTimer.current) {
            clearTimeout(redirectTimer.current);
        }
        if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
        }

        router.replace(callbackUrl);
    };

    if (!googleCode) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            <div className="w-full max-w-md space-y-6">
                <Card className="border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                    <CardContent className="p-8">
                        <div className="text-center space-y-6">
                            {isProcessing ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 relative">
                                            <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                                Authenticating
                                            </h2>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Please wait while we securely authenticate your
                                                Google account
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : isSuccess ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                                Welcome back!
                                            </h2>
                                            {userInfo && (
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    {userInfo.name || userInfo.email}
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                You have successfully signed in with Google
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Redirecting in {countdown} second
                                                {countdown !== 1 ? "s" : ""}
                                            </p>
                                            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                    style={{
                                                        width: `${((3 - countdown) / 3) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={redirectNow}
                                            size="sm"
                                            className="w-full"
                                            disabled={isRedirecting.current}
                                            variant="default"
                                        >
                                            {isRedirecting.current ? (
                                                <>
                                                    <LoaderCircle className="w-3 h-3 animate-spin mr-2" />
                                                    Redirecting...
                                                </>
                                            ) : (
                                                "Continue Now"
                                            )}
                                        </Button>
                                    </div>
                                </>
                            ) : error ? (
                                <>
                                    <div className="space-y-4">
                                        <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                            <span className="text-destructive text-2xl">⚠</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-semibold tracking-tight text-foreground">
                                                Authentication Failed
                                            </h2>
                                            <p className="text-sm text-destructive font-medium">
                                                {error}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => {
                                                hasProcessed.current = false;
                                                isRedirecting.current = false;
                                                setCountdown(3);
                                                router.replace("/user/signin");
                                            }}
                                            className="w-full"
                                            variant="default"
                                        >
                                            Try Again
                                        </Button>
                                        <Button
                                            onClick={() => router.replace("/")}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Go to Homepage
                                        </Button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                {/* Subtle branding */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground/60">Secured by Google OAuth 2.0</p>
                </div>
            </div>
        </div>
    );
}

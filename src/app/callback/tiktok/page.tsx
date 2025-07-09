"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoaderCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TikTokLinkHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(3);
    const [tiktokUsername, setTiktokUsername] = useState<string | null>(null);

    const hasProcessed = useRef(false);
    const redirectTimer = useRef<NodeJS.Timeout | null>(null);
    const countdownTimer = useRef<NodeJS.Timeout | null>(null);
    const isRedirecting = useRef(false);

    const tiktokCode = searchParams.get("code");
    const state = searchParams.get("state");
    const callbackUrl = searchParams.get("callback_url") || "/";

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
        const handleTikTokLink = async () => {
            if (!tiktokCode || hasProcessed.current || isRedirecting.current) {
                return;
            }

            hasProcessed.current = true;
            setIsProcessing(true);
            setError(null);
            setIsSuccess(false);

            try {
                // Gửi code tới API để liên kết tài khoản TikTok
                const response = await fetch("/api/auth/tiktok/link-account", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: tiktokCode,
                        state: state,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(">>> TikTok account linking failed:", data.error || data.message);
                    setIsProcessing(false);
                    setError(data.message || "TikTok account linking failed. Please try again.");
                } else {
                    // Nếu thành công
                    setTiktokUsername(data.tiktokUsername || "TikTok User");
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
                }
            } catch (error) {
                console.error(">>> Exception during TikTok linking:", error);
                setError("An error occurred during TikTok account linking.");
                setIsProcessing(false);
            }
        };

        handleTikTokLink();
    }, [tiktokCode, state, callbackUrl, router]);

    useEffect(() => {
        if (tiktokCode) {
            hasProcessed.current = false;
            isRedirecting.current = false;
        }
    }, [tiktokCode]);

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

    if (!tiktokCode) {
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
                                                Linking TikTok Account
                                            </h2>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Please wait while we securely link your TikTok
                                                account
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
                                                TikTok Account Linked!
                                            </h2>
                                            {tiktokUsername && (
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    {tiktokUsername}
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Your TikTok account has been successfully linked
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
                                                Linking Failed
                                            </h2>
                                            <p className="text-sm text-destructive font-medium">
                                                {error}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => {
                                                router.replace("/");
                                            }}
                                            className="w-full"
                                            variant="default"
                                        >
                                            Back to Home
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                hasProcessed.current = false;
                                                isRedirecting.current = false;
                                                setError(null);
                                                setCountdown(3);
                                                router.replace("/api/auth/tiktok");
                                            }}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                {/* Subtle branding */}
                <div className="text-center">
                    <p className="text-xs text-muted-foreground/60">Secured by TikTok API</p>
                </div>
            </div>
        </div>
    );
}

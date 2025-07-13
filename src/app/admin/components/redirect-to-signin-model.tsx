"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Ban, ShieldOff } from "lucide-react";

type ErrorType = "auth" | "permission" | "system";

export default function RedirectModal({
    message,
    errorType = "auth",
}: {
    message: string;
    errorType?: ErrorType;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const isRedirecting = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        timeoutRef.current = setTimeout(() => {
            if (!isRedirecting.current) {
                isRedirecting.current = true;
                setOpen(false);
                router.replace("/admin/signin");
            }
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [router]);

    const handleRedirectNow = () => {
        if (isRedirecting.current) return;
        isRedirecting.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        router.replace("/admin/signin");
    };

    const icon =
        errorType === "auth" ? (
            <AlertTriangle className="h-10 w-10 text-yellow-500 mb-1" />
        ) : errorType === "permission" ? (
            <ShieldOff className="h-10 w-10 text-red-500 mb-1" />
        ) : (
            <Ban className="h-10 w-10 text-gray-400 mb-1" />
        );

    const titleColor =
        errorType === "auth"
            ? "text-yellow-500"
            : errorType === "permission"
            ? "text-red-500"
            : "text-gray-400";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-xs mx-auto text-center">
                <DialogHeader>
                    <div className="flex flex-col items-center justify-center mb-2">
                        {icon}
                        <DialogTitle className={titleColor}>Notification</DialogTitle>
                    </div>
                </DialogHeader>
                <div className="mb-4 text-neutral-200">{message}</div>
                <div className="mb-2 text-xs text-muted-foreground font-medium">
                    Redirecting in <span className="font-bold">{countdown}</span> second
                    {countdown !== 1 ? "s" : ""}
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{
                            width: `${((3 - countdown) / 3) * 100}%`,
                        }}
                    />
                </div>
                <Button
                    className="w-full"
                    onClick={handleRedirectNow}
                    disabled={isRedirecting.current}
                >
                    {isRedirecting.current ? "Redirecting..." : "Sign in now"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}

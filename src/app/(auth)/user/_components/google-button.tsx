"use client";

import { useState } from "react";
import Image from "next/image";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";

import { icons } from "@/constants/icons";
import { useSearchParams } from "next/navigation";
import { envPublic } from "@/constants/env.public";
import { LoaderCircle } from "lucide-react";

type GoogleButtonProps = {
    content?: string;
    isDisabled?: boolean;
};

const GoogleButton = ({
    content = "Continue with Google",
    isDisabled = false,
}: GoogleButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const login = useGoogleLogin({
        flow: "auth-code",
        ux_mode: "redirect",
        redirect_uri: `${typeof window !== "undefined" ? window.location.origin : ""}${
            envPublic.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "/api/auth/google-callback"
        }`,
        onError: (errorResponse) => {
            console.error("Google Sign-In Error:", errorResponse);
            setIsLoading(false);
        },
        state: encodeURIComponent(
            JSON.stringify({
                returnTo: callbackUrl,
            })
        ),
        scope: "email profile",
    });

    const handleGoogleLogin = () => {
        setIsLoading(true);
        login();
    };

    return (
        <Button
            variant="outline"
            className="w-full h-10 sm:h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800 text-sm sm:text-base"
            onClick={handleGoogleLogin}
            disabled={isLoading || isDisabled}
        >
            {isLoading && (
                <div className="flex items-center justify-center">
                    <LoaderCircle
                        className="ml-2 animate-spin h-5 w-5 text-white"
                        size={20}
                        aria-label="Loading"
                    />
                </div>
            )}
            <Image
                src={icons.google.svg}
                alt="Google Logo"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 select-none"
            />
            {content}
        </Button>
    );
};

export default function GoogleButtonWrapper({ content, isDisabled }: GoogleButtonProps) {
    return (
        <GoogleOAuthProvider clientId={envPublic.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <GoogleButton content={content} isDisabled={isDisabled} />
        </GoogleOAuthProvider>
    );
}

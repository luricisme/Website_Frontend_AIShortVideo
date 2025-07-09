import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface TikTokButtonProps {
    children?: React.ReactNode;
    isDisabled?: boolean;
}

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 013.83-4.33v-3.7a6.37 6.37 0 00-5.94 9.94 6.37 6.37 0 0010.98-4.4s0-.08 0-.12V9.4a8.16 8.16 0 003.55.77v-3.48z" />
    </svg>
);

const TikTokButton = ({ children, isDisabled = false }: TikTokButtonProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLinkingTitTok = async () => {
        // redirect to TikTok route handler
        setIsLoading(true);

        try {
            // await fetch("/api/auth/tiktok");
            // localStorage.setItem("tiktok_oauth_redirect", window.location.href);
            // window.location.href = "/api/auth/tiktok";
            window.location.href = `/api/auth/tiktok?redirect_url=${encodeURIComponent(
                window.location.href
            )}`;
        } catch (error) {
            console.error("Error linking TikTok:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            className="w-full h-10 sm:h-12 bg-transparent border-gray-700 text-white hover:bg-gray-800 text-sm sm:text-base"
            onClick={handleLinkingTitTok}
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
            {children ? (
                children
            ) : (
                <>
                    <TikTokIcon />
                    Continue with TikTok
                </>
            )}
        </Button>
    );
};
export default TikTokButton;

import { AlertCircle, Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileError = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <Alert variant="destructive" className="text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message || "Failed to load profile"}</AlertDescription>
            </Alert>
            <div className="flex gap-4 justify-center">
                <Button onClick={onRetry} variant="outline">
                    Try Again
                </Button>
                <Button asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    </div>
);

export default ProfileError;

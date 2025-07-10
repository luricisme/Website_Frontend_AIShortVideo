import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="mt-6">
        <Alert className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
                <span>{message}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="ml-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                </Button>
            </AlertDescription>
        </Alert>
    </div>
);

export default ErrorState;

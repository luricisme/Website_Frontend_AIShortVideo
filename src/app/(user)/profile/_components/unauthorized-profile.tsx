import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const UnauthorizedProfile = () => (
    <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Access Required</h2>
            <p className="text-zinc-400">Please sign in to view your profile</p>
            <div className="flex gap-4 justify-center">
                <Button asChild>
                    <Link href="/user/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    </div>
);

export default UnauthorizedProfile;
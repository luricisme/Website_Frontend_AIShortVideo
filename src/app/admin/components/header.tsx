"use client";

import { ITEMS_SIDEBAR } from "@/app/admin/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/providers/user-store-provider";
import { useUserInfo } from "@/queries/use-user-info";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AvatarDropdownMenu = ({
    name,
}: {
    name: string | null | undefined;
    userId?: string | number | undefined;
}) => {
    const router = useRouter();
    const { clearUser } = useUserStore((state) => state);

    const handleLogout = async () => {
        try {
            clearUser();
            await signOut({ redirect: false });
            router.refresh();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error(">>> Logout failed:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="text-xs sm:text-sm">
                        {(name ?? "Unknown").charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const Header = () => {
    const { data: session, status } = useSession();

    console.log(">>> Session in Header:", session, status);

    const pathname = usePathname();

    const { user, setUser, setFetching, setError, clearUser } = useUserStore((state) => state);

    // Chỉ fetch user info khi có session và chưa có user data
    const shouldFetchUserInfo = !!session?.accessToken && !user;

    const {
        data: userInfoData,
        isLoading: isUserInfoLoading,
        error: userInfoError,
        isError: isUserInfoError,
    } = useUserInfo(session, {
        enabled: shouldFetchUserInfo, // Conditional fetching
    });

    const callSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: "/admin/signin" });
    };

    // Handle combined auth and user info states
    useEffect(() => {
        // Determine current state
        const currentState = (() => {
            if (status === "loading") return "session-loading";
            if (status === "unauthenticated" || !session?.accessToken) return "unauthenticated";
            if (isUserInfoLoading) return "user-loading";
            if (isUserInfoError && userInfoError) return "error";
            if (userInfoData && !isUserInfoError) return "authenticated";
            return "idle";
        })();

        // Handle each state
        switch (currentState) {
            case "session-loading":
            case "user-loading":
                setFetching(true);
                break;

            case "unauthenticated":
                clearUser();
                setFetching(false);
                break;

            case "error":
                setError(userInfoError);
                setFetching(false);
                toast.error(userInfoError?.message || "Failed to fetch user info");
                callSignOut();
                break;

            case "authenticated":
                setUser(userInfoData || null);
                setFetching(false);
                setError(null);
                break;

            case "idle":
            default:
                setFetching(false);
                break;
        }
    }, [
        status,
        session?.accessToken,
        userInfoData,
        isUserInfoLoading,
        isUserInfoError,
        userInfoError,
        setUser,
        setFetching,
        setError,
        clearUser,
    ]);

    const getActiveTab = () => {
        const matched = ITEMS_SIDEBAR.filter((item) => pathname.startsWith(item.url)).sort(
            (a, b) => b.url.length - a.url.length
        )[0];
        return matched || ITEMS_SIDEBAR[0];
    };

    return (
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-2xl font-bold">{getActiveTab().title}</h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2 sm:ml-3">
                {status === "loading" || isUserInfoLoading ? (
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
                    </div>
                ) : user && session?.user ? (
                    <AvatarDropdownMenu
                        name={user?.username ?? session.user.name ?? null}
                        userId={user?.id}
                    />
                ) : (
                    <>
                        <Button
                            size="sm"
                            className="!font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
                        >
                            <Link href={"/admin/signin"}>Sign In</Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="!font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 hidden sm:flex"
                        >
                            <Link href={"/admin/register"}>Register</Link>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            className="!font-semibold text-xs px-2 h-8 sm:hidden"
                        >
                            <Link href={"/admin/register"}>Join</Link>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;

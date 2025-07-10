"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo } from "@/queries/use-user-info";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUserStore } from "@/providers/user-store-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X } from "lucide-react";
import SearchInput from "@/app/(user)/_components/search-input";

function SearchInputLoading() {
    return (
        <div className="flex-1 max-w-lg">
            <Skeleton className="h-10 w-full rounded-full" />
        </div>
    );
}

function ResponsiveSearchInput({ onSearchComplete }: { onSearchComplete?: () => void }) {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <>
            <div className="hidden lg:flex flex-1 max-w-lg">
                <Suspense fallback={<SearchInputLoading />}>
                    <SearchInput onSearchComplete={onSearchComplete} />
                </Suspense>
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-10 h-10 p-0 shrink-0"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Open search"
            >
                <Search className="w-5 h-5" />
            </Button>

            {isMobileSearchOpen && (
                <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm lg:hidden">
                    <div className="flex items-center gap-3 p-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-10 h-10 p-0 shrink-0"
                            onClick={() => setIsMobileSearchOpen(false)}
                            aria-label="Close search"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <Suspense fallback={<SearchInputLoading />}>
                                <SearchInput
                                    isMobileMode={true}
                                    onSearchComplete={() => {
                                        setIsMobileSearchOpen(false);
                                        onSearchComplete?.();
                                    }}
                                />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const AvatarDropdownMenu = ({
    image,
    name,
}: {
    image: string | null | undefined;
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

    const handleProfileClick = () => {
        router.push("/profile/me");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer">
                    <AvatarImage src={image ?? undefined} />
                    <AvatarFallback className="text-xs sm:text-sm">
                        {(name ?? "Unknown").charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SearchBar = () => {
    const { data: session, status } = useSession();
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
        await signOut({ redirect: false });
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

    return (
        <div className="h-[76px] flex items-center w-full gap-2 sm:gap-3 md:gap-4 py-4 sticky top-0 z-50 bg-background px-2 sm:px-4">
            <SidebarTrigger className="shrink-0" />

            <div className="flex items-center justify-between w-full min-w-0">
                <ResponsiveSearchInput />

                <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2 sm:ml-3">
                    {status === "loading" || isUserInfoLoading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full" />
                        </div>
                    ) : user && session?.user ? (
                        <AvatarDropdownMenu
                            image={user?.avatar ?? session.user.image ?? null}
                            name={user?.username ?? session.user.name ?? null}
                            userId={user?.id}
                        />
                    ) : (
                        <>
                            <Button
                                size="sm"
                                className="!font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9"
                            >
                                <Link href={"/user/signin"}>Sign In</Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="!font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9 hidden sm:flex"
                            >
                                <Link href={"/user/register"}>Register</Link>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="!font-semibold text-xs px-2 h-8 sm:hidden"
                            >
                                <Link href={"/user/register"}>Join</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;

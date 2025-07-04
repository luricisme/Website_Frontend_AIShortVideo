"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
                <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarImage src={image ?? undefined} />
                    <AvatarFallback>{(name ?? "Unknown").charAt(0)}</AvatarFallback>
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
                // signOut({ redirect: false });
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
        <div className="h-[76px] flex items-center w-full gap-2 py-4 sticky top-0 z-50 bg-background">
            <SidebarTrigger />
            <div className="flex items-center justify-between w-full">
                <div className="relative flex items-center justify-center w-full max-w-[400px]">
                    <button className="absolute left-3" aria-label="Search">
                        <Search color="#786E6E" size={20} strokeWidth={3} />
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none bg-sidebar"
                        aria-label="Search input"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {status === "loading" || isUserInfoLoading ? (
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    ) : user && session?.user ? (
                        <AvatarDropdownMenu
                            image={user?.avatar ?? session.user.image ?? null}
                            name={user?.username ?? session.user.name ?? null}
                            userId={user?.id}
                        />
                    ) : (
                        <>
                            <Button className="!font-semibold">
                                <Link href={"/user/signin"}>Sign In</Link>
                            </Button>
                            <Button variant="outline" className="!font-semibold">
                                <Link href={"/user/register"}>Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;

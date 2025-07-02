"use client";

import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
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
}) => {
    const router = useRouter();
    const { clearUser } = useUserStore((state) => state);

    const handleLogout = async () => {
        try {
            const result = await signOut({
                redirect: false,
            });

            console.log(">>> Logout successful:", result);
            localStorage.removeItem("user");
            clearUser(); // Clear user state in the store
            router.refresh(); // Refresh the page to reflect the logout state
        } catch (error) {
            console.error(">>> Logout failed:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-9 h-9 cursor-pointer">
                    <AvatarImage src={image ?? undefined} />
                    <AvatarFallback>{(name ?? "Unknown").charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleLogout()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SearchBar = () => {
    const { data: session, status } = useSession();
    const { setUser } = useUserStore((state) => state);

    // Video info state
    const {
        data: userInfoData,
        isLoading: isUserInfoLoading,
        error: userInfoError,
        isError: isUserInfoError,
    } = useUserInfo(session);

    // if (userInfoData && !isUserInfoError && !isUserInfoLoading) {
    //     setUser(userInfoData);
    // }

    useEffect(() => {
        // trường hợp đăng nhập nhưng không có dữ liệu userInfoData hoặc bị lỗi
        if (session?.accessToken && !isUserInfoLoading && isUserInfoError) {
            toast.error(userInfoError?.message || "Failed to fetch user info");
            return;
        }

        // trường hợp đăng nhập thành công và có dữ liệu userInfoData
        if (session?.accessToken && userInfoData && !isUserInfoLoading && !isUserInfoError) {
            setUser(userInfoData);
            return;
        }
    }, [
        userInfoData,
        isUserInfoLoading,
        isUserInfoError,
        setUser,
        session?.accessToken,
        userInfoError?.message,
    ]);

    // console.log(">>> VideoDetail userInfoData:", userInfoData);
    // console.log(">>> VideoDetail isUserInfoLoading:", isUserInfoLoading);
    // console.log(">>> VideoDetail userInfoError:", userInfoError);
    // console.log(">>> VideoDetail isUserInfoError:", isUserInfoError);

    return (
        <div className="h-[76px] flex items-center w-full gap-2 py-4 sticky top-0 z-50 bg-background">
            <SidebarTrigger />
            <div className="flex items-center justify-between w-full">
                <div className="relative flex items-center justify-center w-full max-w-[400px]">
                    <button className="absolute left-3">
                        <Search color="#786E6E" size={20} strokeWidth={3} />
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none bg-sidebar "
                    />
                </div>
                <div className="flex items-center gap-2">
                    {status === "loading" ? (
                        // Show skeleton while loading
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    ) : session?.user ? (
                        <AvatarDropdownMenu
                            image={session.user.image ?? userInfoData?.avatar ?? null}
                            name={session.user.name ?? userInfoData?.username ?? null}
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

"use client";

import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useRouter } from "next/navigation";

const AvatarDropdownMenu = ({
    image,
    name,
}: {
    image: string | null | undefined;
    name: string | null | undefined;
}) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const result = await signOut({
                redirect: false,
            });

            console.log(">>> Logout successful:", result);
            localStorage.removeItem("user");
            router.replace("/");
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
                            image={session.user.image ?? null}
                            name={session.user.name ?? null}
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

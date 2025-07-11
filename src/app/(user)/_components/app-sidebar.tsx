"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { icons } from "@/constants/icons";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/providers/user-store-provider";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        icon: <Image src={icons.home.svg} alt="Home" width={16} height={16} />,
    },
    {
        title: "Trending",
        url: "/trending",
        icon: <Image src={icons.trending.svg} alt="Trending" width={16} height={16} />,
    },
    {
        title: "Profile",
        url: "/profile/me",
        icon: <Image src={icons.profile.svg} alt="Profile" width={16} height={16} />,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user: currentUser } = useUserStore((state) => state);

    const handleCreateVideoClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!currentUser) {
            // Navigate to a login page or profile page that shows UnauthorizedProfile
            router.push("/user/signin"); // hoặc router.push("/login");
            return;
        }

        // If user is authenticated, proceed to create video page
        router.push("/create-video");
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between px-4 py-2 gap-2 ">
                    <Image src={icons.logo.png} alt="Logo" width={40} height={40} />
                    <h1 className="text-lg font-bold">AI Short Video Creator</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <Link key={item.title} href={item.url} prefetch={false}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            isActive={
                                                pathname === item.url ||
                                                (pathname.startsWith(item.url) && item.url !== "/")
                                            }
                                        >
                                            {item.icon}
                                            <span className="ml-2 font-medium text-sm text-gray-700 dark:text-gray-200">
                                                {item.title}
                                            </span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Link>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2 gap-2 ">
                    <Button
                        className="w-full flex items-center justify-center gap-2 cursor-pointer"
                        onClick={handleCreateVideoClick}
                    >
                        <Plus strokeWidth={4} />
                        <p className="text-sm font-bold">Create Video</p>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
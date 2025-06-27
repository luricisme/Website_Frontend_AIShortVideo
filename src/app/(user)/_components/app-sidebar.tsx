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
} from "@/components/ui/sidebar";
import Image from "next/image";
// import { usePathname } from "next/navigation";
import Link from "next/link";

import { icons } from "@/constants/icons";
import { ActiveMenuDetector } from "@/app/(user)/_components/active-menu-detector";

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
        url: "/profile",
        icon: <Image src={icons.profile.svg} alt="Profile" width={16} height={16} />,
    },
];

export function AppSidebar() {
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
                            <ActiveMenuDetector items={items} />
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2 gap-2 ">
                    <Link className={"w-full"} href={"/create-video"}>
                        <Button className="w-full flex items-center justify-center gap-2 cursor-pointer">
                            <Plus strokeWidth={4} />
                            <p className="text-sm font-bold">Create Video</p>
                        </Button>
                    </Link>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

"use client";

import { Video, Gauge, Users, Hash, Flag } from "lucide-react";
// import Logo from "@/../public/logo.png"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";
import Image from "next/image";

import { icons } from "@/constants/icons";
import { usePathname } from "next/navigation";

export const ITEMS_SIDEBAR = [
    {
        title: "Overview",
        url: "/admin/",
        icon: <Gauge />,
    },
    {
        title: "All Users",
        url: "/admin/users",
        icon: <Users />,
    },
    {
        title: "Videos",
        url: "/admin/videos",
        icon: <Video />,
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: <Video />,
    },
    {
        title: "Trending Tags",
        url: "/admin/tags",
        icon: <Hash />,
    },
    {
        title: "Reported Contents",
        url: "/admin/reported",
        icon: <Flag />,
    },
] as const;

export function AppSidebar() {
    const pathname = usePathname();

    const isActive = (url: string) => {
        if (url === "/admin/") {
            return pathname === "/admin";
        }
        return pathname === url || pathname.startsWith(url + "/");
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup className={"p-4"}>
                    <SidebarHeader className="mb-4 flex">
                        <Image src={icons.logo.png} alt="Logo" width={40} height={40} />
                        <p className="font-bold text-xl">Admin Panel</p>
                    </SidebarHeader>
                    {ITEMS_SIDEBAR.map((item) => {
                        if (item.title === "Categories" || item.title === "Reported Contents") {
                            return null;
                        }
                        return (
                            <SidebarGroupContent key={item.title + item.url}>
                                <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                            <Link href={item.url}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        );
                    })}
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

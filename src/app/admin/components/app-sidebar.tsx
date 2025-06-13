import { Video, Gauge, Users, Hash, Flag } from "lucide-react"
// import Logo from "@/../public/logo.png"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import React from "react";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup className={"p-4"}>
                    <SidebarHeader className="mb-4 flex">
                        <Image src={"/logo.png"} alt="Logo" width={40} height={40} />
                        <p className="font-bold text-xl">Admin Panel</p>
                    </SidebarHeader>
                    <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/"}>
                                        <Gauge />
                                        <span>Overview</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>User Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/users"}>
                                        <Users />
                                        <span>All Users</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>Content Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/videos"}>
                                        <Video />
                                        <span>Videos</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/categories"}>
                                        <Video />
                                        <span>Categories</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/tags"}>
                                        <Hash />
                                        <span>Trending Tags</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href={"/admin/reported"}>
                                        <Flag />
                                        <span>Reported Contents</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

"use client";

import { usePathname } from "next/navigation";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";

export function ActiveMenuDetector({
    items,
}: {
    items: { title: string; url: string; icon: React.ReactNode }[];
}) {
    const pathname = usePathname();

    return (
        <>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        isActive={
                            pathname === item.url ||
                            (pathname.startsWith(item.url) && item.url !== "/")
                        }
                    >
                        <Link href={item.url}>
                            {item.icon}
                            <span className="ml-2 font-medium text-sm text-gray-700 dark:text-gray-200">
                                {item.title}
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </>
    );
}

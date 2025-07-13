"use client";

import { ITEMS_SIDEBAR } from "@/app/admin/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();

    const getActiveTab = () => {
        return ITEMS_SIDEBAR.find((item) => item.url === pathname) || ITEMS_SIDEBAR[0];
    };

    return (
        <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-2xl font-bold">{getActiveTab().title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Bell size={25} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        2
                    </span>
                </div>
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center text-white">
                        AU
                    </div>
                    <span className="ml-2">Admin User</span>
                </div>
            </div>
        </div>
    );
};

export default Header;

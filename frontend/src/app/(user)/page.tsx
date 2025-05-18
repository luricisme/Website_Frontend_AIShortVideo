"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export default function Home() {
    return (
        <div>
            {/* Search bar */}
            <div className="flex items-center w-full gap-2 py-4">
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
                        <Button className="!font-semibold">Sign In</Button>
                        <Button variant="outline" className="!font-semibold">
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

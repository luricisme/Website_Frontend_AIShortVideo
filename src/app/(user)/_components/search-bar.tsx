import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// import { Button } from "@/components/ui/button";
import Link from "next/link";

const SearchBar = () => {
    return (
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
                    <Link href={"/signin"} className="!font-semibold">Sign In</Link>
                    <Link href={"/register"} className="!font-semibold">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SearchBar;

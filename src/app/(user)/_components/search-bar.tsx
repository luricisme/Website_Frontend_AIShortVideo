import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
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
                    <Button className="!font-semibold">
                        <Link href={"/user/signin"}>Sign In</Link>
                    </Button>
                    <Button variant="outline" className="!font-semibold">
                        <Link href={"/user/register"}>Register</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default SearchBar;

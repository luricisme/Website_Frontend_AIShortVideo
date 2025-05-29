import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Share, ThumbsUp } from "lucide-react";

const VideoActionDropdown = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-700">
                    <EllipsisVertical className="h-5 w-5" size={20} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-blue-500 transition-colors" />
                            <span className="text-sm">Thích</span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Share className="h-4 w-4 text-gray-500 hover:text-blue-500 transition-colors" />
                            <span className="text-sm">Chia sẽ</span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default VideoActionDropdown;

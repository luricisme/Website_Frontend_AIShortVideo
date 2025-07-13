import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

const VideoTableSkeleton = () => (
    <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-zinc-800">
                <TableCell>
                    <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-8 rounded bg-zinc-800" />
                        <Skeleton className="w-32 h-4 bg-zinc-800" />
                    </div>
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <Skeleton className="w-16 h-4 bg-zinc-800 ml-auto" />
                </TableCell>
                <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                        <Skeleton className="w-8 h-8 bg-zinc-800" />
                    </div>
                </TableCell>
            </TableRow>
        ))}
    </TableBody>
);

export default VideoTableSkeleton;

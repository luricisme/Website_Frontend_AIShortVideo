import Pagination from "@/components/table/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { VideoStats } from "@/hooks/use-dashboard-data";
import { BarChart3, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface VideoTableProps {
    videoStats: VideoStats[];
    onVideoSelect: (videoId: number) => void;
}

const VideoTable = ({ videoStats, onVideoSelect }: VideoTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Tính tổng số trang
    const totalPages = Math.ceil(videoStats.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return videoStats.slice(startIndex, endIndex);
    };

    // Xử lý việc thay đổi trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Tất cả video của tôi</CardTitle>
                <CardDescription className="text-zinc-400">
                    Quản lý và theo dõi hiệu suất của tất cả video
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                            <TableHead>Video</TableHead>
                            <TableHead className="text-right">Lượt xem</TableHead>
                            <TableHead className="text-right">Lượt thích</TableHead>
                            <TableHead className="text-right">Bình luận</TableHead>
                            <TableHead className="text-right">Chia sẻ</TableHead>
                            <TableHead className="text-right">Tăng trưởng</TableHead>
                            <TableHead className="text-center">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getCurrentPageData().map((video) => (
                            <TableRow
                                key={video.id}
                                className="hover:bg-zinc-800/50 border-zinc-800"
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-8 rounded overflow-hidden">
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                width={48}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="truncate max-w-[150px]">
                                            {video.title}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {video.views.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {video.likes.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {video.comments.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {video.shares.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="text-emerald-500">+{video.growth}%</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Button
                                            title="Chi tiết"
                                            onClick={() => onVideoSelect(video.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                        </Button>
                                        <Link href={`/video-analytics/${video.id}`}>
                                            <Button
                                                title="Phân tích"
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            >
                                                <BarChart3 className="w-4 h-4 mr-1" />
                                            </Button>
                                        </Link>
                                        <Button
                                            title="Chỉnh sửa video"
                                            variant="ghost"
                                            size="sm"
                                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => {
                                                // Xử lý chỉnh sửa video
                                                console.log(`Chỉnh sửa video với ID: ${video.id}`);
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            title="Xóa video"
                                            variant="ghost"
                                            size="sm"
                                            className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => {
                                                // Xử lý xóa video
                                                console.log(`Xóa video với ID: ${video.id}`);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={videoStats.length}
                    itemsPerPage={itemsPerPage}
                />
            </CardContent>
        </Card>
    );
};
export default VideoTable;

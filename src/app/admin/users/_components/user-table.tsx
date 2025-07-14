import {
    AlertCircle,
    // BarChart3,
    Eye,
    RefreshCw,
    PlayCircle,
    Edit,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/table/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserTableSkeleton from "@/app/(user)/dashboard/_components/video-table/video-table-skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USER_STATUS } from "@/constants/user-status";
import UserDeleteAlertDialog from "@/app/admin/users/_components/user-delete-alert-dialog";

interface UserTableProps {
    users: User[];
    isLoading: boolean;
    error: Error | null;
    onRefresh: () => void;
    // Pagination props
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const UserTable = ({
    users,
    isLoading,
    error,
    onRefresh,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: UserTableProps) => {
    const getUserStatusColor = (status: string) => {
        switch (status) {
            case USER_STATUS.ACTIVE:
                return "bg-green-100 text-green-800";
            case USER_STATUS.INACTIVE:
                return "bg-yellow-100 text-yellow-800";
            case USER_STATUS.PENDING:
                return "bg-blue-100 text-blue-800";
            case USER_STATUS.DELETED:
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center justify-between">
                    <span className="uppercase">All Users</span>
                    {error && (
                        <Button variant="outline" size="sm" onClick={onRefresh} className="ml-4">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    )}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Manage and track performance of all videos
                    {!isLoading && ` (${totalItems} videos)`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Error state */}
                {error && !isLoading && (
                    <Alert className="bg-red-900/20 border-red-500/50 text-red-200 mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Unable to load video list. Please try again.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                                <TableHead className="text-right">Videos</TableHead>
                                <TableHead className="text-right">Joined</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        {/* Loading state */}
                        {isLoading && <UserTableSkeleton />}

                        {/* Data state */}
                        {!isLoading && !error && (
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="hover:bg-zinc-800/50 border-zinc-800"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <div>
                                                        <Avatar className="w-10 h-10 bg-zinc-800 border border-zinc-700">
                                                            <AvatarImage
                                                                src={user.avatar || ""}
                                                                alt={user.username}
                                                            />
                                                            <AvatarFallback>
                                                                {user.username
                                                                    ?.charAt(0)
                                                                    .toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="truncate max-w-[150px] text-sm font-medium">
                                                            {user.firstName + " " + user.lastName ||
                                                                "Untitled Video"}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">
                                                            @{user.username || "unknown"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getUserStatusColor(
                                                        user.status || "ACTIVE"
                                                    )}`}
                                                >
                                                    <span className="text-sm">{user.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {user.totalVideo?.toLocaleString() || 0}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-sm">
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt
                                                          ).toLocaleDateString("en-US", {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          })
                                                        : "N/A"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center space-x-1">
                                                    {user.status !== "DELETED" && (
                                                        <>
                                                            <Link href={`/admin/users/${user.id}`}>
                                                                <Button
                                                                    title="View details"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={`/admin/users/update/${user.id}`}
                                                            >
                                                                <Button
                                                                    title="Edit user"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            <UserDeleteAlertDialog user={user} />
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            <div className="text-zinc-400">
                                                <div className="w-16 h-16 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                                                    <PlayCircle className="w-8 h-8 text-zinc-600" />
                                                </div>
                                                <p className="font-medium">No users found</p>
                                                <p className="text-sm mt-2">
                                                    It seems like there are no users available at
                                                    the moment. Please check back later or try
                                                    refreshing the page.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        )}
                    </Table>
                </div>

                {/* Pagination - only show if has data and not loading */}
                {!isLoading && !error && totalItems > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        totalItems={totalItems}
                        itemsPerPage={pageSize}
                        onItemsPerPageChange={onPageSizeChange}
                        isLoading={isLoading}
                        itemType="users"
                        showFullInfo={true}
                        updateUrlQuery={true} // Update URL query params for pagination
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default UserTable;

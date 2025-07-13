"use client";
import React, { useState } from "react";
import {
    TrendingUp,
    Hash,
    // Edit, Trash, Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/table/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTagsQuery, useNumberOfCreatedTagsQuery } from "@/queries/use-admin";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function TagManagementDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const {
        data: numberOfCreatedTags,
        isLoading: isLoadingNumberOfCreatedTags,
        isError: isErrorNumberOfCreatedTags,
        error: errorNumberOfCreatedTags,
    } = useNumberOfCreatedTagsQuery();

    const {
        data: tagsData,
        isLoading: isLoadingTags,
        isFetching: isFetchingTags,
        isError: isErrorTags,
        error: errorTags,
    } = useGetTagsQuery({
        pageNo: currentPage,
        pageSize: pageSize,
    });

    const tags = tagsData?.data.items || [];
    const totalTags = tagsData?.data.totalElements || 0;
    const totalPages = tagsData?.data.totalPage || 0;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Active Tags Card */}
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <Hash className="h-8 w-8 text-blue-500" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Created Tags</p>
                                <h1 className="text-3xl font-bold">
                                    {isLoadingNumberOfCreatedTags ? (
                                        <>
                                            <Skeleton className="h-8 w-24" />
                                        </>
                                    ) : isErrorNumberOfCreatedTags ? (
                                        <>
                                            <span className="text-red-500">
                                                {errorNumberOfCreatedTags.message}
                                            </span>
                                        </>
                                    ) : (
                                        <> {numberOfCreatedTags?.data}</>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-full w-15 h-15 flex items-center justify-center">
                                <TrendingUp className="h-8 w-8 text-green-600" strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-gray-500 mb-2">Popular Tags</p>
                                <h1 className="text-3xl font-bold">
                                    {isLoadingTags ? (
                                        <>
                                            <Skeleton className="h-8 w-24" />
                                        </>
                                    ) : isErrorTags ? (
                                        <>
                                            <span className="text-red-500">
                                                {errorTags.message}
                                            </span>
                                        </>
                                    ) : (
                                        <> {tags?.[0].tagName}</>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="py-2 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">All Tags</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lx:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-6">
                            {(isLoadingTags || isFetchingTags) &&
                                Array.from({ length: pageSize }).map((_, idx) => (
                                    <Card
                                        key={"skeleton-" + idx}
                                        className="overflow-hidden border border-neutral-800 bg-neutral-900"
                                    >
                                        <CardContent className="flex flex-col items-start justify-center py-6 gap-4">
                                            <div className="flex items-center w-full flex-grow gap-3 mb-2">
                                                <Skeleton className="h-8 w-8 rounded-full bg-neutral-800" />
                                                <Skeleton className="h-6 w-2/3 rounded bg-neutral-800" />
                                            </div>
                                            <Skeleton className="h-4 w-1/2 rounded bg-neutral-800" />
                                            {/* <div className="flex gap-3 w-full mt-2">
                                                <Skeleton className="h-8 w-1/2 rounded bg-neutral-800" />
                                                <Skeleton className="h-8 w-1/2 rounded bg-neutral-800" />
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                ))}

                            {isErrorTags && (
                                <div className="col-span-full flex flex-col items-center justify-center py-8">
                                    <span className="text-red-500 font-semibold mb-2">
                                        {errorTags?.message || "Failed to load tags."}
                                    </span>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        variant="outline"
                                    >
                                        Reload
                                    </Button>
                                </div>
                            )}

                            {!isLoadingTags &&
                                !isFetchingTags &&
                                !isErrorTags &&
                                tags.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-8">
                                        <span className="text-neutral-500 font-semibold mb-2">
                                            No tags found.
                                        </span>
                                    </div>
                                )}

                            {!isLoadingTags &&
                                !isFetchingTags &&
                                !isErrorTags &&
                                tags.length > 0 &&
                                tags.map((tag) => (
                                    <Card
                                        key={tag.tagName + tag.videoCnt}
                                        className="overflow-hidden border border-neutral-700 bg-neutral-900 shadow-sm"
                                    >
                                        <CardContent className="flex flex-col items-start justify-center py-6">
                                            <div className="flex items-center  w-full flex-grow gap-3 mb-2">
                                                <div className="bg-neutral-700 rounded-full p-3 flex items-center justify-center">
                                                    <Hash
                                                        className="h-6 w-6 text-neutral-200"
                                                        strokeWidth={2.2}
                                                    />
                                                </div>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <h2 className="font-bold max-w-full truncate text-lg  text-neutral-100">
                                                            {tag.tagName}
                                                        </h2>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-neutral-800 text-neutral-200 p-2 rounded">
                                                        {tag.tagName}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <div className="flex flex-grow w-full items-center gap-2 mb-4">
                                                <span className="text-neutral-400 text-sm">
                                                    Videos:
                                                </span>
                                                <span className="font-semibold text-base text-neutral-200">
                                                    {tag.videoCnt}
                                                </span>
                                            </div>
                                            {/* <div className="flex flex-grow w-full flex-wrap gap-3 mt-2">
                                                <Button
                                                    className="flex w-full items-center gap-1 px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-colors"
                                                    title="Edit tag"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    className="flex w-full items-center gap-1 px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-red-400 font-medium transition-colors"
                                                    title="Delete tag"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div> */}
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                        {!isLoadingTags && !isErrorTags && totalTags > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                                totalItems={totalTags}
                                itemsPerPage={pageSize}
                                onItemsPerPageChange={(size) => setPageSize(size)}
                                isLoading={isLoadingTags}
                                itemType="tags"
                                showFullInfo={true}
                                pageSizeOptions={[6, 12, 24, 48]}
                                updateUrlQuery={true}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

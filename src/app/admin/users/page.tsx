"use client";
import React, { useCallback, useMemo } from "react";
import { Search, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetUsersOverviewQuery, useGetUsersQuery } from "@/queries/use-admin";
import UserTable from "@/app/admin/users/_components/user-table";
import { USER_STATUS } from "@/constants/user-status";
import useUsersQueryConfig from "@/hooks/use-users-query-config";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { userSortCriteriaSchema, userSortDirectionSchema, UserStatus } from "@/types/user.types";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserManagementDashboard() {
    const router = useRouter();
    const queryConfig = useUsersQueryConfig();

    const currentPage = queryConfig.page || 1;
    const pageSize = queryConfig.pageSize || 5;
    const searchQuery = queryConfig.name || "";
    const selectedStatus = queryConfig.status || USER_STATUS.ALL;
    const sortCriteria = queryConfig.sort_criteria || "id";
    const sortDirection = queryConfig.sort_direction || "asc";

    const queryParams = useMemo(
        () => ({
            page: currentPage,
            pageSize: pageSize,
            name: searchQuery,
            status: selectedStatus,
            sort_criteria: sortCriteria,
            sort_direction: sortDirection,
        }),
        [currentPage, pageSize, searchQuery, selectedStatus, sortCriteria, sortDirection]
    );

    const {
        data: usersData,
        isLoading: isUsersLoading,
        isFetching: isUsersFetching,
        error: usersError,
        refetch: refetchUsers,
    } = useGetUsersQuery(queryParams);

    const users = usersData?.data?.items || [];
    const totalUsers = usersData?.data?.totalElements || 0;
    const totalPages = usersData?.data?.totalPage || 1;

    const {
        data: usersOverviewData,
        isLoading: isUsersOverviewLoading,
        isFetching: isUsersOverviewFetching,
        error: usersOverviewError,
    } = useGetUsersOverviewQuery();

    const newUsersToday = usersOverviewData?.data?.numNewUserToday || 0;
    const activeUsers = usersOverviewData?.data?.numActive || 0;
    const deactivatedUsers = usersOverviewData?.data?.numInactive || 0;

    const updateURL = useCallback(
        (updates: Record<string, string | number>) => {
            const searchParams = new URLSearchParams(window.location.search);

            Object.entries(updates).forEach(([key, value]) => {
                if (value === "" || value === null || value === undefined) {
                    searchParams.delete(key);
                } else {
                    searchParams.set(key, String(value));
                }
            });

            router.push(`?${searchParams.toString()}`);
        },
        [router]
    );

    const debouncedSearch = useDebounce((value: string) => {
        updateURL({ name: value, page: 1 });
    }, 400);

    const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            debouncedSearch(event.target.value);
        },
        [debouncedSearch]
    );

    const handleStatusChange = useCallback(
        (value: UserStatus) => {
            updateURL({ status: value, page: 1 });
        },
        [updateURL]
    );

    const handleSortCriteriaChange = useCallback(
        (value: string) => {
            updateURL({ sort_criteria: value, page: 1 });
        },
        [updateURL]
    );

    const handleSortDirectionChange = useCallback(
        (value: string) => {
            updateURL({ sort_direction: value, page: 1 });
        },
        [updateURL]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateURL({ page });
        },
        [updateURL]
    );

    const handlePageSizeChange = useCallback(
        (newPageSize: number) => {
            updateURL({ pageSize: newPageSize, page: 1 });
        },
        [updateURL]
    );

    const handleClearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-wrap">
                <StatsCard
                    title="New Users Today"
                    value={newUsersToday.toLocaleString()}
                    color="blue"
                    isLoading={isUsersOverviewLoading || isUsersOverviewFetching}
                    error={usersOverviewError}
                />
                <StatsCard
                    title="Active Users"
                    value={activeUsers.toLocaleString()}
                    isLoading={isUsersOverviewLoading || isUsersOverviewFetching}
                    error={usersOverviewError}
                    color="purple"
                />
                <StatsCard
                    title="Deactivated"
                    value={deactivatedUsers.toLocaleString()}
                    isLoading={isUsersOverviewLoading || isUsersOverviewFetching}
                    error={usersOverviewError}
                    color="red"
                />
            </div>

            {/* Filter Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">User Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name..."
                                    className="pl-8"
                                    defaultValue={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        <FilterSelect
                            label="Status"
                            value={selectedStatus}
                            onValueChange={handleStatusChange}
                            options={Object.entries(USER_STATUS).map(([key, value]) => ({
                                key,
                                value,
                            }))}
                            placeholder="All Statuses"
                        />

                        <FilterSelect
                            label="Sort By"
                            value={sortCriteria}
                            onValueChange={handleSortCriteriaChange}
                            options={userSortCriteriaSchema.options.map((field) => ({
                                key: field,
                                value: field,
                            }))}
                            placeholder="Sort Field"
                        />

                        <FilterSelect
                            label="Direction"
                            value={sortDirection}
                            onValueChange={handleSortDirectionChange}
                            options={userSortDirectionSchema.options.map((dir) => ({
                                key: dir,
                                value: dir,
                                label: dir === "asc" ? "Ascending" : "Descending",
                            }))}
                            placeholder="Direction"
                        />

                        <div className="flex items-end">
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* User Table */}
            <div className="mb-12">
                <UserTable
                    users={users}
                    isLoading={isUsersFetching || isUsersLoading}
                    error={usersError}
                    onRefresh={refetchUsers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalUsers}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </>
    );
}

interface StatsCardProps {
    title: string;
    value: string;
    color: "blue" | "purple" | "red";
    isLoading?: boolean;
    error?: Error | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, color, isLoading, error }) => {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-500",
        purple: "bg-purple-100 text-purple-500",
        red: "bg-red-100 text-red-500",
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center">
                    <div
                        className={`flex-shrink-0 p-2 rounded-full w-12 h-12 flex items-center justify-center mr-4 ${colorClasses[color]}`}
                    >
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    {isLoading ? (
                        <div>
                            <Skeleton className="h-6 w-24 mb-1" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    ) : error ? (
                        <div>
                            <p className="text-sm text-red-500">Error: {error.message}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{title}</p>
                            <h3 className="text-2xl font-bold">{value}</h3>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface FilterSelectProps<T extends string = string> {
    label: string;
    value: T;
    onValueChange: (value: T) => void;
    options: Array<{ key: string; value: T; label?: string }>;
    placeholder: string;
}

const FilterSelect = <T extends string = string>({
    label,
    value,
    onValueChange,
    options,
    placeholder,
}: FilterSelectProps<T>) => (
    <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map(({ key, value: optionValue, label: optionLabel }) => (
                    <SelectItem key={key} value={optionValue}>
                        {optionLabel || optionValue}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

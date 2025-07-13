import { useMemo } from "react";
import useQueryParams from "@/hooks/use-query-params";
import { UserSortCriteria, UserSortDirection, UserStatus } from "@/types/user.types";
import { USER_STATUS } from "@/constants/user-status";

export type UsersQueryConfig = {
    page?: number;
    pageSize?: number;
    name?: string;
    status?: UserStatus;
    sort_criteria?: UserSortCriteria;
    sort_direction?: UserSortDirection;
};

const DEFAULT_CONFIG: Required<UsersQueryConfig> = {
    page: 1,
    pageSize: 10,
    name: "",
    status: USER_STATUS.ALL,
    sort_criteria: "id" as UserSortCriteria,
    sort_direction: "asc" as UserSortDirection,
};

const useUsersQueryConfig = () => {
    const queryParams = useQueryParams();

    const queryConfig = useMemo(() => {
        const config: UsersQueryConfig = {
            page: queryParams.page ? parseInt(String(queryParams.page), 10) : undefined,
            pageSize: queryParams.pageSize ? parseInt(String(queryParams.pageSize), 10) : undefined,
            name: queryParams.name ? String(queryParams.name) : undefined,
            status: queryParams.status as UserStatus,
            sort_criteria: queryParams.sort_criteria as UserSortCriteria,
            sort_direction: queryParams.sort_direction as UserSortDirection,
        };

        // Remove undefined properties
        Object.keys(config).forEach(
            (key) =>
                config[key as keyof UsersQueryConfig] === undefined &&
                delete config[key as keyof UsersQueryConfig]
        );

        return config;
    }, [queryParams]);

    // Helper function to get values with defaults
    const getWithDefaults = useMemo(
        () => ({
            ...DEFAULT_CONFIG,
            ...queryConfig,
        }),
        [queryConfig]
    );

    return {
        ...queryConfig,
        // Provide easy access to values with defaults
        getWithDefaults: () => getWithDefaults,
        // Check if any filters are active
        hasActiveFilters: () => Object.keys(queryConfig).length > 0,
        // Get only the changed values from defaults
        getChangedValues: () => {
            const changed: Partial<Record<keyof UsersQueryConfig, string | number | undefined>> =
                {};
            Object.entries(queryConfig).forEach(([key, value]) => {
                if (value !== DEFAULT_CONFIG[key as keyof UsersQueryConfig]) {
                    changed[key as keyof UsersQueryConfig] = value;
                }
            });
            return changed;
        },
    };
};

export default useUsersQueryConfig;

import { z } from "zod";
import {
    dashboardOverviewSchema,
    platformStatisticSchema,
    viewStatisticSchema
} from "@/apiRequests/client";

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
export type PlatformStatistic = z.infer<typeof platformStatisticSchema>;
export type ViewStatistic = z.infer<typeof viewStatisticSchema>;
export type CategoryViewItem = z.infer<typeof categoryViewItemSchema>;
export type ViewsByCategoryData = z.infer<typeof viewsByCategoryDataSchema>;
export type ViewsByCategoryResponse = z.infer<typeof viewsByCategoryResponseSchema>;
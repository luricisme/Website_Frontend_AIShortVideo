import { z } from "zod";
import {
    dashboardOverviewSchema,
    platformStatisticSchema,
    viewStatisticSchema
} from "@/apiRequests/client";

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;
export type PlatformStatistic = z.infer<typeof platformStatisticSchema>;
export type ViewStatistic = z.infer<typeof viewStatisticSchema>;
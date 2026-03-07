import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/services/rtkQApi";
import { DashboardFullData, HealthPlanData } from "./types";
import { ApiResponse } from "../auth/types";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: axiosBaseQuery,
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({

        // Get Full Dashboard Data
        getUserDashboardFull: builder.query<
            ApiResponse<DashboardFullData>,
            { user_id: number }
        >({
            query: ({ user_id }) => ({
                url: `dashboard/user-dashboard-full?user_id=${user_id}`,
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        // Get Health Plan Data
        getHealthPlan: builder.query<
            ApiResponse<HealthPlanData>,
            { user_id: number }
        >({
            query: ({ user_id }) => ({
                url: `health-plan/dashboard?user_id=${user_id}`,
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

    }),
});

export const {
    useGetUserDashboardFullQuery,
    useGetHealthPlanQuery,
} = dashboardApi;
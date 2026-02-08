import { apiSlice } from '../../services/apiSlice';
import { AnalyticsSummary, CityStats } from '@/types';

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSummary: builder.query<AnalyticsSummary, { dateRange?: string }>({
            query: ({ dateRange }) => `/analytics/summary?range=${dateRange || 'today'}`,
            providesTags: ['Analytics'],
        }),
        getCityStats: builder.query<CityStats[], void>({
            query: () => '/analytics/cities',
            providesTags: ['Analytics'],
        }),
    }),
});

export const { useGetSummaryQuery, useGetCityStatsQuery } = analyticsApi;

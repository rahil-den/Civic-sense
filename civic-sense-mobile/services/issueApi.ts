// ============================================
// Civic Sense - Issue API Endpoints
// ============================================

import { api } from './api';
import type { Issue, CreateIssueRequest } from '../types';

export const issueApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all community issues
        getIssues: builder.query<Issue[], { status?: string; category?: string }>({
            query: (params) => ({
                url: '/issues',
                params,
            }),
            providesTags: ['Issue'],
        }),

        // Get issue by ID
        getIssueById: builder.query<Issue, string>({
            query: (id) => `/issues/${id}`,
            providesTags: (result, error, id) => [{ type: 'Issue', id }],
        }),

        // Get issues for current user
        getUserIssues: builder.query<Issue[], void>({
            query: () => '/issues/my-reports',
            providesTags: ['Issue'],
        }),

        // Create a new issue
        createIssue: builder.mutation<Issue, CreateIssueRequest>({
            query: (body) => ({
                url: '/issues',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Issue'],
        }),

        // Get nearby issues for map
        getNearbyIssues: builder.query<
            Issue[],
            { latitude: number; longitude: number; radius?: number }
        >({
            query: ({ latitude, longitude, radius = 5 }) => ({
                url: '/issues/nearby',
                params: { latitude, longitude, radius },
            }),
            providesTags: ['Issue'],
        }),
    }),
});

export const {
    useGetIssuesQuery,
    useGetIssueByIdQuery,
    useGetUserIssuesQuery,
    useCreateIssueMutation,
    useGetNearbyIssuesQuery,
} = issueApi;

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
            transformResponse: (response: any[]) => {
                return response.map((issue) => ({
                    id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    category: (issue.categoryId?.name?.toLowerCase().replace(' ', '_') || 'pothole') as any, // Simple slugify
                    status: issue.status.toLowerCase(),
                    imageUrl: issue.images?.[0] || 'https://placehold.co/400x300?text=No+Image',
                    location: {
                        latitude: issue.location?.coordinates?.[1] || 0,
                        longitude: issue.location?.coordinates?.[0] || 0,
                        address: issue.location?.address
                    },
                    userId: issue.userId?._id || issue.userId,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                }));
            },
            providesTags: ['Issue'],
        }),

        // Get issue by ID
        getIssueById: builder.query<Issue, string>({
            query: (id) => `/issues/${id}`,
            transformResponse: (response: any) => {
                const issue = response.issue || response;
                return {
                    id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    category: (issue.categoryId?.name?.toLowerCase().replace(' ', '_') || 'pothole') as any,
                    status: issue.status.toLowerCase(),
                    imageUrl: issue.images?.[0] || 'https://placehold.co/400x300?text=No+Image',
                    location: {
                        latitude: issue.location?.coordinates?.[1] || 0,
                        longitude: issue.location?.coordinates?.[0] || 0,
                        address: issue.location?.address
                    },
                    userId: issue.userId?._id || issue.userId,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                };
            },
            providesTags: (result, error, id) => [{ type: 'Issue', id }],
        }),

        // Get issues for current user
        getUserIssues: builder.query<Issue[], void>({
            query: () => '/issues?mine=true',
            transformResponse: (response: any[]) => {
                return response.map((issue) => ({
                    id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    category: (issue.categoryId?.name?.toLowerCase().replace(' ', '_') || 'pothole') as any,
                    status: issue.status.toLowerCase(),
                    imageUrl: issue.images?.[0] || 'https://placehold.co/400x300?text=No+Image',
                    location: {
                        latitude: issue.location?.coordinates?.[1] || 0,
                        longitude: issue.location?.coordinates?.[0] || 0,
                        address: issue.location?.address
                    },
                    userId: issue.userId?._id || issue.userId,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                }));
            },
            providesTags: ['Issue'],
        }),

        // Create a new issue
        createIssue: builder.mutation<Issue, any>({
            query: (body) => ({
                url: '/issues',
                method: 'POST',
                body: {
                    ...body,
                    categoryId: body.category, // Pass slug or ID? Backend expects ID. We will handle this in form.
                    location: {
                        type: 'Point',
                        coordinates: [body.location.longitude, body.location.latitude],
                        address: body.location.address
                    },
                    images: [body.imageUrl] // Backend expects array
                },
            }),
            invalidatesTags: ['Issue'],
        }),

        // Get issue categories
        getIssueCategories: builder.query<any[], void>({
            query: () => '/issues/categories',
        }),

        // Get nearby issues for map
        getNearbyIssues: builder.query<
            Issue[],
            { latitude: number; longitude: number; radius?: number }
        >({
            query: ({ latitude, longitude, radius = 5 }) => ({
                url: '/issues', // Fallback to all issues if nearby endpoint not ready, filtering locally if needed
                params: { latitude, longitude, radius },
            }),
            transformResponse: (response: any[]) => {
                return response.map((issue) => ({
                    id: issue._id,
                    title: issue.title,
                    description: issue.description,
                    category: (issue.categoryId?.name?.toLowerCase().replace(' ', '_') || 'pothole') as any,
                    status: issue.status.toLowerCase(),
                    imageUrl: issue.images?.[0] || 'https://placehold.co/400x300?text=No+Image',
                    location: {
                        latitude: issue.location?.coordinates?.[1] || 0,
                        longitude: issue.location?.coordinates?.[0] || 0,
                        address: issue.location?.address
                    },
                    userId: issue.userId?._id || issue.userId,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt,
                }));
            },
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
    useGetIssueCategoriesQuery,
} = issueApi;

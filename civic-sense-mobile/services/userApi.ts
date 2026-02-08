// ============================================
// Civic Sense - User API Endpoints
// ============================================

import { api } from './api';
import type { User, UserStats, AuthResponse } from '../types';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get current user profile
        getProfile: builder.query<User, void>({
            query: () => '/user/profile',
            providesTags: ['User'],
        }),

        // Get user stats
        getUserStats: builder.query<UserStats, void>({
            query: () => '/user/stats',
            providesTags: ['User'],
        }),

        // Google OAuth login
        googleLogin: builder.mutation<AuthResponse, { idToken: string }>({
            query: (body) => ({
                url: '/auth/google',
                method: 'POST',
                body,
            }),
        }),

        // Logout
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),

        // Download issue PDF
        downloadIssuePdf: builder.query<{ url: string }, string>({
            query: (issueId) => `/issues/${issueId}/pdf`,
        }),
    }),
});

export const {
    useGetProfileQuery,
    useGetUserStatsQuery,
    useGoogleLoginMutation,
    useLogoutMutation,
    useLazyDownloadIssuePdfQuery,
} = userApi;

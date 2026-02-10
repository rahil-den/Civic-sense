// ============================================
// Civic Sense - User API Endpoints
// ============================================

import { api } from './api';
import type { User, UserStats, AuthResponse } from '../types';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get current user profile
        getProfile: builder.query<User, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),

        // Get user stats
        getUserStats: builder.query<UserStats, void>({
            query: () => '/users/stats',
            providesTags: ['User'],
        }),

        // Update profile
        updateProfile: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: '/users/profile',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'],
        }),

        // Change password
        changePassword: builder.mutation<void, any>({
            query: (body) => ({
                url: '/users/change-password',
                method: 'PUT',
                body,
            }),
        }),

        // Delete account
        deleteAccount: builder.mutation<void, void>({
            query: () => ({
                url: '/users/me',
                method: 'DELETE',
            }),
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
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useGoogleLoginMutation,
    useLogoutMutation,
    useLazyDownloadIssuePdfQuery,
} = userApi;

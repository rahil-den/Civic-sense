// ============================================
// Civic Sense - Notification API Endpoints
// ============================================

import { api } from './api';
import type { Notification } from '../types';

export const notificationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get all notifications
        getNotifications: builder.query<Notification[], void>({
            query: () => '/notifications',
            providesTags: ['Notification'],
        }),

        // Mark notification as read
        markNotificationRead: builder.mutation<void, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),

        // Mark all notifications as read
        markAllNotificationsRead: builder.mutation<void, void>({
            query: () => ({
                url: '/notifications/read-all',
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
} = notificationApi;

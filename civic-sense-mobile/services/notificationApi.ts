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
            transformResponse: (response: any) => {
                return (response.notifications || []).map((n: any) => ({
                    id: n._id || n.id,
                    title: n.title,
                    description: n.message || n.description,
                    type: n.title?.includes('Resolved') ? 'resolved' :
                          n.title?.includes('Received') ? 'received' :
                          n.type === 'WARNING' ? 'warning' : 'status_update',
                    issueId: n.issueId,
                    read: n.isRead,
                    createdAt: n.createdAt,
                }));
            },
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

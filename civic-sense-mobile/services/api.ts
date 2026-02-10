// ============================================
// Civic Sense - RTK Query Base API
// ============================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// TODO: Update this to your actual backend URL
export const API_BASE_URL = process.env.API_BASE_URL_MAIN || 'http://192.168.1.9:3000/api';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Issue', 'User', 'Notification'],
    endpoints: () => ({}),
});

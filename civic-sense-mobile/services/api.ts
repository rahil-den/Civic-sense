// ============================================
// Civic Sense - RTK Query Base API
// ============================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

// TODO: Update this to your actual backend URL
const API_BASE_URL = 'https://api.civicsense.example.com/api';

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

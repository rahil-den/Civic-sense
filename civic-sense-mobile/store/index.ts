// ============================================
// Civic Sense - Redux Store Configuration
// ============================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import issueReducer from './slices/issueSlice';
import notificationReducer from './slices/notificationSlice';
import mapReducer from './slices/mapSlice';
import { api } from '../services/api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        issue: issueReducer,
        notification: notificationReducer,
        map: mapReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================
// Civic Sense - Map Slice
// ============================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MapRegion, IssueCategory } from '../../types';

interface MapState {
    userLocation: { latitude: number; longitude: number } | null;
    region: MapRegion | null;
    selectedCategories: IssueCategory[];
    hasLocationPermission: boolean | null;
    isLocationLoading: boolean;
    error: string | null;
}

const initialState: MapState = {
    userLocation: null,
    region: null,
    selectedCategories: ['bad_road', 'pothole', 'garbage', 'streetlight'],
    hasLocationPermission: null,
    isLocationLoading: false,
    error: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setUserLocation: (
            state,
            action: PayloadAction<{ latitude: number; longitude: number }>
        ) => {
            state.userLocation = action.payload;
            state.isLocationLoading = false;
        },
        setRegion: (state, action: PayloadAction<MapRegion>) => {
            state.region = action.payload;
        },
        setLocationPermission: (state, action: PayloadAction<boolean>) => {
            state.hasLocationPermission = action.payload;
            state.isLocationLoading = false;
        },
        toggleCategory: (state, action: PayloadAction<IssueCategory>) => {
            const index = state.selectedCategories.indexOf(action.payload);
            if (index >= 0) {
                state.selectedCategories.splice(index, 1);
            } else {
                state.selectedCategories.push(action.payload);
            }
        },
        setAllCategories: (state, action: PayloadAction<IssueCategory[]>) => {
            state.selectedCategories = action.payload;
        },
        setLocationLoading: (state, action: PayloadAction<boolean>) => {
            state.isLocationLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLocationLoading = false;
        },
    },
});

export const {
    setUserLocation,
    setRegion,
    setLocationPermission,
    toggleCategory,
    setAllCategories,
    setLocationLoading,
    setError,
} = mapSlice.actions;

export default mapSlice.reducer;

// ============================================
// Civic Sense - Issue Categories
// ============================================

import { COLORS } from './theme';
import type { IssueCategory } from '../types';

export interface CategoryConfig {
    id: IssueCategory;
    label: string;
    icon: string; // Ionicons name
    color: string;
    markerColor: string;
}

export const CATEGORIES: CategoryConfig[] = [
    {
        id: 'bad_road',
        label: 'Bad Road',
        icon: 'car-outline',
        color: COLORS.badRoad,
        markerColor: '#EF4444',
    },
    {
        id: 'pothole',
        label: 'Pothole',
        icon: 'warning-outline',
        color: COLORS.pothole,
        markerColor: '#F97316',
    },
    {
        id: 'garbage',
        label: 'Garbage',
        icon: 'trash-outline',
        color: COLORS.garbage,
        markerColor: '#22C55E',
    },
    {
        id: 'streetlight',
        label: 'Streetlight',
        icon: 'bulb-outline',
        color: COLORS.streetlight,
        markerColor: '#EAB308',
    },
];

export const getCategoryById = (id: IssueCategory): CategoryConfig | undefined => {
    return CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryColor = (id: IssueCategory): string => {
    return getCategoryById(id)?.color || COLORS.textMuted;
};

export const getCategoryLabel = (id: IssueCategory): string => {
    return getCategoryById(id)?.label || 'Unknown';
};

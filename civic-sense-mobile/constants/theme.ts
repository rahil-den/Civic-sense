// ============================================
// Civic Sense - Theme Constants
// ============================================

export const COLORS = {
    // Primary - Government Blue
    primary: '#2563EB',
    primaryDark: '#1E40AF',
    primaryLight: '#3B82F6',

    // Status Colors
    reported: '#F59E0B',      // Amber
    reportedBg: '#FEF3C7',
    inProgress: '#0284C7',    // Sky Blue
    inProgressBg: '#E0F2FE',
    solved: '#16A34A',        // Green
    solvedBg: '#DCFCE7',
    completed: '#059669',     // Emerald
    completedBg: '#D1FAE5',

    // Category Colors (for map markers)
    badRoad: '#EF4444',       // Red
    pothole: '#F97316',       // Orange
    garbage: '#22C55E',       // Green
    streetlight: '#EAB308',   // Yellow

    // Neutral
    background: '#F9FAFB',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Text
    textPrimary: '#111827',
    textSecondary: '#374151',
    textMuted: '#6B7280',
    textLight: '#9CA3AF',

    // Semantic
    error: '#DC2626',
    errorBg: '#FEE2E2',
    success: '#16A34A',
    successBg: '#DCFCE7',
    warning: '#D97706',
    warningBg: '#FEF3C7',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const FONT_SIZES = {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
};

export const FONT_WEIGHTS = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const BORDER_RADIUS = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 8,
    },
};

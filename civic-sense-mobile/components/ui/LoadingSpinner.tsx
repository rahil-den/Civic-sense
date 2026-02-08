// ============================================
// Civic Sense - Loading Spinner Component
// ============================================

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../../constants/theme';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    message,
    size = 'large',
    fullScreen = false,
}: LoadingSpinnerProps) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={COLORS.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    message: {
        marginTop: 12,
        fontSize: FONT_SIZES.md,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
});

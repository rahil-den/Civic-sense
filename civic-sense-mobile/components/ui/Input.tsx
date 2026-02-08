// ============================================
// Civic Sense - Input Component
// ============================================

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helper?: string;
}

export default function Input({
    label,
    error,
    helper,
    style,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    props.multiline && styles.multiline,
                    style,
                ]}
                placeholderTextColor={COLORS.textLight}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            {helper && !error && <Text style={styles.helper}>{helper}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    inputFocused: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: SPACING.md,
    },
    error: {
        marginTop: SPACING.xs,
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
    },
    helper: {
        marginTop: SPACING.xs,
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
});

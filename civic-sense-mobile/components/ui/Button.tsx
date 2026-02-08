// ============================================
// Civic Sense - Button Component
// ============================================

import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.base,
                styles[variant],
                styles[size],
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? COLORS.surface : COLORS.primary}
                />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            styles[`${variant}Text` as keyof typeof styles] as TextStyle,
                            styles[`${size}Text` as keyof typeof styles] as TextStyle,
                            icon && { marginLeft: SPACING.sm },
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.md,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },

    // Variants
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.borderLight,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    sm: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    md: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
    },
    lg: {
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
    },

    // Text base
    text: {
        fontWeight: '600',
    },

    // Text variants
    primaryText: {
        color: COLORS.surface,
    },
    secondaryText: {
        color: COLORS.textPrimary,
    },
    outlineText: {
        color: COLORS.primary,
    },
    ghostText: {
        color: COLORS.primary,
    },

    // Text sizes
    smText: {
        fontSize: FONT_SIZES.sm,
    },
    mdText: {
        fontSize: FONT_SIZES.md,
    },
    lgText: {
        fontSize: FONT_SIZES.lg,
    },
});

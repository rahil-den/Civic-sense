// ============================================
// Civic Sense - Issue Preview Card (for Map)
// ============================================

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getCategoryLabel, getCategoryColor } from '../constants/categories';
import type { Issue } from '../types';

interface IssuePreviewCardProps {
    issue: Issue;
    onPress: () => void;
    onClose: () => void;
}

const STATUS_LABELS: Record<string, string> = {
    reported: 'Reported',
    in_progress: 'In Progress',
    solved: 'Solved',
    completed: 'Completed',
};

export default function IssuePreviewCard({
    issue,
    onPress,
    onClose,
}: IssuePreviewCardProps) {
    return (
        <View style={styles.container}>
            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
                {/* Image */}
                <Image source={{ uri: issue.imageUrl }} style={styles.image} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Category */}
                    <Text
                        style={[styles.category, { color: getCategoryColor(issue.category) }]}
                    >
                        {getCategoryLabel(issue.category)}
                    </Text>

                    {/* Title */}
                    <Text style={styles.title} numberOfLines={2}>
                        {issue.title}
                    </Text>

                    {/* Bottom row */}
                    <View style={styles.bottomRow}>
                        {/* Distance */}
                        {issue.distance && (
                            <View style={styles.infoItem}>
                                <Ionicons name="navigate-outline" size={14} color={COLORS.textMuted} />
                                <Text style={styles.infoText}>{issue.distance}</Text>
                            </View>
                        )}

                        {/* Status */}
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{STATUS_LABELS[issue.status]}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: SPACING.lg,
        right: SPACING.lg,
    },
    closeBtn: {
        position: 'absolute',
        top: -12,
        right: -4,
        zIndex: 10,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 4,
        ...SHADOWS.sm,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.md,
    },
    image: {
        width: 90,
        height: 90,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
        justifyContent: 'space-between',
    },
    category: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.textPrimary,
        lineHeight: 20,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 4,
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    statusBadge: {
        backgroundColor: COLORS.primaryLight + '20',
        paddingVertical: 2,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.primary,
    },
});

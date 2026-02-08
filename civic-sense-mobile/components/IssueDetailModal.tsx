// ============================================
// Civic Sense - Issue Detail Modal Component
// ============================================

import React from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getCategoryLabel, getCategoryColor } from '../constants/categories';
import type { Issue } from '../types';

interface IssueDetailModalProps {
    visible: boolean;
    issue: Issue | null;
    onClose: () => void;
}

const STATUS_CONFIG = {
    reported: { label: 'Reported', bg: COLORS.reportedBg, color: COLORS.reported },
    in_progress: { label: 'In Progress', bg: COLORS.inProgressBg, color: COLORS.inProgress },
    solved: { label: 'Solved', bg: COLORS.solvedBg, color: COLORS.solved },
    completed: { label: 'Completed', bg: COLORS.completedBg, color: COLORS.completed },
};

export default function IssueDetailModal({
    visible,
    issue,
    onClose,
}: IssueDetailModalProps) {
    if (!issue) return null;

    const statusConfig = STATUS_CONFIG[issue.status];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container} onPress={() => { }}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Image */}
                        <Image source={{ uri: issue.imageUrl }} style={styles.image} />

                        {/* Content */}
                        <View style={styles.content}>
                            {/* Category & Status */}
                            <View style={styles.badges}>
                                <View
                                    style={[
                                        styles.categoryBadge,
                                        { backgroundColor: getCategoryColor(issue.category) + '20' },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            { color: getCategoryColor(issue.category) },
                                        ]}
                                    >
                                        {getCategoryLabel(issue.category)}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: statusConfig.bg },
                                    ]}
                                >
                                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                                        {statusConfig.label}
                                    </Text>
                                </View>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{issue.title}</Text>

                            {/* Description */}
                            <Text style={styles.description}>{issue.description}</Text>

                            {/* Location */}
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={18} color={COLORS.textMuted} />
                                <Text style={styles.infoText}>
                                    {issue.location.address || 'Location detected'}
                                </Text>
                            </View>

                            {/* Time */}
                            <View style={styles.infoRow}>
                                <Ionicons name="time-outline" size={18} color={COLORS.textMuted} />
                                <Text style={styles.infoText}>
                                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </View>

                            {issue.distance && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="navigate-outline" size={18} color={COLORS.textMuted} />
                                    <Text style={styles.infoText}>{issue.distance} away</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: '85%',
        ...SHADOWS.lg,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.lg,
        right: SPACING.lg,
        zIndex: 10,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: SPACING.sm,
        ...SHADOWS.sm,
    },
    image: {
        width: '100%',
        height: 220,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
    },
    content: {
        padding: SPACING.xl,
    },
    badges: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    categoryBadge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
    },
    categoryText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    statusBadge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
    },
    statusText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    infoText: {
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.md,
        color: COLORS.textMuted,
    },
});

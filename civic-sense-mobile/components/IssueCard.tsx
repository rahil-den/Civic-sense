// ============================================
// Civic Sense - Issue Card Component
// ============================================

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getCategoryLabel, getCategoryColor } from '../constants/categories';
import type { Issue, IssueStatus } from '../types';

interface IssueCardProps {
  issue: Issue;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<IssueStatus, { label: string; bg: string; color: string }> = {
  reported: { label: 'Reported', bg: COLORS.reportedBg, color: COLORS.reported },
  in_progress: { label: 'In Progress', bg: COLORS.inProgressBg, color: COLORS.inProgress },
  solved: { label: 'Solved', bg: COLORS.solvedBg, color: COLORS.solved },
  completed: { label: 'Completed', bg: COLORS.completedBg, color: COLORS.completed },
};

// Format date to "X days ago"
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays} days ago`;
}

export default function IssueCard({ issue, onPress }: IssueCardProps) {
  const statusKey = issue.status.toLowerCase() as IssueStatus;
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.reported;
  const categoryColor = getCategoryColor(issue.category);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image */}
      <Image source={{ uri: issue.imageUrl }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {issue.title}
        </Text>

        <Text style={[styles.category, { color: categoryColor }]}>
          {getCategoryLabel(issue.category)}
        </Text>

        <View style={styles.row}>
          {issue.distance && (
            <Text style={styles.meta}>{issue.distance}</Text>
          )}
          <Text style={styles.meta}>{formatTimeAgo(issue.createdAt)}</Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={styles.statusContainer}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  statusContainer: {
    justifyContent: 'center',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
});

// ============================================
// Civic Sense - Issue Detail Screen
// ============================================

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform, // Added
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
// Dynamic Map Import
let MapView: any = View;
let Marker: any = View;
let UrlTile: any = View;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    UrlTile = Maps.UrlTile;
  } catch (e) {
    console.warn('Maps load failed', e);
  }
}
import { useAppSelector } from '../../store';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { getCategoryLabel, getCategoryColor } from '../../constants/categories';
import type { IssueStatus } from '../../types';

const STATUS_CONFIG: Record<IssueStatus, { label: string; bg: string; color: string }> = {
  reported: { label: 'Reported', bg: COLORS.reportedBg, color: COLORS.reported },
  in_progress: { label: 'In Progress', bg: COLORS.inProgressBg, color: COLORS.inProgress },
  solved: { label: 'Solved', bg: COLORS.solvedBg, color: COLORS.solved },
  completed: { label: 'Completed', bg: COLORS.completedBg, color: COLORS.completed },
};

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { issues } = useAppSelector((state) => state.issue);

  const issue = issues.find((i) => i.id === id);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (!issue) {
    return <LoadingSpinner message="Loading issue details..." fullScreen />;
  }

  const statusKey = issue.status.toLowerCase() as IssueStatus;
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.reported;
  const categoryColor = getCategoryColor(issue.category);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <Image source={{ uri: issue.imageUrl }} style={styles.image} />

        {/* Badges */}
        <View style={styles.badges}>
          <View
            style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}
          >
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {getCategoryLabel(issue.category)}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
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

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {issue.location.address || `${issue.location.latitude.toFixed(4)}, ${issue.location.longitude.toFixed(4)}`}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Reported On</Text>
              <Text style={styles.infoValue}>
                {new Date(issue.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {issue.distance && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="navigate" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Distance</Text>
                  <Text style={styles.infoValue}>{issue.distance} away</Text>
                </View>
              </View>
            </>
          )}

          <View style={{ marginTop: 16, height: 150, borderRadius: 12, overflow: 'hidden' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: issue.location.latitude,
                longitude: issue.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <UrlTile
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                zIndex={-1}
              />
              <Marker
                coordinate={{
                  latitude: issue.location.latitude,
                  longitude: issue.location.longitude,
                }}
              />
            </MapView>
          </View>
        </View>

        {/* Timeline (placeholder) */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>
          <View style={styles.timelineCard}>
            <TimelineItem
              icon="checkmark-circle"
              title="Issue Reported"
              time={new Date(issue.createdAt).toLocaleDateString()}
              isFirst
              isDone
            />
            <TimelineItem
              icon="time"
              title="Under Review"
              time="Pending"
              isDone={issue.status !== 'reported'}
            />
            <TimelineItem
              icon="construct"
              title="In Progress"
              time={issue.status === 'in_progress' ? 'Current' : 'Pending'}
              isDone={issue.status === 'solved' || issue.status === 'completed'}
            />
            <TimelineItem
              icon="checkmark-done-circle"
              title="Resolved"
              time={issue.status === 'solved' || issue.status === 'completed' ? 'Done' : 'Pending'}
              isDone={issue.status === 'solved' || issue.status === 'completed'}
              isLast
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TimelineItem({
  icon,
  title,
  time,
  isFirst = false,
  isLast = false,
  isDone = false,
}: {
  icon: string;
  title: string;
  time: string;
  isFirst?: boolean;
  isLast?: boolean;
  isDone?: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        {!isFirst && (
          <View
            style={[
              styles.timelineLine,
              styles.timelineLineTop,
              isDone && styles.timelineLineDone,
            ]}
          />
        )}
        <View
          style={[
            styles.timelineIcon,
            isDone && styles.timelineIconDone,
          ]}
        >
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={16}
            color={isDone ? COLORS.surface : COLORS.textMuted}
          />
        </View>
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              styles.timelineLineBottom,
              isDone && styles.timelineLineDone,
            ]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, isDone && styles.timelineTitleDone]}>
          {title}
        </Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  image: {
    width: '100%',
    height: 250,
  },
  badges: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.sm,
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
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  infoCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    ...SHADOWS.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  timelineSection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 32,
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    backgroundColor: COLORS.border,
    flex: 1,
  },
  timelineLineTop: {
    marginBottom: 4,
  },
  timelineLineBottom: {
    marginTop: 4,
  },
  timelineLineDone: {
    backgroundColor: COLORS.success,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconDone: {
    backgroundColor: COLORS.success,
  },
  timelineContent: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  timelineTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  timelineTitleDone: {
    color: COLORS.textPrimary,
  },
  timelineTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  markAsRead,
  markAllAsRead,
} from '../../store/slices/notificationSlice';
import { useGetNotificationsQuery } from '../../services/notificationApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import type { Notification, NotificationType } from '../../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Issue Resolved',
    description: 'Your report "Garbage overflow at Park Corner" has been resolved.',
    type: 'resolved',
    issueId: '3',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Status Update',
    description: '"Large pothole on Main Street" is now in progress.',
    type: 'status_update',
    issueId: '1',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Report Received',
    description: 'Thank you for reporting "Damaged road near school". We\'re on it!',
    type: 'received',
    issueId: '4',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Warning',
    description: 'High traffic area reported near your location. Stay cautious.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const ICON_CONFIG: Record<NotificationType, { icon: string; color: string; bgColor: string }> = {
  resolved: { icon: 'checkmark-circle', color: '#10B981', bgColor: '#ECFDF5' },
  status_update: { icon: 'sync-circle', color: '#3B82F6', bgColor: '#EFF6FF' },
  received: { icon: 'mail', color: '#8B5CF6', bgColor: '#F5F3FF' },
  warning: { icon: 'warning', color: '#F59E0B', bgColor: '#FFFBEB' },
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 60) return `${diffInMins}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays}d`;
}

export default function UpdatesScreen() {
  const dispatch = useAppDispatch();
  // const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notification);
  const { data: notifications = [], isLoading, refetch } = useGetNotificationsQuery();

  // Calculate unread count globally if needed, or just locally
  const unreadCount = notifications.filter(n => !n.read).length;

  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Enable LayoutAnimation on Android
  React.useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // Removed useEffect for mock data

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleNotificationPress = (notification: Notification) => {
    // Toggle expanded state with animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === notification.id ? null : notification.id);

    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
  };

  const handleViewIssue = (issueId?: string) => {
    if (issueId) {
      router.push({ pathname: '/issue-detail', params: { id: issueId } });
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const renderNotification = ({ item, index }: { item: Notification; index: number }) => {
    const config = ICON_CONFIG[item.type];
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.card, !item.read && styles.cardUnread, isExpanded && styles.cardExpanded]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, isExpanded && styles.cardTitleExpanded]}>{item.title}</Text>
            <Text style={styles.cardTime}>{formatTimeAgo(item.createdAt)}</Text>
          </View>
          <Text style={styles.cardDesc} numberOfLines={isExpanded ? undefined : 2}>
            {item.description}
          </Text>

          {/* Expanded Actions */}
          {isExpanded && (
            <View style={styles.expandedActions}>
              {item.issueId && (
                <TouchableOpacity
                  style={styles.viewIssueBtn}
                  onPress={() => handleViewIssue(item.issueId)}
                >
                  <Ionicons name="eye-outline" size={16} color="#fff" />
                  <Text style={styles.viewIssueBtnText}>View Issue</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.dismissBtn}>
                <Ionicons name="close-circle-outline" size={16} color={COLORS.textMuted} />
                <Text style={styles.dismissBtnText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Unread indicator */}
        {!item.read && <View style={styles.unreadDot} />}

        {/* Expand indicator */}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={COLORS.textLight}
          style={styles.expandIcon}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading && notifications.length === 0) {
    return <LoadingSpinner message="Loading notifications..." fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{unreadCount} new notifications</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>
            You'll receive updates when there's activity on your reports.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primary + '12',
    borderRadius: 20,
    gap: 6,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  separator: {
    height: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.sm,
  },
  cardUnread: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 10,
    marginTop: 4,
  },
  cardExpanded: {
    backgroundColor: '#F8FAFF',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
  },
  cardTitleExpanded: {
    color: COLORS.primary,
  },
  expandedActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  viewIssueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  viewIssueBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  dismissBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  expandIcon: {
    marginLeft: 8,
    marginTop: 16,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

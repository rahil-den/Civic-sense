// ============================================
// Urban City - Home Tab (Minimal Professional Design)
// ============================================

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import IssueCard from '../../components/IssueCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useAppSelector, useAppDispatch } from '../../store';
import { setIssues } from '../../store/slices/issueSlice';
import type { Issue, IssueStatus } from '../../types';

// Mock data for development
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'There is a large pothole near the intersection that is causing damage to vehicles.',
    category: 'pothole',
    location: { latitude: 19.076, longitude: 72.8777, address: 'Main Street, Mumbai' },
    status: 'in_progress',
    imageUrl: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400',
    userId: '1',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    distance: '0.3 km',
  },
  {
    id: '2',
    title: 'Broken streetlight on Oak Avenue',
    description: 'The streetlight has been broken for two weeks, making the area unsafe at night.',
    category: 'streetlight',
    location: { latitude: 19.082, longitude: 72.881, address: 'Oak Avenue, Mumbai' },
    status: 'reported',
    imageUrl: 'https://images.unsplash.com/photo-1597764699513-5e48b3c9d673?w=400',
    userId: '2',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    distance: '0.8 km',
  },
  {
    id: '3',
    title: 'Garbage overflow at Park Corner',
    description: 'The garbage bins are overflowing and creating an unhygienic environment.',
    category: 'garbage',
    location: { latitude: 19.071, longitude: 72.875, address: 'Park Corner, Mumbai' },
    status: 'solved',
    imageUrl: 'https://images.unsplash.com/photo-1581579185169-5f4f5a61b4dc?w=400',
    userId: '1',
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    distance: '1.2 km',
  },
  {
    id: '4',
    title: 'Damaged road near school',
    description: 'The road surface is severely damaged near the school entrance.',
    category: 'bad_road',
    location: { latitude: 19.068, longitude: 72.873, address: 'School Road, Mumbai' },
    status: 'reported',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    userId: '3',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    distance: '1.5 km',
  },
];

type FilterType = 'all' | 'reported' | 'in_progress' | 'solved';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { issues, isLoading, error } = useAppSelector(
    (state) => state.issue
  );

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (issues.length === 0) {
      dispatch(setIssues(MOCK_ISSUES));
    }
  }, []);

  // Filter issues
  const filteredIssues = activeFilter === 'all'
    ? issues
    : issues.filter((item) => item.status === activeFilter);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleIssuePress = (issue: Issue) => {
    router.push({ pathname: '/issue-detail', params: { id: issue.id } });
  };

  if (isLoading && issues.length === 0) {
    return <LoadingSpinner message="Loading issues..." fullScreen />;
  }

  if (error && issues.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(setIssues(MOCK_ISSUES))}
      />
    );
  }

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'reported', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'solved', label: 'Resolved' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Urban City</Text>
        <Text style={styles.headerSubtitle}>Community Issues</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterTab, activeFilter === filter.key && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text style={[styles.filterText, activeFilter === filter.key && styles.filterTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Issues Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
        </Text>
      </View>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <EmptyState
          icon="checkmark-done-circle-outline"
          title="No issues found"
          description="No issues match your current filter."
        />
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IssueCard issue={item} onPress={() => handleIssuePress(item)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
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
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  countRow: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 12,
  },
});

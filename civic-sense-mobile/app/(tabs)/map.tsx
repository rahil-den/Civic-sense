// ============================================
// Urban City - Map Tab (Interactive Map Placeholder)
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setUserLocation,
  setLocationPermission,
  setLocationLoading,
} from '../../store/slices/mapSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { CATEGORIES, getCategoryColor, getCategoryLabel } from '../../constants/categories';
import type { Issue } from '../../types';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.45; // 45% of screen height for map

// Dummy markers for demonstration with coordinates
const DUMMY_MARKERS: { id: string; category: string; title: string; status: string; latitude: number; longitude: number }[] = [
  { id: 'd1', category: 'pothole', title: 'Pothole on Main St', status: 'reported', latitude: 19.0760, longitude: 72.8777 },
  { id: 'd2', category: 'garbage', title: 'Garbage pile near park', status: 'in_progress', latitude: 19.0800, longitude: 72.8820 },
  { id: 'd3', category: 'streetlight', title: 'Broken streetlight', status: 'reported', latitude: 19.0720, longitude: 72.8750 },
  { id: 'd4', category: 'drainage', title: 'Blocked drain', status: 'solved', latitude: 19.0780, longitude: 72.8700 },
];

export default function MapScreen() {
  const dispatch = useAppDispatch();
  const { userLocation, hasLocationPermission, isLocationLoading, selectedCategories } =
    useAppSelector((state) => state.map);
  const { issues } = useAppSelector((state) => state.issue);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    dispatch(setLocationLoading(true));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      dispatch(setLocationPermission(granted));

      if (granted) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        dispatch(
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          })
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      dispatch(setLocationPermission(false));
    } finally {
      dispatch(setLocationLoading(false));
    }
  };

  // Open device settings to enable location
  const openSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      Alert.alert(
        'Unable to Open Settings',
        'Please open your device Settings and enable location for this app.',
        [{ text: 'OK' }]
      );
    }
  };

  // Filter issues
  const filteredIssues = activeFilter
    ? issues.filter((issue) => issue.category === activeFilter)
    : issues.filter((issue) => selectedCategories.includes(issue.category));

  const handleIssuePress = (issue: Issue) => {
    router.push({ pathname: '/issue-detail', params: { id: issue.id } });
  };

  if (isLocationLoading) {
    return <LoadingSpinner message="Getting your location..." fullScreen />;
  }

  if (hasLocationPermission === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIcon}>
            <Ionicons name="location-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.permissionTitle}>Enable Location</Text>
          <Text style={styles.permissionText}>
            We need access to your location to show nearby civic issues.
          </Text>

          {/* Try Again Button */}
          <TouchableOpacity style={styles.permissionButton} onPress={requestLocationPermission}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.permissionButtonText}>Try Again</Text>
          </TouchableOpacity>

          {/* Open Settings Button */}
          <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
            <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Map</Text>
        <View style={styles.locationBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      {/* Map Placeholder (Expo Go doesn't support native maps) */}
      <View style={styles.mapContainer}>
        {/* Styled Map Background */}
        <View style={styles.mapBackground}>
          {/* Grid pattern overlay */}
          <View style={styles.gridOverlay}>
            {[...Array(5)].map((_, i) => (
              <View key={`h${i}`} style={[styles.gridLineH, { top: `${20 * (i + 1)}%` }]} />
            ))}
            {[...Array(4)].map((_, i) => (
              <View key={`v${i}`} style={[styles.gridLineV, { left: `${25 * (i + 1)}%` }]} />
            ))}
          </View>

          {/* Center marker */}
          <View style={styles.centerMarker}>
            <Ionicons name="location" size={40} color={COLORS.primary} />
          </View>

          {/* Map markers */}
          {DUMMY_MARKERS.map((marker, idx) => (
            <View
              key={marker.id}
              style={[
                styles.mapMarker,
                {
                  top: `${20 + idx * 15}%`,
                  left: `${15 + idx * 20}%`,
                }
              ]}
            >
              <View style={[styles.markerPin, { backgroundColor: getCategoryColor(marker.category as any) }]}>
                <Ionicons name="alert-circle" size={14} color="#fff" />
              </View>
            </View>
          ))}
        </View>

        {/* Map Overlay Info */}
        <View style={styles.mapInfoOverlay}>
          <Text style={styles.mapText}>📍 Interactive Map</Text>
          <Text style={styles.mapSubtext}>
            {userLocation
              ? `${userLocation.latitude.toFixed(4)}°N, ${userLocation.longitude.toFixed(4)}°E`
              : 'Getting location...'}
          </Text>
        </View>

        {/* Floating Location Button */}
        <TouchableOpacity style={styles.myLocationBtn} onPress={requestLocationPermission}>
          <Ionicons name="locate" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter - CLEARLY VISIBLE */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.filterChip, !activeFilter && styles.filterChipActive]}
            onPress={() => setActiveFilter(null)}
          >
            <Text style={[styles.filterChipText, !activeFilter && styles.filterChipTextActive]}>
              All ({issues.length})
            </Text>
          </TouchableOpacity>
          {CATEGORIES.map((cat) => {
            const count = issues.filter(i => i.category === cat.id).length;
            const isActive = activeFilter === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  isActive && { backgroundColor: cat.color },
                ]}
                onPress={() => setActiveFilter(isActive ? null : cat.id)}
              >
                <View style={[styles.filterDot, { backgroundColor: isActive ? '#fff' : cat.color }]} />
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {cat.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Issues List */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          {filteredIssues.length} Nearby {filteredIssues.length === 1 ? 'Issue' : 'Issues'}
        </Text>
        <ScrollView
          style={styles.issuesList}
          contentContainerStyle={styles.issuesContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredIssues.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={32} color={COLORS.textLight} />
              <Text style={styles.emptyText}>No issues in this category</Text>
            </View>
          ) : (
            filteredIssues.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={styles.issueCard}
                onPress={() => handleIssuePress(issue)}
                activeOpacity={0.7}
              >
                <View style={[styles.cardStrip, { backgroundColor: getCategoryColor(issue.category) }]} />
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{issue.title}</Text>
                  <Text style={styles.cardCategory}>{getCategoryLabel(issue.category)}</Text>
                  <View style={styles.cardMeta}>
                    <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
                    <Text style={styles.cardLocation} numberOfLines={1}>
                      {issue.location?.address || 'Location'}
                    </Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(issue.status) }]} />
                    <Text style={[styles.cardStatus, { color: getStatusColor(issue.status) }]}>
                      {formatStatus(issue.status)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'reported': return COLORS.warning;
    case 'in_progress': return COLORS.inProgress;
    case 'solved':
    case 'completed': return COLORS.success;
    default: return COLORS.textMuted;
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case 'reported': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'solved':
    case 'completed': return 'Resolved';
    default: return status;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  mapContainer: {
    marginHorizontal: 16,
    height: MAP_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E8F4FD',
    ...SHADOWS.md,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#E8F4FD',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLineH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  gridLineV: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
  mapMarker: {
    position: 'absolute',
  },
  markerPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  mapInfoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  mapText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  mapSubtext: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
  markerLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  markerLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    maxWidth: 100,
  },
  filterSection: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  filterScroll: {
    gap: 10,
    paddingRight: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listSection: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  issuesList: {
    flex: 1,
  },
  issuesContent: {
    paddingBottom: 100,
    gap: 10,
  },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  cardStrip: {
    width: 5,
    alignSelf: 'stretch',
  },
  cardBody: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  cardCategory: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  cardLocation: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
  cardStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  settingsButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
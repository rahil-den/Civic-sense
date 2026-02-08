import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
  TextInput,
  Modal,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { socketService } from '../../services/socketService';
import EmptyState from '../../components/ui/EmptyState';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import type { Issue } from '../../types';

const { width } = Dimensions.get('window');

type TabType = 'profile' | 'reports' | 'about';

// Issue categories for About section
const ISSUE_CATEGORIES = [
  { id: 'pothole', icon: 'warning-outline', title: 'Potholes', desc: 'Road potholes & cracks', color: '#F97316' },
  { id: 'garbage', icon: 'trash-outline', title: 'Garbage', desc: 'Waste & litter issues', color: '#22C55E' },
  { id: 'streetlight', icon: 'bulb-outline', title: 'Street Lights', desc: 'Broken or dim lights', color: '#EAB308' },
  { id: 'badroad', icon: 'car-outline', title: 'Road Damage', desc: 'Damaged road surface', color: '#EF4444' },
  { id: 'water', icon: 'water-outline', title: 'Water Issues', desc: 'Leaks & drainage', color: '#0EA5E9' },
  { id: 'sewage', icon: 'construct-outline', title: 'Sewage', desc: 'Sewer problems', color: '#7C3AED' },
];

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { issues } = useAppSelector((state) => state.issue);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Rahil Shaikh');
  const [editEmail, setEditEmail] = useState(user?.email || 'rahil@example.com');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const userIssues = issues.filter((issue) => issue.userId === '1');
  const stats = {
    total: userIssues.length,
    resolved: userIssues.filter((i) => i.status === 'solved' || i.status === 'completed').length,
    pending: userIssues.filter((i) => i.status === 'reported' || i.status === 'in_progress').length,
  };

  const handleDownloadPdf = async (issue: Issue) => {
    try {
      setDownloadingId(issue.id);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Success', `Report downloaded for "${issue.title}"`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditModal(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('user');
          socketService.disconnect();
          dispatch(logout());
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            handleLogout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowEditModal(true)}>
            <Ionicons name="create-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image
            source={{
              uri: user?.avatar || 'https://ui-avatars.com/api/?name=Rahil+Shaikh&background=ffffff&color=2563EB&size=200',
            }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.name || 'Rahil Shaikh'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'rahil@example.com'}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons name="settings-outline" size={18} color={activeTab === 'profile' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.tabActive]}
          onPress={() => setActiveTab('reports')}
        >
          <Ionicons name="document-text-outline" size={18} color={activeTab === 'reports' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextActive]}>My Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.tabActive]}
          onPress={() => setActiveTab('about')}
        >
          <Ionicons name="information-circle-outline" size={18} color={activeTab === 'about' ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>About</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' && (
          <SettingsContent
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            locationServices={locationServices}
            setLocationServices={setLocationServices}
            onEditProfile={() => setShowEditModal(true)}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsContent
            issues={userIssues}
            downloadingId={downloadingId}
            onDownload={handleDownloadPdf}
          />
        )}
        {activeTab === 'about' && <AboutContent />}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Settings Tab Content
function SettingsContent({
  pushNotifications,
  setPushNotifications,
  emailNotifications,
  setEmailNotifications,
  locationServices,
  setLocationServices,
  onEditProfile,
  onLogout,
  onDeleteAccount,
}: {
  pushNotifications: boolean;
  setPushNotifications: (val: boolean) => void;
  emailNotifications: boolean;
  setEmailNotifications: (val: boolean) => void;
  locationServices: boolean;
  setLocationServices: (val: boolean) => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.card}>
        <SettingRow
          icon="notifications"
          title="Push Notifications"
          subtitle="Get notified about report updates"
          value={pushNotifications}
          onToggle={setPushNotifications}
        />
        <View style={styles.cardDivider} />
        <SettingRow
          icon="mail"
          title="Email Notifications"
          subtitle="Receive email summaries"
          value={emailNotifications}
          onToggle={setEmailNotifications}
        />
        <View style={styles.cardDivider} />
        <SettingRow
          icon="location"
          title="Location Services"
          subtitle="Auto-detect issue location"
          value={locationServices}
          onToggle={setLocationServices}
        />
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.card}>
        <ActionRow icon="person-outline" title="Edit Profile" onPress={onEditProfile} />
        <View style={styles.cardDivider} />
        <ActionRow
          icon="lock-closed-outline"
          title="Change Password"
          onPress={() => Alert.alert('Coming Soon', 'Password change feature coming soon!')}
        />
        <View style={styles.cardDivider} />
        <ActionRow
          icon="help-circle-outline"
          title="Help & Support"
          onPress={() => Alert.alert('Support', 'Email us at support@urbancity.app')}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Danger Zone</Text>
      <View style={[styles.card, styles.dangerCard]}>
        <ActionRow icon="log-out-outline" title="Logout" color={COLORS.warning} onPress={onLogout} />
        <View style={styles.cardDivider} />
        <ActionRow
          icon="trash-outline"
          title="Delete Account"
          subtitle="Permanently delete your account"
          color={COLORS.error}
          onPress={onDeleteAccount}
        />
      </View>
    </View>
  );
}

// Reports Tab Content
function ReportsContent({
  issues,
  downloadingId,
  onDownload,
}: {
  issues: Issue[];
  downloadingId: string | null;
  onDownload: (issue: Issue) => void;
}) {
  if (issues.length === 0) {
    return (
      <EmptyState
        icon="document-text-outline"
        title="No Reports Yet"
        description="Start reporting civic issues in your area"
      />
    );
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Your Reports ({issues.length})</Text>
      {issues.map((issue) => (
        <View key={issue.id} style={styles.reportCard}>
          <Image source={{ uri: issue.imageUrl }} style={styles.reportImage} />
          <View style={styles.reportContent}>
            <Text style={styles.reportTitle} numberOfLines={1}>{issue.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(issue.status) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                {formatStatus(issue.status)}
              </Text>
            </View>
            <Text style={styles.reportLocation} numberOfLines={1}>
              📍 {issue.location?.address || 'Unknown location'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => onDownload(issue)}
            disabled={downloadingId === issue.id}
          >
            {downloadingId === issue.id ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Ionicons name="download-outline" size={22} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// About Tab Content
function AboutContent() {
  return (
    <View>
      {/* About Card */}
      <View style={styles.aboutCard}>
        <View style={styles.aboutLogo}>
          <Ionicons name="business" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.aboutTitle}>Urban City</Text>
        <Text style={styles.aboutTagline}>Your City in Real Time</Text>
        <Text style={styles.aboutDesc}>
          Urban City (Civic Sense) empowers citizens to report civic issues directly to local authorities.
          Track your reports in real-time and help make your city a better place to live.
        </Text>
      </View>

      {/* What You Can Report */}
      <Text style={styles.sectionTitle}>What You Can Report</Text>
      <View style={styles.categoriesGrid}>
        {ISSUE_CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.categoryCard}>
            <View style={[styles.categoryIcon, { backgroundColor: cat.color + '15' }]}>
              <Ionicons name={cat.icon as any} size={24} color={cat.color} />
            </View>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <Text style={styles.categoryDesc}>{cat.desc}</Text>
          </View>
        ))}
      </View>

      {/* How It Works */}
      <Text style={styles.sectionTitle}>How It Works</Text>
      <View style={styles.card}>
        <StepRow num="1" title="Capture" desc="Take a photo of the civic issue" />
        <View style={styles.cardDivider} />
        <StepRow num="2" title="Report" desc="Add details and confirm location" />
        <View style={styles.cardDivider} />
        <StepRow num="3" title="Track" desc="Get real-time updates on resolution" />
        <View style={styles.cardDivider} />
        <StepRow num="4" title="Download" desc="Download PDF report for records" />
      </View>

      {/* App Info */}
      <View style={styles.appInfoCard}>
        <Text style={styles.appInfoTitle}>Urban City v1.0.0</Text>
        <Text style={styles.appInfoText}>© 2024 Civic Sense. All rights reserved.</Text>
        <TouchableOpacity style={styles.contactBtn}>
          <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
          <Text style={styles.contactText}>support@urbancity.app</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onToggle,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={20} color={COLORS.primary} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.primary + '50' }}
        thumbColor={value ? COLORS.primary : COLORS.textLight}
      />
    </View>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  color,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  color?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, color && { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={20} color={color || COLORS.textSecondary} />
      </View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, color && { color }]}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
    </TouchableOpacity>
  );
}

function StepRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{num}</Text>
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </View>
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  userEmail: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    marginTop: 20,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: -16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 4,
    ...SHADOWS.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '10',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 70,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  settingSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  reportImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  reportContent: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  reportLocation: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  downloadBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    ...SHADOWS.sm,
  },
  aboutLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  aboutTagline: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  aboutDesc: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 48 - 12) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    ...SHADOWS.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  categoryDesc: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stepDesc: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  appInfoCard: {
    alignItems: 'center',
    marginTop: 24,
    padding: 20,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  appInfoText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textLight,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

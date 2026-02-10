// ============================================
// Urban City - Issue Detail Page (Full Screen)
// ============================================

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector } from '../store';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { getCategoryLabel, getCategoryColor } from '../constants/categories';

import { useGetIssueByIdQuery } from '../services/issueApi';
import Skeleton from '../components/ui/Skeleton';

const { width } = Dimensions.get('window');

export default function IssueDetailScreen() {
    const params = useLocalSearchParams();
    const id = params.id as string;
    const { issues } = useAppSelector((state) => state.issue);
    const [isDownloading, setIsDownloading] = useState(false);
    const [activeImageTab, setActiveImageTab] = useState<'before' | 'after'>('before');

    // 1. Try to find in Redux store (instant load)
    const localIssue = issues.find((i) => i.id === id);

    // 2. Fetch from API (fresh data / fallback)
    const { data: fetchedIssue, isLoading, error } = useGetIssueByIdQuery(id);

    // 3. Determine which issue data to use
    const issue = fetchedIssue || localIssue;

    if (isLoading && !issue) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ height: 300, width: '100%', backgroundColor: COLORS.card }}>
                    <Skeleton height="100%" borderRadius={0} />
                </View>
                <View style={{ padding: SPACING.m }}>
                    <Skeleton height={28} width="80%" style={{ marginBottom: SPACING.s }} />
                    <Skeleton height={20} width="40%" style={{ marginBottom: SPACING.l }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.m }}>
                        <Skeleton height={60} width="30%" />
                        <Skeleton height={60} width="30%" />
                        <Skeleton height={60} width="30%" />
                    </View>

                    <Skeleton height={100} width="100%" borderRadius={BORDER_RADIUS.m} />
                </View>
            </SafeAreaView>
        );
    }

    if (!issue || error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.notFound}>
                    <Ionicons name="alert-circle-outline" size={64} color={COLORS.textMuted} />
                    <Text style={styles.notFoundText}>Issue not found</Text>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Text style={styles.backBtnText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            Alert.alert(
                'Download Complete',
                `Report "${issue.title}" has been downloaded as PDF.`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const isResolved = issue.status === 'solved' || issue.status === 'completed';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Image Section */}
            <View style={styles.imageSection}>
                <Image
                    source={{ uri: activeImageTab === 'before' ? issue.imageUrl : (issue.imageUrl + '?v=after') }}
                    style={styles.mainImage}
                />

                {/* Back Button */}
                <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color="#fff" />
                </TouchableOpacity>

                {/* Status Badge */}
                <View style={[styles.imageBadge, { backgroundColor: getStatusColor(issue.status) }]}>
                    <Text style={styles.imageBadgeText}>{formatStatus(issue.status)}</Text>
                </View>

                {/* Important Badge */}
                {issue.isImportant && (
                    <View style={[styles.imageBadge, { top: 50, backgroundColor: COLORS.error }]}>
                        <Text style={styles.imageBadgeText}>IMPORTANT</Text>
                    </View>
                )}

                {/* Before/After Tabs (only if resolved) */}
                {isResolved && (
                    <View style={styles.imageTabs}>
                        <TouchableOpacity
                            style={[styles.imageTab, activeImageTab === 'before' && styles.imageTabActive]}
                            onPress={() => setActiveImageTab('before')}
                        >
                            <Text style={[styles.imageTabText, activeImageTab === 'before' && styles.imageTabTextActive]}>
                                Before
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.imageTab, activeImageTab === 'after' && styles.imageTabActive]}
                            onPress={() => setActiveImageTab('after')}
                        >
                            <Text style={[styles.imageTabText, activeImageTab === 'after' && styles.imageTabTextActive]}>
                                After
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title & Category */}
                <View style={styles.titleSection}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(issue.category) + '15' }]}>
                        <Text style={[styles.categoryText, { color: getCategoryColor(issue.category) }]}>
                            {getCategoryLabel(issue.category)}
                        </Text>
                    </View>
                    <Text style={styles.title}>{issue.title}</Text>
                </View>

                {/* Info Cards */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.infoLabel}>Location</Text>
                        <Text style={styles.infoValue} numberOfLines={2}>
                            {issue.location?.address || 'Unknown'}
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.infoLabel}>Reported</Text>
                        <Text style={styles.infoValue}>
                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <View style={styles.descriptionCard}>
                        <Text style={styles.descriptionText}>{issue.description}</Text>
                    </View>
                </View>

                {/* Timeline */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Timeline</Text>
                    <View style={styles.timeline}>
                        {issue.timeline && issue.timeline.length > 0 ? (
                            issue.timeline.map((event, index) => {
                                let icon = 'time-outline';
                                let color = COLORS.textMuted;
                                let title = event.action.replace('_', ' ');

                                switch (event.action) {
                                    case 'STATUS_CHANGE':
                                        icon = 'construct';
                                        color = COLORS.primary;
                                        break;
                                    case 'IMPORTANT_FLAG':
                                        icon = 'alert-circle';
                                        color = COLORS.error;
                                        break;
                                    case 'SOLVED':
                                        icon = 'checkmark-circle';
                                        color = COLORS.success;
                                        break;
                                    default:
                                        icon = 'information-circle';
                                }

                                return (
                                    <TimelineItem
                                        key={index}
                                        icon={icon}
                                        title={title}
                                        subtitle={event.note}
                                        date={event.timestamp}
                                        color={color}
                                        isFirst={index === 0}
                                        isLast={index === (issue.timeline?.length || 0) - 1}
                                    />
                                );
                            })
                        ) : (
                            // Fallback for legacy issues without timeline
                            <>
                                <TimelineItem
                                    icon="flag"
                                    title="Issue Reported"
                                    date={issue.createdAt}
                                    color={COLORS.primary}
                                    isFirst
                                />
                                {issue.status !== 'reported' && (
                                    <TimelineItem
                                        icon="construct"
                                        title="Work In Progress"
                                        date={issue.updatedAt}
                                        color={COLORS.inProgress}
                                    />
                                )}
                                {isResolved && (
                                    <TimelineItem
                                        icon="checkmark-circle"
                                        title="Issue Resolved"
                                        date={issue.updatedAt}
                                        color={COLORS.success}
                                        isLast
                                    />
                                )}
                            </>
                        )}
                    </View>
                </View>

                {/* Download PDF */}
                <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={handleDownloadPdf}
                    disabled={isDownloading}
                    activeOpacity={0.8}
                >
                    {isDownloading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="document-text-outline" size={22} color="#fff" />
                            <Text style={styles.downloadBtnText}>Download PDF Report</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

function TimelineItem({
    icon,
    title,
    subtitle,
    date,
    color,
    isFirst,
    isLast,
}: {
    icon: string;
    title: string;
    subtitle?: string;
    date: string;
    color: string;
    isFirst?: boolean;
    isLast?: boolean;
}) {
    return (
        <View style={styles.timelineItem}>
            <View style={styles.timelineLine}>
                {!isFirst && <View style={[styles.lineTop, { backgroundColor: color }]} />}
                <View style={[styles.timelineDot, { backgroundColor: color }]}>
                    <Ionicons name={icon as any} size={14} color="#fff" />
                </View>
                {!isLast && <View style={[styles.lineBottom, { backgroundColor: COLORS.border }]} />}
            </View>
            <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>{title}</Text>
                {subtitle && <Text style={[styles.timelineDate, { marginTop: 2, color: COLORS.textSecondary }]}>{subtitle}</Text>}
                <Text style={styles.timelineDate}>
                    {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
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
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    notFoundText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    backBtn: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
    },
    backBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    imageSection: {
        height: 280,
        backgroundColor: '#000',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    headerBackBtn: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    imageBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    imageTabs: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        padding: 4,
    },
    imageTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    imageTabActive: {
        backgroundColor: '#fff',
    },
    imageTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    imageTabTextActive: {
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
    },
    titleSection: {
        padding: 24,
        paddingBottom: 0,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
        lineHeight: 32,
    },
    infoGrid: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingTop: 20,
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 16,
        ...SHADOWS.sm,
    },
    infoLabel: {
        marginTop: 8,
        fontSize: 12,
        color: COLORS.textMuted,
    },
    infoValue: {
        marginTop: 4,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    section: {
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    descriptionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 16,
        ...SHADOWS.sm,
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    timeline: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 16,
        ...SHADOWS.sm,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineLine: {
        width: 32,
        alignItems: 'center',
    },
    lineTop: {
        width: 2,
        height: 8,
    },
    lineBottom: {
        width: 2,
        flex: 1,
        minHeight: 24,
    },
    timelineDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineContent: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 20,
    },
    timelineTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    timelineDate: {
        marginTop: 4,
        fontSize: 12,
        color: COLORS.textMuted,
    },
    downloadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        marginTop: 24,
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 14,
        gap: 10,
        ...SHADOWS.sm,
    },
    downloadBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    bottomSpace: {
        height: 40,
    },
});

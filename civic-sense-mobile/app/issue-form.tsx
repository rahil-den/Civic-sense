// ============================================
// Civic Sense - Issue Form Screen
// ============================================

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAppDispatch } from '../store';
import { addIssue } from '../store/slices/issueSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import type { IssueCategory, Issue } from '../types';

export default function IssueFormScreen() {
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams<{
        imageUri: string;
        imageBase64: string;
        latitude: string;
        longitude: string;
        address: string;
    }>();

    const [category, setCategory] = useState<IssueCategory>('pothole');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [exactLocation, setExactLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

    const validate = (): boolean => {
        const newErrors: { title?: string; description?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Please enter a brief title';
        } else if (title.length < 5) {
            newErrors.title = 'Title should be at least 5 characters';
        }

        if (!description.trim()) {
            newErrors.description = 'Please describe the issue';
        } else if (description.length < 20) {
            newErrors.description = 'Description should be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Create new issue
            const newIssue: Issue = {
                id: Date.now().toString(),
                title: title.trim(),
                description: description.trim(),
                category,
                status: 'reported',
                imageUrl: params.imageUri,
                location: {
                    latitude: parseFloat(params.latitude),
                    longitude: parseFloat(params.longitude),
                    address: exactLocation.trim() || params.address,
                },
                userId: '1', // Current user
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Add to Redux store
            dispatch(addIssue(newIssue));

            // Show success
            Alert.alert(
                'Success!',
                'Your issue has been reported successfully. You will receive updates on its progress.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit your report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        Alert.alert(
            'Discard Report?',
            'Are you sure you want to discard this report?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => router.back() },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Report</Text>
                    <View style={styles.backButton} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Captured Image */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: params.imageUri }} style={styles.image} />
                        <View style={styles.imageBadge}>
                            <Ionicons name="camera" size={14} color={COLORS.surface} />
                            <Text style={styles.imageBadgeText}>Captured Photo</Text>
                        </View>
                    </View>

                    {/* Location (Read-only) */}
                    <View style={styles.locationCard}>
                        <Ionicons name="location" size={20} color={COLORS.primary} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationLabel}>Detected Location</Text>
                            <Text style={styles.locationAddress}>
                                {params.address || `${params.latitude}, ${params.longitude}`}
                            </Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        {/* Category Picker */}
                        <Text style={styles.fieldLabel}>Issue Category</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={category}
                                onValueChange={(value) => setCategory(value)}
                                style={styles.picker}
                            >
                                {CATEGORIES.map((cat) => (
                                    <Picker.Item
                                        key={cat.id}
                                        label={cat.label}
                                        value={cat.id}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* Title */}
                        <Input
                            label="Brief Title"
                            placeholder="e.g., Large pothole on main road"
                            value={title}
                            onChangeText={setTitle}
                            error={errors.title}
                            maxLength={100}
                        />

                        {/* Description */}
                        <Input
                            label="Description"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChangeText={setDescription}
                            error={errors.description}
                            multiline
                            numberOfLines={4}
                            maxLength={500}
                        />

                        {/* Optional Exact Location */}
                        <Input
                            label="Exact Location (Optional)"
                            placeholder="e.g., Near the bus stop, opposite XYZ shop"
                            value={exactLocation}
                            onChangeText={setExactLocation}
                            helper="Add landmarks to help locate the issue"
                            maxLength={150}
                        />
                    </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.footer}>
                    <Button
                        title={isSubmitting ? 'Submitting...' : 'Submit Report'}
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        fullWidth
                        size="lg"
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
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
        padding: SPACING.lg,
        paddingBottom: SPACING.xxxl,
    },
    imageContainer: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
        ...SHADOWS.sm,
    },
    image: {
        width: '100%',
        height: 200,
    },
    imageBadge: {
        position: 'absolute',
        top: SPACING.md,
        left: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
    },
    imageBadgeText: {
        marginLeft: 4,
        fontSize: FONT_SIZES.xs,
        color: COLORS.surface,
    },
    locationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xl,
        ...SHADOWS.sm,
    },
    locationInfo: {
        flex: 1,
        marginHorizontal: SPACING.md,
    },
    locationLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    locationAddress: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        marginTop: 2,
    },
    form: {
        marginBottom: SPACING.lg,
    },
    fieldLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    pickerContainer: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    footer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
});

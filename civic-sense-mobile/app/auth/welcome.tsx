import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { StorageService } from '../../services/storageService';
import { useAppDispatch } from '../../store';
import { loginSuccess, loginFailure, setLoading } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { api, API_BASE_URL } from '../../services/api';

WebBrowser.maybeCompleteAuthSession();

// Placeholder Client IDs - User must replace these
const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const dispatch = useAppDispatch();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showSplash, setShowSplash] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleBackendLogin(id_token);
        } else if (response?.type === 'error') {
            setIsGoogleLoading(false);
            alert('Google Sign-In failed');
        }
    }, [response]);

    const handleBackendLogin = async (idToken: string) => {
        try {
            setIsGoogleLoading(true);

            // Call backend to verify token and get user/jwt
            // We use fetch directly or axios because api slice might be strictly typed or cached
            // But let's assume we can use a raw fetch to our backend URL
            // Getting base URL from api service
            // A bit hacky to get base URL, let's hardcode or better, use extra arg
            const API_URL = `${API_BASE_URL}/auth/google`;

            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Store credentials
            await StorageService.setItem('authToken', data.token);
            await StorageService.setItem('user', JSON.stringify(data));

            // Update Redux state
            dispatch(loginSuccess({ user: data, token: data.token }));

            setIsGoogleLoading(false);
            setShowSplash(true);

            // Navigate to Home after splash
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 2000);

        } catch (error: any) {
            console.error('Login error:', error);
            setIsGoogleLoading(false);
            alert(error.message || 'Failed to authenticate with backend');
        }
    };

    const handleGoogleLogin = () => {
        if (GOOGLE_WEB_CLIENT_ID.includes('YOUR_WEB_CLIENT_ID')) {
            if (__DEV__) {
                alert('Using Dev Bypass: Google Client IDs are placeholders.');
                handleBackendLogin('mock-google-token');
                return;
            } else {
                alert('Please configure Google Client IDs in source code.');
                return;
            }
        }
        setIsGoogleLoading(true);
        promptAsync();
    };

    const handleEmailLogin = () => {
        // Navigate to Email Login screen
        router.push('/auth/login');
    };

    // Splash Screen (Loading Animation)
    if (showSplash) {
        return (
            <View style={styles.splashContainer}>
                <View style={styles.splashContent}>
                    {/* Animated Logo */}
                    <View style={styles.splashLogoContainer}>
                        <View style={styles.splashLogoOuter}>
                            <View style={styles.splashLogoInner}>
                                <Ionicons name="business" size={48} color="#fff" />
                            </View>
                        </View>
                        {/* Pulsing rings */}
                        <View style={[styles.pulseRing, styles.pulseRing1]} />
                        <View style={[styles.pulseRing, styles.pulseRing2]} />
                    </View>

                    {/* Brand Name */}
                    <Text style={styles.splashTitle}>Urban City</Text>
                    <Text style={styles.splashTagline}>Your City in Real Time</Text>

                    {/* Loading indicator */}
                    <View style={styles.splashLoader}>
                        <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
                        <Text style={styles.splashLoadingText}>Loading your experience...</Text>
                    </View>
                </View>

                {/* Decorative elements */}
                <View style={styles.splashDecorTop} />
                <View style={styles.splashDecorBottom} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Decorations */}
            <View style={styles.decorTop}>
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <View style={styles.decorCircle3} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo & Branding */}
                <View style={styles.branding}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="business" size={52} color="#fff" />
                    </View>
                    <Text style={styles.appName}>Urban City</Text>
                    <Text style={styles.tagline}>Your City in Real Time</Text>
                </View>

                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Report civic issues, track progress, and make your community better.
                    </Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>1M+</Text>
                        <Text style={styles.statLabel}>Reports</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>500K+</Text>
                        <Text style={styles.statLabel}>Resolved</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>100+</Text>
                        <Text style={styles.statLabel}>Cities</Text>
                    </View>
                </View>
            </View>

            {/* Auth Buttons */}
            <View style={styles.authSection}>
                {/* Google Login Button */}
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    activeOpacity={0.8}
                >
                    {isGoogleLoading ? (
                        <ActivityIndicator size="small" color={COLORS.textPrimary} />
                    ) : (
                        <>
                            <Ionicons name="logo-google" size={22} color="#DB4437" />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Email Login Button */}
                <TouchableOpacity
                    style={styles.emailButton}
                    onPress={handleEmailLogin}
                    activeOpacity={0.8}
                >
                    <Ionicons name="mail-outline" size={22} color="#fff" />
                    <Text style={styles.emailButtonText}>Continue with Email</Text>
                </TouchableOpacity>

                {/* Terms */}
                <Text style={styles.terms}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.link}>Terms of Service</Text> and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    decorTop: {
        position: 'absolute',
        top: -50,
        right: -30,
        width: 250,
        height: 250,
    },
    decorCircle1: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: COLORS.primary + '12',
        top: 0,
        right: 0,
    },
    decorCircle2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary + '10',
        top: 100,
        right: 100,
    },
    decorCircle3: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '08',
        top: 30,
        right: 150,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.xxl,
    },
    branding: {
        alignItems: 'center',
        marginBottom: SPACING.xxxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.lg,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textMuted,
        marginTop: SPACING.xs,
    },
    descriptionContainer: {
        marginBottom: SPACING.xxl,
    },
    description: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        color: COLORS.success,
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.md,
    },
    authSection: {
        paddingHorizontal: SPACING.xxl,
        paddingBottom: SPACING.xxxl,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
        minHeight: 56,
        ...SHADOWS.sm,
    },
    googleButtonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.md,
        marginBottom: SPACING.xl,
        minHeight: 56,
        ...SHADOWS.md,
    },
    emailButtonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: '#fff',
    },
    terms: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 18,
    },
    link: {
        color: COLORS.primary,
        fontWeight: '500',
    },
    // Splash Screen Styles
    splashContainer: {
        flex: 1,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashContent: {
        alignItems: 'center',
    },
    splashLogoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    splashLogoOuter: {
        width: 120,
        height: 120,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashLogoInner: {
        width: 90,
        height: 90,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    pulseRing1: {
        width: 180,
        height: 180,
        borderRadius: 90,
        opacity: 0.5,
    },
    pulseRing2: {
        width: 220,
        height: 220,
        borderRadius: 110,
        opacity: 0.3,
    },
    splashTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
        marginBottom: SPACING.sm,
    },
    splashTagline: {
        fontSize: FONT_SIZES.lg,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    splashLoader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xxxl,
        gap: SPACING.sm,
    },
    splashLoadingText: {
        fontSize: FONT_SIZES.sm,
        color: 'rgba(255,255,255,0.7)',
    },
    splashDecorTop: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    splashDecorBottom: {
        position: 'absolute',
        bottom: -150,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
});

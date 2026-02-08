import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../../store';
import { loginSuccess, setLoading } from '../../store/slices/authSlice';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

export default function SignUpScreen() {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSplash, setShowSplash] = useState(false);

    const validateInputs = () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!email.trim()) {
            setError('Please enter your email');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;

        try {
            setIsLoading(true);
            setError(null);
            dispatch(setLoading(true));

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock user data
            const mockUser = {
                id: Date.now().toString(),
                name: name.trim(),
                email: email.trim(),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563EB&color=fff`,
                createdAt: new Date().toISOString(),
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            // Store token securely
            await SecureStore.setItemAsync('authToken', mockToken);
            await SecureStore.setItemAsync('user', JSON.stringify(mockUser));

            // Update Redux state
            dispatch(loginSuccess({ user: mockUser, token: mockToken }));

            // Show splash screen
            setIsLoading(false);
            setShowSplash(true);

            // Navigate after splash animation
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 2500);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create account. Please try again.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockUser = {
            id: Date.now().toString(),
            name: 'New User',
            email: 'user@example.com',
            avatar: 'https://ui-avatars.com/api/?name=New+User&background=2563EB&color=fff',
            createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        await SecureStore.setItemAsync('authToken', mockToken);
        await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
        dispatch(loginSuccess({ user: mockUser, token: mockToken }));

        setIsLoading(false);
        setShowSplash(true);

        setTimeout(() => {
            router.replace('/(tabs)');
        }, 2500);
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
                        <Text style={styles.splashLoadingText}>Setting up your account...</Text>
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>

                    {/* Header Decoration */}
                    <View style={styles.headerDecor}>
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />
                    </View>

                    {/* Logo & Branding */}
                    <View style={styles.branding}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="business" size={36} color="#fff" />
                        </View>
                        <Text style={styles.appName}>Urban City</Text>
                    </View>

                    {/* Sign Up Form Card */}
                    <View style={styles.formCard}>
                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.subText}>Join us to report and track civic issues</Text>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={18} color={COLORS.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Name Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor={COLORS.textLight}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    placeholderTextColor={COLORS.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor={COLORS.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                    <Ionicons
                                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    placeholderTextColor={COLORS.textLight}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={20}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.signupButtonText}>Create Account</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or sign up with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Sign Up */}
                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp} disabled={isLoading}>
                                <Ionicons name="logo-google" size={22} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                                <Ionicons name="logo-apple" size={22} color={COLORS.textPrimary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
                                <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.link}>Terms of Service</Text> and{' '}
                        <Text style={styles.link}>Privacy Policy</Text>
                    </Text>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.md,
        ...SHADOWS.sm,
    },
    headerDecor: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: 200,
        height: 200,
    },
    decorCircle1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.primary + '15',
        top: 0,
        right: 0,
    },
    decorCircle2: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '10',
        top: 80,
        right: 80,
    },
    branding: {
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.lg,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
        ...SHADOWS.md,
    },
    appName: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -0.5,
    },
    formCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        ...SHADOWS.md,
    },
    welcomeText: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
        marginBottom: SPACING.lg,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.errorBg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
    },
    errorText: {
        marginLeft: SPACING.sm,
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        flex: 1,
    },
    inputWrapper: {
        marginBottom: SPACING.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
    },
    eyeButton: {
        padding: SPACING.md,
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
        marginTop: SPACING.sm,
        minHeight: 52,
        ...SHADOWS.sm,
    },
    signupButtonDisabled: {
        opacity: 0.7,
    },
    signupButtonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: '#fff',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    loginText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMuted,
    },
    loginLink: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: '600',
    },
    terms: {
        marginTop: SPACING.md,
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
        width: 160,
        height: 160,
        borderRadius: 80,
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

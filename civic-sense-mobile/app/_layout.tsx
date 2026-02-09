// ============================================
// Civic Sense - Root Layout with Auth Check
// ============================================

import React, { useEffect, useState } from 'react';
import { Stack, Slot, useSegments, router } from 'expo-router';
import { Provider } from 'react-redux';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import * as SecureStore from 'expo-secure-store';
import { StorageService } from '../services/storageService';
import { store, useAppDispatch, useAppSelector } from '../store';
import { loginSuccess } from '../store/slices/authSlice';
import { socketService } from '../services/socketService';
import { COLORS } from '../constants/theme';

function RootLayoutContent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const segments = useSegments();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await StorageService.getItem('authToken');
      const userStr = await StorageService.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        dispatch(loginSuccess({ user, token }));

        // Connect to Socket.IO
        socketService.connect(token);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (!isReady || !segments) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to welcome screen if not authenticated
      router.replace('/auth/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if already authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Register all routes - expo-router handles file-based routing
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen
        name="issue-form"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="issues/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

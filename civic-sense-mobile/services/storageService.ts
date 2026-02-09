import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const StorageService = {
    async setItem(key: string, value: string): Promise<void> {
        try {
            if (isWeb) {
                localStorage.setItem(key, value);
            } else {
                await SecureStore.setItemAsync(key, value);
            }
        } catch (error) {
            console.error('Error setting item:', error);
        }
    },

    async getItem(key: string): Promise<string | null> {
        try {
            if (isWeb) {
                return localStorage.getItem(key);
            } else {
                return await SecureStore.getItemAsync(key);
            }
        } catch (error) {
            console.error('Error getting item:', error);
            return null;
        }
    },

    async removeItem(key: string): Promise<void> {
        try {
            if (isWeb) {
                localStorage.removeItem(key);
            } else {
                await SecureStore.deleteItemAsync(key);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    },
};

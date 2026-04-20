import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { handleRealTimeUpdate } from '../store/slices/issueSlice';
import { addNotification } from '../store/slices/notificationSlice';
import { api } from './api';
import type { Issue, Notification } from '../types';
import { Alert } from 'react-native';

// TODO: Update this to your actual backend URL
const SOCKET_URL = 'http://192.168.1.13:3000';
// Set to true when you have a real backend server
const SOCKET_ENABLED = true;

class SocketService {
    private socket: Socket | null = null;
    private isConnected = false;

    // Connect to Socket.IO server
    connect(token: string): void {
        // Skip connection if socket is disabled
        if (!SOCKET_ENABLED) {
            console.log('[Socket] Disabled - no backend server configured');
            return;
        }

        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupListeners();
    }

    // Disconnect from server
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Setup event listeners
    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('[Socket] Connected');
            this.isConnected = true;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
        });

        // Listen for issue updates (status changes)
        this.socket.on('issueUpdated', (data: any) => {
            console.log('[Socket] Issue update received:', data.issueId);
            store.dispatch(handleRealTimeUpdate({ id: data.issueId, status: data.status } as any));
            store.dispatch(api.util.invalidateTags([{ type: 'Issue', id: 'LIST' } as any, 'Issue']));
        });

        // Listen for new issues in community
        this.socket.on('issueCreated', (data: any) => {
            console.log('[Socket] New issue received:', data.issue?.id || data.issue?._id);
            if (data.issue) {
                store.dispatch(handleRealTimeUpdate(data.issue));
                store.dispatch(api.util.invalidateTags([{ type: 'Issue', id: 'LIST' } as any, 'Issue']));
            }
        });

        // Listen for notifications
        this.socket.on('notification:new', async (notification: any) => {
            const user = store.getState().auth.user;
            if (notification.userId && user && String(notification.userId) !== String(user.id)) return;

            console.log('[Socket] New notification:', notification.id || notification._id);
            store.dispatch(addNotification(notification));
            
            // Trigger local push notification popup (Fallback for Expo Go)
            Alert.alert(
                notification.title,
                notification.description
            );
        });
    }

    // Subscribe to a specific area (for map updates)
    subscribeToArea(latitude: number, longitude: number, radius: number): void {
        if (this.socket && this.isConnected) {
            this.socket.emit('subscribe:area', { latitude, longitude, radius });
        }
    }

    // Unsubscribe from area
    unsubscribeFromArea(): void {
        if (this.socket && this.isConnected) {
            this.socket.emit('unsubscribe:area');
        }
    }

    // Get connection status
    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

// Export singleton instance
export const socketService = new SocketService();

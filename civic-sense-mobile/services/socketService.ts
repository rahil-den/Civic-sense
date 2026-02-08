import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { handleRealTimeUpdate } from '../store/slices/issueSlice';
import { addNotification } from '../store/slices/notificationSlice';
import type { Issue, Notification } from '../types';

// TODO: Update this to your actual backend URL
const SOCKET_URL = 'https://api.civicsense.example.com';
// Set to true when you have a real backend server
const SOCKET_ENABLED = false;

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

        // Listen for issue updates (new issues or status changes)
        this.socket.on('issue:update', (issue: Issue) => {
            console.log('[Socket] Issue update received:', issue.id);
            store.dispatch(handleRealTimeUpdate(issue));
        });

        // Listen for new issues in community
        this.socket.on('issue:new', (issue: Issue) => {
            console.log('[Socket] New issue received:', issue.id);
            store.dispatch(handleRealTimeUpdate(issue));
        });

        // Listen for notifications
        this.socket.on('notification:new', (notification: Notification) => {
            console.log('[Socket] New notification:', notification.id);
            store.dispatch(addNotification(notification));
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


import api from './api';

export interface UpdateProfileData {
    name: string;
    email: string;
    department?: string;
    phone?: string;
    preferences?: {
        pushNotifications: boolean;
        emailNotifications: boolean;
        summary?: boolean;
        urgentAlerts?: boolean;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const adminApi = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileData) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    },

    changePassword: async (data: ChangePasswordData) => {
        const response = await api.put('/users/change-password', data);
        return response.data;
    },

    updatePreferences: async (preferences: any) => {
        const response = await api.put('/users/profile/preferences', preferences);
        return response.data;
    },

    toggleImportant: async (issueId: string) => {
        const response = await api.put(`/issues/${issueId}/important`);
        return response.data;
    },

    // Moderation
    getFlaggedUsers: async () => {
        const response = await api.get('/moderation/users');
        return response.data;
    },

    issueWarning: async (data: { userId: string, issueId?: string, reason: string }) => {
        const response = await api.post('/moderation/warning', data);
        return response.data;
    },

    banUser: async (userId: string, reason: string) => {
        const response = await api.patch(`/moderation/users/${userId}/ban`, { reason });
        return response.data;
    }
};

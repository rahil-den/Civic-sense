export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'rejected';
export type IssueCategory = 'roads' | 'water' | 'electricity' | 'waste' | 'others';

export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'SUPERADMIN' | 'CITIZEN';
    avatar?: string;
    department?: string; // For admins
    assignedCity?: string; // For admins
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    category: IssueCategory;
    status: IssueStatus;
    priority: 'low' | 'medium' | 'high' | 'critical';
    location: Location;
    images: string[];
    reportedBy: string; // User ID
    assignedTo?: string; // Admin ID
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    remarks?: string[];
    department?: string;
}

export interface AnalyticsSummary {
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    avgResolutionTime: number; // in hours
}

export interface CityStats {
    city: string;
    issues: number;
    resolved: number;
    avgTime: number;
}

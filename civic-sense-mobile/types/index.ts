// ============================================
// Civic Sense - TypeScript Type Definitions
// ============================================

// Issue Categories
export type IssueCategory = 'bad_road' | 'pothole' | 'garbage' | 'streetlight';

// Issue Status
export type IssueStatus = 'reported' | 'in_progress' | 'solved' | 'completed';

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    locationServices: boolean;
  };
  createdAt: string;
}

// Issue Location
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Issue Interface
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  imageUrl: string;
  location: Location;
  userId: string;
  createdAt: string;
  updatedAt: string;
  distance?: string; // Calculated on client
  isImportant?: boolean;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  action: string;
  by: any;
  note: string;
  timestamp: string;
}

// Notification Types
export type NotificationType = 'status_update' | 'warning' | 'resolved' | 'received';

// Notification Interface
export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  issueId?: string;
  read: boolean;
  createdAt: string;
}

// User Stats
export interface UserStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  inProgressReports: number;
}

// Auth Response
export interface AuthResponse {
  user: User;
  token: string;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
}

// Create Issue Request
export interface CreateIssueRequest {
  title: string;
  description: string;
  category: IssueCategory;
  imageBase64: string;
  location: Location;
}

// Map Region
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

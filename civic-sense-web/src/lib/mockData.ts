import { Issue, User } from '@/types';

export const mockUsers: User[] = [
    {
        id: 'u1',
        name: 'Admin One',
        email: 'admin@civicsense.gov',
        role: 'admin',
        department: 'Sanitation',
        assignedCity: 'Metropolis',
    },
    {
        id: 'u2',
        name: 'Jane Super',
        email: 'super@civicsense.gov',
        role: 'superadmin',
    },
];

export const mockIssues: Issue[] = [
    {
        id: 'i1',
        title: 'Pothole on Main St',
        description: 'Large pothole causing traffic slowdown.',
        category: 'roads',
        status: 'open',
        priority: 'high',
        location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, Metropolis' },
        images: ['https://placehold.co/600x400'],
        reportedBy: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'i2',
        title: 'Garbage pileup',
        description: 'Bags of trash left uncollected for 3 days.',
        category: 'waste',
        status: 'in_progress',
        priority: 'medium',
        location: { lat: 40.7200, lng: -74.0100, address: '456 Elm St, Metropolis' },
        images: ['https://placehold.co/600x400'],
        reportedBy: 'user2',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'i3',
        title: 'Street light broken',
        description: 'Light flickering and then went out.',
        category: 'electricity',
        status: 'resolved',
        priority: 'medium',
        location: { lat: 40.7300, lng: -74.0200, address: '789 Oak Ave, Metropolis' },
        images: ['https://placehold.co/600x400'],
        reportedBy: 'user3',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
    },
    {
        id: 'i4',
        title: 'Water pipe burst',
        description: 'Flooding the sidewalk.',
        category: 'water',
        status: 'open',
        priority: 'critical',
        location: { lat: 40.7400, lng: -74.0300, address: '101 Pine St, Metropolis' },
        images: ['https://placehold.co/600x400'],
        reportedBy: 'user4',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'i5',
        title: 'Illegal Parking',
        description: 'Blocking driveway.',
        category: 'others',
        status: 'rejected',
        priority: 'low',
        location: { lat: 40.7500, lng: -74.0400, address: '202 Maple Dr, Metropolis' },
        images: ['https://placehold.co/600x400'],
        reportedBy: 'user5',
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        updatedAt: new Date().toISOString(),
        remarks: ['Not a valid report.'],
    },
];

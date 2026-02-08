// ============================================
// Civic Sense - Map Marker Component
// ============================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import { getCategoryById } from '../constants/categories';
import type { Issue } from '../types';

interface MapMarkerProps {
    issue: Issue;
    onPress: (issue: Issue) => void;
}

export default function MapMarker({ issue, onPress }: MapMarkerProps) {
    const category = getCategoryById(issue.category);
    const markerColor = category?.markerColor || '#6B7280';
    const iconName = category?.icon || 'alert-circle-outline';

    return (
        <Marker
            coordinate={{
                latitude: issue.location.latitude,
                longitude: issue.location.longitude,
            }}
            onPress={() => onPress(issue)}
        >
            <View style={[styles.markerContainer, { backgroundColor: markerColor }]}>
                <Ionicons
                    name={iconName as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color="#FFFFFF"
                />
            </View>
            <View style={[styles.markerTail, { borderTopColor: markerColor }]} />
        </Marker>
    );
}

const styles = StyleSheet.create({
    markerContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    markerTail: {
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        alignSelf: 'center',
        marginTop: -2,
    },
});

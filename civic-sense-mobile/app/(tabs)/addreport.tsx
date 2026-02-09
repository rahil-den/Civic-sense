import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  Platform, // Added Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
// Conditionally load MapView
let MapView: any;
let Marker: any;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
  } catch (e) {
    console.warn('Maps not loaded:', e);
    MapView = View;
    Marker = View;
  }
} else {
  // Web fallback
  MapView = (props: any) => (
    <View style={[props.style, { backgroundColor: '#e1e1e1', alignItems: 'center', justifyContent: 'center' }]}>
      <Text>Maps are not supported on Web</Text>
    </View>
  );
  Marker = View;
}
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

type CapturedPhoto = {
  uri: string;
  base64?: string;
};

type LocationData = {
  latitude: number;
  longitude: number;
  address?: string;
};

export default function SnapshotScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Map for adjusting location
  const [showMapModal, setShowMapModal] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Location Required',
          'Please enable location to report issues accurately.'
        );
        setIsLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Try to get address
      let address = '';
      try {
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (geocode) {
          address = [geocode.street, geocode.city, geocode.region]
            .filter(Boolean)
            .join(', ');
        }
      } catch (e) {
        console.log('Geocoding failed:', e);
      }

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address,
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo) {
        setCapturedPhoto({
          uri: photo.uri,
          base64: photo.base64,
        });
        // Show confirmation modal
        setShowConfirmModal(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmYes = () => {
    if (!capturedPhoto || !location) {
      Alert.alert('Error', 'Photo and location are required.');
      return;
    }

    // Store values before closing modal
    const photoUri = capturedPhoto.uri;
    const photoBase64 = capturedPhoto.base64 || '';
    const lat = location.latitude.toString();
    const lng = location.longitude.toString();
    const addr = location.address || '';

    // Close modal first
    setShowConfirmModal(false);
    setCapturedPhoto(null);

    // Navigate immediately
    router.replace({
      pathname: '/issue-form',
      params: {
        imageUri: photoUri,
        imageBase64: photoBase64,
        latitude: lat,
        longitude: lng,
        address: addr,
      },
    });
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
    setCapturedPhoto(null);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // --- Map Adjustment Logic ---

  const handleAdjustLocation = () => {
    if (location) {
      setTempLocation({ ...location });
      setShowMapModal(true);
    } else {
      getLocation().then(() => {
        // Maybe wait? but user can just wait on camera screen
        Alert.alert('Location not ready', 'Please wait for location detection.');
      });
    }
  };

  const handleMapConfirm = async () => {
    if (tempLocation) {
      // Reverse geocode the new location
      let newAddress = tempLocation.address;
      try {
        // Only if address is empty or we want to update it (let's update it)
        const [geocode] = await Location.reverseGeocodeAsync({
          latitude: tempLocation.latitude,
          longitude: tempLocation.longitude,
        });
        if (geocode) {
          newAddress = [geocode.street, geocode.city, geocode.region]
            .filter(Boolean)
            .join(', ');
        }
      } catch (e) {
        console.log('Reverse geocode failed', e);
      }

      setLocation({
        ...tempLocation,
        address: newAddress
      });
      setShowMapModal(false);
    }
  };

  // Permission not determined yet
  if (!permission) {
    return <LoadingSpinner message="Checking camera access..." fullScreen />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <TouchableOpacity style={styles.backButtonTop} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Ionicons name="camera-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need camera access to capture issues in your area
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Header */}
        <SafeAreaView style={styles.cameraHeader} edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Report an Issue</Text>
              {isLoadingLocation ? (
                <Text style={styles.locationLoadingText}>Detecting location...</Text>
              ) : (
                <View style={styles.locationReady}>
                  <Ionicons name="location" size={12} color={COLORS.success} />
                  <Text style={styles.locationReadyText} numberOfLines={1}>
                    {location?.address || 'Location ready'}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Capture Button */}
        <SafeAreaView style={styles.controls} edges={['bottom']}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isCapturing || isLoadingLocation}
          >
            <View style={styles.captureOuter}>
              <View style={[
                styles.captureInner,
                (isCapturing || isLoadingLocation) && styles.captureDisabled
              ]} />
            </View>
          </TouchableOpacity>
          <Text style={styles.captureHint}>Tap to capture</Text>
        </SafeAreaView>
      </CameraView>

      {/* Photo Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          {capturedPhoto && (
            <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
          )}

          {/* Overlay */}
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContent}>
              {/* Location Badge with Edit Button */}
              <View style={styles.locationEditRow}>
                <View style={styles.modalLocationBadge}>
                  <Ionicons name="location" size={16} color={COLORS.primary} />
                  <Text style={styles.modalLocationText} numberOfLines={1}>
                    {location?.address || 'Location detected'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.editLocationBtn} onPress={handleAdjustLocation}>
                  <Text style={styles.editLocationText}>Adjust</Text>
                </TouchableOpacity>
              </View>

              {/* Question */}
              <View style={styles.confirmCard}>
                <Ionicons name="checkmark-circle" size={48} color={COLORS.primary} style={{ alignSelf: 'center', marginBottom: SPACING.md }} />
                <Text style={styles.confirmTitle}>Ready to Report?</Text>
                <Text style={styles.confirmSubtitle}>
                  This photo and your current location will be used to report the civic issue.
                </Text>

                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={styles.confirmButtonNo}
                    onPress={handleConfirmNo}
                  >
                    <Ionicons name="close" size={22} color={COLORS.textPrimary} />
                    <Text style={styles.confirmButtonNoText}>Retake</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButtonYes}
                    onPress={handleConfirmYes}
                  >
                    <Ionicons name="checkmark" size={22} color="#fff" />
                    <Text style={styles.confirmButtonYesText}>Use Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>

      {/* Map Adjustment Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setShowMapModal(false)} style={styles.closeMapBtn}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.mapHeaderTitle}>Set Location</Text>
            <TouchableOpacity onPress={handleMapConfirm} style={styles.confirmMapTopBtn}>
              <Text style={styles.confirmMapTopText}>Done</Text>
            </TouchableOpacity>
          </View>

          {tempLocation && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: tempLocation.latitude,
                longitude: tempLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: tempLocation.latitude,
                  longitude: tempLocation.longitude,
                }}
                draggable
                onDragEnd={(e: any) => {
                  setTempLocation({
                    ...tempLocation,
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                }}
              />
            </MapView>
          )}

          <View style={styles.mapFooter}>
            <Text style={styles.dragHint}>Drag the marker to pinpoint location</Text>
            <Button title="Confirm Location" onPress={handleMapConfirm} fullWidth />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonTop: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#fff',
  },
  locationLoadingText: {
    marginTop: 2,
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  locationReady: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationReadyText: {
    marginLeft: 4,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    maxWidth: 150,
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
  captureDisabled: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  captureHint: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  permissionTitle: {
    marginTop: SPACING.lg,
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  permissionText: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxl,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContent: {
    padding: SPACING.lg,
  },
  locationEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: 10,
  },
  modalLocationBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  editLocationBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.md,
  },
  editLocationText: {
    color: 'white',
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  modalLocationText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    maxWidth: 200,
  },
  confirmCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  confirmTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  confirmSubtitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  confirmButtonNo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
  },
  confirmButtonNoText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  confirmButtonYes: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  confirmButtonYesText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: '#fff',
  },
  // Map Modal Styles
  mapModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50, // Safe area
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeMapBtn: {
    padding: 5,
  },
  mapHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmMapTopBtn: {
    padding: 5,
  },
  confirmMapTopText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  mapFooter: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dragHint: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginBottom: 10,
    fontSize: 14,
  },
});
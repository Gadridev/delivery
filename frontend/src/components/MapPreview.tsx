import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface MapPreviewProps {
  address: string;
  trackingCode?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  address,
  trackingCode = '8472-91',
}) => {
  return (
    <View style={styles.container}>
      {/* Map visual background with road lines representation */}
      <View style={styles.mapCanvas}>
        {/* Stylized streets & river lines */}
        <View style={styles.streetHorizontal1} />
        <View style={styles.streetHorizontal2} />
        <View style={styles.streetDiagonal} />
        <View style={styles.streetVertical1} />
        <View style={styles.streetVertical2} />
        <View style={styles.riverCurve} />

        {/* Central Pin Marker */}
        <View style={styles.markerContainer}>
          <View style={styles.markerPulse} />
          <View style={styles.markerIcon}>
            <Ionicons name="location" size={20} color="#2563EB" />
          </View>
        </View>

        {/* Street Landmark Mock */}
        <View style={styles.landmarkBox}>
          <Text style={styles.landmarkText} numberOfLines={1}>
            {address}
          </Text>
        </View>

        {/* Top-left small label */}
        <View style={styles.metaLabel}>
          <Text style={styles.metaLabelText}>
            Livraison #{trackingCode}
          </Text>
        </View>

        {/* Zoom controls bottom right */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.7}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginVertical: 14,
    backgroundColor: '#EBF3FB',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF5FC',
  },
  streetHorizontal1: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  streetHorizontal2: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#FFFFFF',
  },
  streetVertical1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    width: 10,
    backgroundColor: '#FFFFFF',
  },
  streetVertical2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '25%',
    width: 8,
    backgroundColor: '#FFFFFF',
  },
  streetDiagonal: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: '45%',
    width: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '35deg' }],
  },
  riverCurve: {
    position: 'absolute',
    top: 70,
    left: -50,
    right: -50,
    height: 24,
    backgroundColor: '#DBEAFE',
    transform: [{ rotate: '-12deg' }],
  },
  markerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  markerPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
  },
  markerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  metaLabel: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  metaLabelText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  landmarkBox: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  landmarkText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  zoomControls: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
  },
  zoomBtn: {
    width: 26,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  zoomText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  zoomDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#CBD5E1',
  },
});

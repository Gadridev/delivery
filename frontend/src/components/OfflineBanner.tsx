import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface OfflineBannerProps {
  onRetry?: () => void;
  message?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  onRetry,
  message = 'Mode hors-ligne — Données locales sauvegardées',
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.left}>
        <Ionicons name="cloud-offline-outline" size={18} color="#D97706" />
        <Text style={styles.text}>{message}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
  },
  retryBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

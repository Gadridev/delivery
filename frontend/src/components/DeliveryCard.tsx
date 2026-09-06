import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IDelivery } from '../types/delivery';
import { StatusBadge } from './StatusBadge';
import { colors } from '../theme/colors';

interface DeliveryCardProps {
  delivery: IDelivery;
  onPress: () => void;
  onMapPress?: () => void;
  onActionPress?: () => void;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  onPress,
  onMapPress,
  onActionPress,
}) => {
  const isDelivered = delivery.status === 'delivered';
  const trackingCode = delivery._id ? delivery._id.slice(-5).toUpperCase() : '882-A';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Top Header */}
      <View style={styles.headerRow}>
        <Text style={styles.recipientName} numberOfLines={1}>
          {delivery.recipientName}
        </Text>
        <StatusBadge status={delivery.status} />
      </View>

      {/* Address */}
      <Text style={styles.address} numberOfLines={2}>
        {delivery.address}
      </Text>

      {/* Colis Reference */}
      <Text style={styles.colisRef}>
        Colis: #{trackingCode} {isDelivered ? '(Livré)' : '(Standard)'}
      </Text>

      {/* Urgent indicator for pending items */}
      {!isDelivered && (
        <View style={styles.urgentRow}>
          <Ionicons name="warning-outline" size={14} color={colors.tagUrgentText} />
          <Text style={styles.urgentText}>Prioritaire - À livrer</Text>
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation?.();
            if (onMapPress) onMapPress();
            else onPress();
          }}
          activeOpacity={0.6}
        >
          <Ionicons name="map-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.actionText}>Carte</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation?.();
            if (onActionPress) onActionPress();
            else onPress();
          }}
          activeOpacity={0.6}
        >
          {isDelivered ? (
            <>
              <Ionicons
                name="checkmark-done-outline"
                size={16}
                color={colors.deliveredText}
              />
              <Text style={[styles.actionText, { color: colors.deliveredText }]}>
                Preuve
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="call-outline"
                size={16}
                color={colors.textPrimary}
              />
              <Text style={styles.actionText}>Appeler</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  colisRef: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  urgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.tagUrgentBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  urgentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tagUrgentText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});

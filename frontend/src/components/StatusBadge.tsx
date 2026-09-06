import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeliveryStatus } from '../types/delivery';
import { colors } from '../theme/colors';

interface StatusBadgeProps {
  status: DeliveryStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
}) => {
  const isDelivered = status === 'delivered';

  return (
    <View
      style={[
        styles.badge,
        isDelivered ? styles.deliveredBadge : styles.pendingBadge,
        size === 'medium' && styles.mediumBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          isDelivered ? styles.deliveredText : styles.pendingText,
          size === 'medium' && styles.mediumBadgeText,
        ]}
      >
        {isDelivered ? 'LIVRÉ' : 'EN ATTENTE'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  pendingBadge: {
    backgroundColor: colors.pendingBg,
    borderColor: colors.pendingBorder,
    borderWidth: 0.5,
  },
  deliveredBadge: {
    backgroundColor: colors.deliveredBg,
    borderColor: colors.deliveredBorder,
    borderWidth: 0.5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  mediumBadgeText: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
  pendingText: {
    color: colors.pendingText,
  },
  deliveredText: {
    color: colors.deliveredText,
  },
});

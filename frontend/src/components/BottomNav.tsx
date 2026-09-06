import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type TabKey = 'deliveries' | 'new' | 'settings';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <View style={styles.container}>
      {/* Livraisons Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('deliveries')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconWrapper,
            activeTab === 'deliveries' ? styles.activePill : null,
          ]}
        >
          <Ionicons
            name="cube-outline"
            size={20}
            color={activeTab === 'deliveries' ? '#064E3B' : colors.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.label,
            activeTab === 'deliveries' ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          Livraisons
        </Text>
      </TouchableOpacity>

      {/* Nouveau Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('new')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconWrapper,
            activeTab === 'new' ? styles.activePill : null,
          ]}
        >
          <Ionicons
            name="add-outline"
            size={22}
            color={activeTab === 'new' ? '#064E3B' : colors.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.label,
            activeTab === 'new' ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          Nouveau
        </Text>
      </TouchableOpacity>

      {/* Paramètres Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('settings')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconWrapper,
            activeTab === 'settings' ? styles.activePill : null,
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={activeTab === 'settings' ? '#064E3B' : colors.textSecondary}
          />
        </View>
        <Text
          style={[
            styles.label,
            activeTab === 'settings' ? styles.activeLabel : styles.inactiveLabel,
          ]}
        >
          Paramètres
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 10,
    paddingTop: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: '#6EE7B7', // Mint green highlight pill
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#064E3B',
  },
  inactiveLabel: {
    color: colors.textSecondary,
  },
});

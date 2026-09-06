import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FilterStatus } from '../types/delivery';
import { colors } from '../theme/colors';

interface FilterCounts {
  all: number;
  pending: number;
  delivered: number;
}

interface FilterTabsProps {
  currentFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  counts: FilterCounts;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  currentFilter,
  onSelectFilter,
  counts,
}) => {
  const tabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Tous', count: counts.all },
    { key: 'pending', label: 'En attente', count: counts.pending },
    { key: 'delivered', label: 'Livré', count: counts.delivered },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive ? styles.activeTab : styles.inactiveTab]}
            onPress={() => onSelectFilter(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                isActive ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.filterPillActive,
  },
  inactiveTab: {
    backgroundColor: colors.filterPillInactive,
  },
  tabText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  activeTabText: {
    color: colors.filterPillActiveText,
  },
  inactiveTabText: {
    color: colors.filterPillInactiveText,
  },
});

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { IDelivery, FilterStatus, RootStackParamList } from '../types/delivery';
import { getAllDeliveries } from '../services/deliveries';
import {
  cacheDeliveries,
  getCachedDeliveries,
} from '../services/storage';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { DeliveryCard } from '../components/DeliveryCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { BottomNav, TabKey } from '../components/BottomNav';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DeliveryList'>;

export const DeliveryListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [deliveries, setDeliveries] = useState<IDelivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');

  const fetchDeliveriesData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setErrorMessage(null);

    try {
      const data = await getAllDeliveries();
      setDeliveries(data);
      setIsOffline(false);
      // Cache fresh data locally
      await cacheDeliveries(data);
    } catch (error) {
      console.warn('Network error, loading cache:', error);
      setIsOffline(true);
      setErrorMessage(
        error instanceof Error ? error.message : 'Impossible de contacter l’API.'
      );
      // Load cached data from AsyncStorage
      const cached = await getCachedDeliveries();
      if (cached && cached.length > 0) {
        setDeliveries(cached);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDeliveriesData();
    }, [fetchDeliveriesData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveriesData(true);
  };

  // Filter and search
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      // Status filter
      if (currentFilter === 'pending' && d.status !== 'pending') return false;
      if (currentFilter === 'delivered' && d.status !== 'delivered') return false;

      // Search query filter (recipientName or address)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = d.recipientName.toLowerCase().includes(query);
        const matchesAddress = d.address.toLowerCase().includes(query);
        return matchesName || matchesAddress;
      }

      return true;
    });
  }, [deliveries, currentFilter, searchQuery]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    const all = deliveries.length;
    const pending = deliveries.filter((d) => d.status === 'pending').length;
    const delivered = deliveries.filter((d) => d.status === 'delivered').length;
    return { all, pending, delivered };
  }, [deliveries]);

  const handleSelectTab = (tab: TabKey) => {
    if (tab === 'new') {
      navigation.navigate('CreateDelivery');
    } else if (tab === 'settings') {
      navigation.navigate('Settings');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Logistics Pro"
        onMenuPress={() =>
          Alert.alert(
            'Logistics Pro',
            'Application de suivi des livraisons v1.0.0\nDéveloppé pour transport & logistique.'
          )
        }
        onProfilePress={() => navigation.navigate('Settings')}
      />

      {isOffline && (
        <OfflineBanner
          onRetry={() => fetchDeliveriesData(true)}
          message="Mode hors-ligne — Affichage du cache AsyncStorage"
        />
      )}

      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.pageTitle}>Livraisons du jour</Text>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher destinataire, adresse..."
        />

        {/* Filter Pills */}
        <FilterTabs
          currentFilter={currentFilter}
          onSelectFilter={setCurrentFilter}
          counts={counts}
        />

        {/* Deliveries List */}
        {loading && !refreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primaryButton} />
            <Text style={styles.loadingText}>Chargement des livraisons...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDeliveries}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={({ item }) => (
              <DeliveryCard
                delivery={item}
                onPress={() => navigation.navigate('DeliveryDetail', { id: item._id })}
                onMapPress={() =>
                  navigation.navigate('DeliveryDetail', { id: item._id })
                }
                onActionPress={() =>
                  navigation.navigate('DeliveryDetail', { id: item._id })
                }
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primaryButton]}
                tintColor={colors.primaryButton}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="cube-outline"
                  size={56}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyTitle}>Aucune livraison trouvée</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery.trim()
                    ? 'Aucun résultat ne correspond à votre recherche.'
                    : currentFilter !== 'all'
                    ? 'Aucune livraison avec ce statut.'
                    : 'Commencez par ajouter votre première livraison.'}
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Action Button (FAB) */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateDelivery')}
          activeOpacity={0.85}
          accessibilityLabel="Ajouter une livraison"
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Tab Bar */}
      <BottomNav activeTab="deliveries" onSelectTab={handleSelectTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  listContent: {
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 30,
    lineHeight: 19,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primaryButton,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

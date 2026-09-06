import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, DeliveryConfirmationHistoryItem } from '../types/delivery';
import {
  getConfirmationHistory,
  clearAllStorage,
} from '../services/storage';
import { getApiUrl, setApiUrl, getDefaultApiUrl } from '../config/api';
import { Header } from '../components/Header';
import { BottomNav, TabKey } from '../components/BottomNav';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [apiUrl, setApiUrlState] = useState<string>(getApiUrl());
  const [history, setHistory] = useState<DeliveryConfirmationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const data = await getConfirmationHistory();
    setHistory(data);
    setLoadingHistory(false);
  };

  const handleSaveApiUrl = async () => {
    try {
      await setApiUrl(apiUrl.trim());
      Alert.alert('Succès', 'URL de l’API mise à jour.');
    } catch {
      Alert.alert('Erreur', 'Impossible d’enregistrer l’URL.');
    }
  };

  const handleResetApiUrl = async () => {
    const defaultUrl = getDefaultApiUrl();
    setApiUrlState(defaultUrl);
    await setApiUrl(defaultUrl);
    Alert.alert('Succès', `URL réinitialisée à : ${defaultUrl}`);
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Vider le cache local',
      'Êtes-vous sûr de vouloir supprimer toutes les données locales en cache et l’historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            await clearAllStorage();
            setHistory([]);
            Alert.alert('Succès', 'Cache local vidé avec succès.');
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleSelectTab = (tab: TabKey) => {
    if (tab === 'deliveries') {
      navigation.navigate('DeliveryList');
    } else if (tab === 'new') {
      navigation.navigate('CreateDelivery');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Paramètres & Historique"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Livreur #08 — Logistics Pro</Text>
            <Text style={styles.profileRole}>Secteur : Paris Centre & Ouest</Text>
          </View>
        </View>

        {/* Section 1: API Configuration */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.sectionTitle}>Configuration Serveur API</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Adresse du backend Express / MongoDB.
          </Text>

          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrlState}
            placeholder="http://localhost:5000/api"
            placeholderTextColor={colors.inputPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveApiUrl}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Appliquer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetApiUrl}
              activeOpacity={0.7}
            >
              <Text style={styles.resetBtnText}>Défaut</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 2: Bonus 3 - Historique local des confirmations */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.deliveredText}
            />
            <Text style={styles.sectionTitle}>
              Historique des Confirmations ({history.length})
            </Text>
          </View>
          <Text style={styles.sectionDesc}>
            Trace locale des livraisons validées (conservée dans AsyncStorage).
          </Text>

          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons
                name="checkmark-circle-outline"
                size={36}
                color={colors.textMuted}
              />
              <Text style={styles.emptyHistoryText}>
                Aucune confirmation enregistrée pour le moment.
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((item, index) => (
                <View key={item.deliveryId || index} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.deliveredText}
                    />
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyName}>
                      {item.recipientName}
                    </Text>
                    <Text style={styles.historyAddress} numberOfLines={1}>
                      {item.address}
                    </Text>
                    <Text style={styles.historyDate}>
                      Confirmé le {formatDate(item.confirmedAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 3: Cache Management */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trash-outline" size={20} color={colors.dangerText} />
            <Text style={[styles.sectionTitle, { color: colors.dangerText }]}>
              Maintenance & Cache
            </Text>
          </View>
          <Text style={styles.sectionDesc}>
            Vider le stockage hors-ligne et réinitialiser les données locales.
          </Text>

          <TouchableOpacity
            style={styles.clearCacheBtn}
            onPress={handleClearCache}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-bin-outline" size={18} color={colors.dangerText} />
            <Text style={styles.clearCacheBtnText}>Vider le cache AsyncStorage</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav activeTab="settings" onSelectTab={handleSelectTab} />
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
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryButton,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileRole: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  saveBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.primaryButton,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  resetBtn: {
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  historyList: {
    gap: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.deliveredBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  historyContent: {
    flex: 1,
  },
  historyName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historyAddress: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontSize: 11.5,
    color: colors.deliveredText,
    fontWeight: '600',
    marginTop: 3,
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    marginTop: 4,
  },
  clearCacheBtnText: {
    color: colors.dangerText,
    fontWeight: '700',
    fontSize: 14,
  },
});

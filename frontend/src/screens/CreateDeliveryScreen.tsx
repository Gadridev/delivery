import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/delivery';
import { createDelivery } from '../services/deliveries';
import { Header } from '../components/Header';
import { DeliveryForm, DeliveryFormData } from '../components/DeliveryForm';
import { BottomNav, TabKey } from '../components/BottomNav';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateDelivery'>;

export const CreateDeliveryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async (formData: DeliveryFormData) => {
    setLoading(true);
    try {
      await createDelivery(formData);
      Alert.alert('Succès', 'La livraison a été créée avec succès.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('DeliveryList'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Erreur de validation',
        error instanceof Error
          ? error.message
          : 'Impossible de créer la livraison. Veuillez vérifier les champs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTab = (tab: TabKey) => {
    if (tab === 'deliveries') {
      navigation.navigate('DeliveryList');
    } else if (tab === 'settings') {
      navigation.navigate('Settings');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Logistics Pro"
        showBack
        onBack={() => navigation.goBack()}
        onProfilePress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Title */}
        <Text style={styles.title}>Nouveau Colis</Text>
        <Text style={styles.subtitle}>
          Saisissez les informations de livraison pour planifier l'expédition.
        </Text>

        {/* Form */}
        <DeliveryForm
          onSubmit={handleCreate}
          onCancel={() => navigation.goBack()}
          isLoading={loading}
          submitLabel="Enregistrer"
        />
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav activeTab="new" onSelectTab={handleSelectTab} />
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
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
});

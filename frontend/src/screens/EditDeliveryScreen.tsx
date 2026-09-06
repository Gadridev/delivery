import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/delivery';
import { updateDelivery } from '../services/deliveries';
import { Header } from '../components/Header';
import { DeliveryForm, DeliveryFormData } from '../components/DeliveryForm';
import { colors } from '../theme/colors';

type EditRouteProp = RouteProp<RootStackParamList, 'EditDelivery'>;
type EditNavProp = NativeStackNavigationProp<RootStackParamList, 'EditDelivery'>;

export const EditDeliveryScreen: React.FC = () => {
  const route = useRoute<EditRouteProp>();
  const navigation = useNavigation<EditNavProp>();
  const { id, delivery } = route.params;

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async (formData: DeliveryFormData) => {
    setLoading(true);
    try {
      await updateDelivery(id, formData);
      Alert.alert('Succès', 'La livraison a été modifiée avec succès.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('DeliveryDetail', { id }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Erreur de mise à jour',
        error instanceof Error
          ? error.message
          : 'Impossible de mettre à jour la livraison.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Modifier la livraison"
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Modifier le Colis</Text>
        <Text style={styles.subtitle}>
          Corrigez les informations du destinataire ou de l'adresse de destination.
        </Text>

        <DeliveryForm
          initialValues={{
            recipientName: delivery.recipientName,
            address: delivery.address,
          }}
          onSubmit={handleUpdate}
          onCancel={() => navigation.goBack()}
          isLoading={loading}
          submitLabel="Mettre à jour"
        />
      </ScrollView>
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

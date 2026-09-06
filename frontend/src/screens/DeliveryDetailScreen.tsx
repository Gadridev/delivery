import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { IDelivery, RootStackParamList } from '../types/delivery';
import {
  getDeliveryById,
  confirmDelivery,
  updateDelivery,
  deleteDelivery,
} from '../services/deliveries';
import { addConfirmationHistory } from '../services/storage';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { MapPreview } from '../components/MapPreview';
import { ConfirmModal } from '../components/ConfirmModal';
import { colors } from '../theme/colors';

type DetailRouteProp = RouteProp<RootStackParamList, 'DeliveryDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList, 'DeliveryDetail'>;

export const DeliveryDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { id } = route.params;

  const [delivery, setDelivery] = useState<IDelivery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeliveryById(id);
      setDelivery(data);
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error
          ? error.message
          : 'Impossible de charger la livraison.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const formatDate = (dateString?: string | null): string => {
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

  // Requirement 5: Address validation and delivery confirmation
  const handleConfirmAddress = async (validatedAddress: string) => {
    if (!delivery) return;
    setIsConfirming(true);

    try {
      // If address was updated during confirmation, save it
      if (validatedAddress !== delivery.address) {
        await updateDelivery(delivery._id, { address: validatedAddress });
      }

      // Confirm delivery (PATCH /api/deliveries/:id/confirm)
      const confirmed = await confirmDelivery(delivery._id);
      setDelivery(confirmed);
      setConfirmModalVisible(false);

      // Save to local confirmation history (Bonus 3)
      await addConfirmationHistory({
        deliveryId: confirmed._id,
        recipientName: confirmed.recipientName,
        address: confirmed.address,
        confirmedAt: confirmed.confirmedAt || new Date().toISOString(),
      });

      Alert.alert(
        'Succès',
        `La livraison pour ${confirmed.recipientName} a été confirmée avec succès.`
      );
    } catch (error) {
      Alert.alert(
        'Erreur de confirmation',
        error instanceof Error
          ? error.message
          : 'Impossible de confirmer la livraison.'
      );
    } finally {
      setIsConfirming(false);
    }
  };

  // Requirement 7: Delete delivery with confirmation
  const handleDelete = () => {
    if (!delivery) return;

    Alert.alert(
      'Supprimer la livraison',
      `Êtes-vous sûr de vouloir supprimer définitivement la livraison pour "${delivery.recipientName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteDelivery(delivery._id);
              Alert.alert('Succès', 'La livraison a été supprimée.');
              navigation.navigate('DeliveryList');
            } catch (error) {
              Alert.alert(
                'Erreur',
                error instanceof Error
                  ? error.message
                  : 'Échec de la suppression.'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!delivery) return;
    if (delivery.status === 'delivered') {
      Alert.alert(
        'Modification impossible',
        'Une livraison déjà confirmée ne peut plus être modifiée.'
      );
      return;
    }
    navigation.navigate('EditDelivery', { id: delivery._id, delivery });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Détail de la livraison"
          showBack
          onBack={() => navigation.goBack()}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryButton} />
          <Text style={styles.loadingText}>Chargement des détails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!delivery) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Détail de la livraison"
          showBack
          onBack={() => navigation.goBack()}
        />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={50} color={colors.dangerText} />
          <Text style={styles.errorText}>Livraison introuvable</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Retour à la liste</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isDelivered = delivery.status === 'delivered';
  const trackingCode = delivery._id
    ? `LD-${delivery._id.slice(-6).toUpperCase()}`
    : 'LD-8472-91';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Détail de la livraison"
        showBack
        onBack={() => navigation.goBack()}
        onProfilePress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Details Card */}
        <View style={styles.card}>
          {/* Top Header Row with Name & Status */}
          <View style={styles.titleRow}>
            <Text style={styles.recipientName}>{delivery.recipientName}</Text>
            <StatusBadge status={delivery.status} size="medium" />
          </View>

          {/* Subtitle Tracking ID */}
          <Text style={styles.trackingId}>Livraison #{trackingCode}</Text>

          {/* Full Address Block */}
          <View style={styles.addressBlock}>
            <Ionicons
              name="location"
              size={22}
              color={colors.textPrimary}
              style={styles.addressPin}
            />
            <View style={styles.addressTextWrapper}>
              <Text style={styles.addressMain}>{delivery.address}</Text>
              <Text style={styles.addressSub}>
                Instructions : Remettre en main propre au destinataire
              </Text>
            </View>
          </View>

          {/* Map Preview Card */}
          <MapPreview
            address={delivery.address}
            trackingCode={trackingCode}
          />

          {/* Meta Info Row (Creation & Confirmation / Schedule) */}
          <View style={styles.metaRow}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>CRÉATION</Text>
              <Text style={styles.metaValue}>
                {formatDate(delivery.createdAt)}
              </Text>
            </View>

            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>
                {isDelivered ? 'LIVRÉ LE' : 'CRÉNEAU PRÉVU'}
              </Text>
              <Text style={styles.metaValue}>
                {isDelivered
                  ? formatDate(delivery.confirmedAt)
                  : 'Aujourd’hui, 14:00 - 18:00'}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action: Confirm Delivery */}
        {!isDelivered ? (
          <TouchableOpacity
            style={styles.primaryConfirmBtn}
            onPress={() => setConfirmModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.primaryConfirmText}>
              Confirmer la livraison
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.deliveredBanner}>
            <Ionicons
              name="checkmark-done-circle"
              size={24}
              color={colors.deliveredText}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.deliveredBannerTitle}>
                Livraison effectuée avec succès
              </Text>
              <Text style={styles.deliveredBannerSubtitle}>
                Validée le {formatDate(delivery.confirmedAt)}
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Actions: Modifier & Supprimer */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              isDelivered && styles.secondaryBtnDisabled,
            ]}
            onPress={handleEdit}
            disabled={isDelivered}
            activeOpacity={0.7}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={isDelivered ? colors.textMuted : colors.textPrimary}
            />
            <Text
              style={[
                styles.secondaryBtnText,
                isDelivered && { color: colors.textMuted },
              ]}
            >
              Modifier
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleDelete}
            disabled={isDeleting}
            activeOpacity={0.7}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={colors.dangerText} />
            ) : (
              <>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={colors.dangerText}
                />
                <Text style={styles.dangerBtnText}>Supprimer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal with Address Verification (Requirement 5) */}
      <ConfirmModal
        visible={confirmModalVisible}
        recipientName={delivery.recipientName}
        initialAddress={delivery.address}
        isLoading={isConfirming}
        onConfirm={handleConfirmAddress}
        onClose={() => setConfirmModalVisible(false)}
      />
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
    letterSpacing: -0.5,
  },
  trackingId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 14,
  },
  addressBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 4,
  },
  addressPin: {
    marginRight: 10,
    marginTop: 2,
  },
  addressTextWrapper: {
    flex: 1,
  },
  addressMain: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  addressSub: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  primaryConfirmBtn: {
    backgroundColor: colors.primaryButton,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 54,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  deliveredBanner: {
    backgroundColor: colors.deliveredBg,
    borderColor: colors.deliveredBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  deliveredBannerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.deliveredText,
  },
  deliveredBannerSubtitle: {
    fontSize: 12.5,
    color: '#166534',
    marginTop: 2,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },
  secondaryBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dangerBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 48,
    backgroundColor: colors.dangerBg,
    borderRadius: 14,
  },
  dangerBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.dangerText,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dangerText,
    marginTop: 10,
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

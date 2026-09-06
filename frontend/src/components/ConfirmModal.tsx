import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface ConfirmModalProps {
  visible: boolean;
  recipientName: string;
  initialAddress: string;
  isLoading: boolean;
  onConfirm: (validatedAddress: string) => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  recipientName,
  initialAddress,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAddress(initialAddress);
    setError(null);
  }, [initialAddress, visible]);

  const handleValidate = () => {
    if (!address.trim() || address.trim().length < 5) {
      setError('L’adresse de livraison doit contenir au moins 5 caractères.');
      return;
    }
    setError(null);
    onConfirm(address.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={28}
                  color={colors.accentGreen}
                />
              </View>
              <Text style={styles.title}>Confirmer la livraison</Text>
              <Text style={styles.subtitle}>
                Vérifiez et validez l'adresse de destination pour{' '}
                <Text style={{ fontWeight: '800', color: colors.textPrimary }}>
                  {recipientName}
                </Text>
                .
              </Text>
            </View>

            {/* Address Input / Verification */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Adresse de livraison validée</Text>
              <View style={[styles.inputBox, error ? styles.inputBoxError : null]}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    if (error) setError(null);
                  }}
                  multiline
                  numberOfLines={3}
                  placeholder="Vérifiez l'adresse exacte..."
                  placeholderTextColor={colors.inputPlaceholder}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleValidate}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.confirmBtnText}>
                      Valider et marquer Livré
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.deliveredBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18.5,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
  },
  inputBoxError: {
    borderColor: colors.dangerText,
    backgroundColor: colors.dangerBg,
  },
  inputIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerText,
    marginTop: 6,
    fontWeight: '600',
  },
  actions: {
    gap: 10,
  },
  confirmBtn: {
    backgroundColor: colors.primaryButton,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 50,
    borderRadius: 14,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 14.5,
    fontWeight: '700',
  },
});

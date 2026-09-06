import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export interface DeliveryFormData {
  recipientName: string;
  address: string;
}

interface DeliveryFormProps {
  initialValues?: DeliveryFormData;
  onSubmit: (data: DeliveryFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  initialValues = { recipientName: '', address: '' },
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Enregistrer',
}) => {
  const [recipientName, setRecipientName] = useState(initialValues.recipientName);
  const [address, setAddress] = useState(initialValues.address);
  const [errors, setErrors] = useState<{ recipientName?: string; address?: string }>({});

  const validate = (): boolean => {
    const newErrors: { recipientName?: string; address?: string } = {};

    if (!recipientName.trim()) {
      newErrors.recipientName = 'Le nom du destinataire est obligatoire.';
    } else if (recipientName.trim().length < 3) {
      newErrors.recipientName = 'Le nom doit contenir au moins 3 caractères.';
    }

    if (!address.trim()) {
      newErrors.address = 'L’adresse de livraison est obligatoire.';
    } else if (address.trim().length < 5) {
      newErrors.address = 'L’adresse doit contenir au moins 5 caractères.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        recipientName: recipientName.trim(),
        address: address.trim(),
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* Recipient Name Field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nom du destinataire</Text>
        <View
          style={[
            styles.inputContainer,
            errors.recipientName ? styles.inputError : null,
          ]}
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={colors.textSecondary}
            style={styles.fieldIcon}
          />
          <TextInput
            style={styles.input}
            value={recipientName}
            onChangeText={(text) => {
              setRecipientName(text);
              if (errors.recipientName) {
                setErrors((prev) => ({ ...prev, recipientName: undefined }));
              }
            }}
            placeholder="ex: Entreprise ABC ou Jean Dupont"
            placeholderTextColor={colors.inputPlaceholder}
            autoCapitalize="words"
            editable={!isLoading}
          />
        </View>
        {errors.recipientName && (
          <Text style={styles.errorText}>{errors.recipientName}</Text>
        )}
      </View>

      {/* Address Field */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Adresse de livraison</Text>
        <View
          style={[
            styles.inputContainer,
            styles.textAreaContainer,
            errors.address ? styles.inputError : null,
          ]}
        >
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.textSecondary}
            style={[styles.fieldIcon, { marginTop: 4 }]}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              if (errors.address) {
                setErrors((prev) => ({ ...prev, address: undefined }));
              }
            }}
            placeholder="Saisissez l'adresse complète (rue, code postal, ville)"
            placeholderTextColor={colors.inputPlaceholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>
        {errors.address && (
          <Text style={styles.errorText}>{errors.address}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>{submitLabel}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    height: 105,
    paddingVertical: 10,
  },
  inputError: {
    borderColor: colors.dangerText,
    backgroundColor: colors.dangerBg,
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: colors.textPrimary,
    height: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
    height: '100%',
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerText,
    marginTop: 6,
    fontWeight: '600',
  },
  buttonGroup: {
    marginTop: 10,
    gap: 12,
  },
  submitButton: {
    backgroundColor: colors.primaryButton,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
  },
  submitButtonText: {
    color: colors.primaryButtonText,
    fontSize: 15.5,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

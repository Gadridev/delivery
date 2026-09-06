import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDelivery, DeliveryConfirmationHistoryItem } from '../types/delivery';

const DELIVERIES_CACHE_KEY = '@logistics_pro_deliveries_cache';
const CONFIRMATION_HISTORY_KEY = '@logistics_pro_confirmation_history';

/**
 * Cache deliveries list into AsyncStorage for offline access
 */
export const cacheDeliveries = async (deliveries: IDelivery[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(deliveries);
    await AsyncStorage.setItem(DELIVERIES_CACHE_KEY, jsonValue);
  } catch (error) {
    console.error('Error caching deliveries to AsyncStorage:', error);
  }
};

/**
 * Retrieve cached deliveries list from AsyncStorage
 */
export const getCachedDeliveries = async (): Promise<IDelivery[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DELIVERIES_CACHE_KEY);
    return jsonValue != null ? (JSON.parse(jsonValue) as IDelivery[]) : [];
  } catch (error) {
    console.error('Error reading deliveries cache:', error);
    return [];
  }
};

/**
 * Save a confirmed delivery in local history
 */
export const addConfirmationHistory = async (
  item: DeliveryConfirmationHistoryItem
): Promise<void> => {
  try {
    const current = await getConfirmationHistory();
    // Filter out if already exists, then prepend latest
    const filtered = current.filter((h) => h.deliveryId !== item.deliveryId);
    const updated = [item, ...filtered];
    await AsyncStorage.setItem(CONFIRMATION_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding confirmation history:', error);
  }
};

/**
 * Get all confirmed deliveries from local history
 */
export const getConfirmationHistory = async (): Promise<
  DeliveryConfirmationHistoryItem[]
> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CONFIRMATION_HISTORY_KEY);
    return jsonValue != null
      ? (JSON.parse(jsonValue) as DeliveryConfirmationHistoryItem[])
      : [];
  } catch (error) {
    console.error('Error reading confirmation history:', error);
    return [];
  }
};

/**
 * Clear all cache & history
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DELIVERIES_CACHE_KEY);
    await AsyncStorage.removeItem(CONFIRMATION_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};

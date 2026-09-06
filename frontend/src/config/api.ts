import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL_KEY = '@logistics_pro_api_url';

// Default backend port is 5000 (standard in Express backends)
const DEFAULT_PORT = 5000;

export const getDefaultApiUrl = (): string => {
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}/api`;
  }
  return `http://localhost:${DEFAULT_PORT}/api`;
};

let currentApiUrl = getDefaultApiUrl();

export const initApiUrl = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(API_BASE_URL_KEY);
    if (saved) {
      currentApiUrl = saved;
    } else {
      currentApiUrl = getDefaultApiUrl();
    }
  } catch {
    currentApiUrl = getDefaultApiUrl();
  }
  return currentApiUrl;
};

export const getApiUrl = (): string => {
  return currentApiUrl;
};

export const setApiUrl = async (newUrl: string): Promise<void> => {
  currentApiUrl = newUrl;
  await AsyncStorage.setItem(API_BASE_URL_KEY, newUrl);
};

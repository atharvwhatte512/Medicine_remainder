import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Keys for different types of data
export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  SETTINGS: '@settings',
  // Add more keys as needed
};

// Type for storage operations
export type StorageKey = keyof typeof STORAGE_KEYS;

// Helper to determine if we're on web
const isWeb = Platform.OS === 'web';

// Save data to storage
export const saveData = async (key: StorageKey, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    if (isWeb) {
      localStorage.setItem(STORAGE_KEYS[key], jsonValue);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS[key], jsonValue);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

// Get data from storage
export const getData = async <T>(key: StorageKey): Promise<T | null> => {
  try {
    let jsonValue: string | null;
    if (isWeb) {
      jsonValue = localStorage.getItem(STORAGE_KEYS[key]);
    } else {
      jsonValue = await AsyncStorage.getItem(STORAGE_KEYS[key]);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading data:', error);
    throw error;
  }
};

// Remove data from storage
export const removeData = async (key: StorageKey): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    }
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

// Clear all data from storage
export const clearAll = async (): Promise<void> => {
  try {
    if (isWeb) {
      localStorage.clear();
    } else {
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};

// Get all keys from storage
export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    if (isWeb) {
      return Object.keys(localStorage);
    } else {
      return await AsyncStorage.getAllKeys();
    }
  } catch (error) {
    console.error('Error getting all keys:', error);
    throw error;
  }
}; 
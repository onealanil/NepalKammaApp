import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorToast } from '../components/ErrorToast';

//set the item in async storage
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

//set the item in async storage
export const setToken = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

//get the item from async storage
export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {
    ErrorToast('Error occured while getting item from async storage');
  }
};

//remove the item from async storage
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    ErrorToast('Error occured while removing item from async storage');
  }
};

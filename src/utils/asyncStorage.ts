import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from "react-native-keychain";
import { ErrorToast } from '../components/ErrorToast';

//set the item in async storage
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    // await Keychain.setGenericPassword(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

//set the onboarding item in async storage
export const setItemOnboarding = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

//set the item in async storage
export const setToken = async (value: string) => {
  try {
    await Keychain.setGenericPassword("currentUser", value);
  } catch (err) {
    ErrorToast('Error occurred while setting item in Keychain');
  }
};

//get the item from async storage
export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    // const value = await Keychain.getGenericPassword();
    if (!value) {
      return null;
    }
    return value;
  } catch (err) {
    ErrorToast('Error occured while getting item from async storage');
  }
};

//get item from async storage
export const getItemOnboarding = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      return null;
    }
    return value;
  } catch (err) {
    ErrorToast('Error occured while getting item from async storage');
  }
}

//remove the item from async storage
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    // await Keychain.resetGenericPassword(key);
  } catch (err) {
    ErrorToast('Error occured while removing item from async storage');
  }
};

//export key chain token
export const getTokenKeyChain = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.username === "currentUser") {
      return credentials.password; // Return the token (password)
    }
    return null;
  } catch (err) {
    console.error('Error occurred while getting item from Keychain', err);
    return null;
  }
};

//remove key chain token
export const removeTokenKeyChain = async () => {
  try {
    await Keychain.resetGenericPassword(); // Clear the Keychain
  } catch (err) {
    ErrorToast('Error occurred while removing item from Keychain');
  }
};



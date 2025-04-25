/**
 * @file asyncStorage.ts
 * @description This file contains functions to set, get, and remove items from AsyncStorage and Keychain.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from "react-native-keychain";
import { ErrorToast } from '../components/ErrorToast';

/**
 * 
 * @param key -string key to set the item
 * @param value -string value to set for the key
 * @function setItem - sets the item in async storage and keychain
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while setting the item in async storage or keychain
 */
export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    // await Keychain.setGenericPassword(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

/**
 * 
 * @param key - string key to set the item
 * @param value - string value to set for the key
 * @function setItemOnboarding - sets the item in async storage
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while setting the item in async storage
 */
export const setItemOnboarding = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    ErrorToast('Error occured while setting item in async storage');
  }
};

/**
 * 
 * @param value - string value to set for the key
 * @function setToken - sets the token in keychain
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while setting the token in keychain
 */
export const setToken = async (value: string) => {
  try {
    await Keychain.setGenericPassword("currentUser", value);
  } catch (err) {
    ErrorToast('Error occurred while setting item in Keychain');
  }
};

/**
 * 
 * @param key - string key to get the item
 * @returns {Promise<string | null>} - returns a promise that resolves to the value of the key or null if the key does not exist
 * @throws {Error} - throws an error if there is an error while getting the item from async storage or keychain
 */
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

/**
 * 
 * @param key - string key to get the item
 * @returns {Promise<string | null>} - returns a promise that resolves to the value of the key or null if the key does not exist
 * @throws {Error} - throws an error if there is an error while getting the item from async storage
 */
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

/**
 * 
 * @param key - string key to remove the item
 * @function removeItem - removes the item from async storage and keychain
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while removing the item from async storage or keychain
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    // await Keychain.resetGenericPassword(key);
  } catch (err) {
    ErrorToast('Error occured while removing item from async storage');
  }
};

/**
 * @description This function retrieves the token from the Keychain.
 * @function getTokenKeyChain - retrieves the token from the Keychain
 * @returns {Promise<string | null>} - returns a promise that resolves to the token or null if the token does not exist
 * @throws {Error} - throws an error if there is an error while getting the token from keychain
 * 
 */
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

/**
 * @description This function removes the token from the Keychain.
 * @function removeTokenKeyChain - removes the token from the Keychain
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while removing the token from keychain
 */
export const removeTokenKeyChain = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword(); // Clear the Keychain
  } catch (err) {
    ErrorToast('Error occurred while removing item from Keychain');
  }
};



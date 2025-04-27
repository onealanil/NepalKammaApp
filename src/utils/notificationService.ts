/**
 * @file notificationService.ts
 * @description This file contains functions to request user permission for notifications and get the FCM token.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import {ErrorToast} from '../components/ErrorToast';

/**
 * @function requestUserPermission - requests user permission for notifications
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while requesting user permission for notifications
 * @description This function checks the platform and version of the device and requests user permission for notifications accordingly. If the permission is granted, it calls the getFCMToken function to get the FCM token.
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @async
 */
export async function requestUserPermission() {
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await getFCMToken();
    } else {
      ErrorToast('permission denied');
    }
  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // ErrorToast('permission granted');
      await getFCMToken();
    }
  }
}

/**
 * @function getFCMToken - gets the FCM token
 * @returns {Promise<void>} - returns a promise that resolves to void
 * @throws {Error} - throws an error if there is an error while getting the FCM token
 * @description This function registers the device for remote messages and gets the FCM token. If the token is already present in AsyncStorage, it does not generate a new one. If the token is not present, it generates a new one and stores it in AsyncStorage.
 * @async
 */
const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    // if it is still signin 
    let fcmToken = await AsyncStorage.getItem('fcm_token');
    
    if (fcmToken) {
    } else {
      //logout ---> remove fcm token and generate new one
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcm_token', token);
    }
  } catch (error) {
    ErrorToast('Error occured while getting FCM token');
  }
};

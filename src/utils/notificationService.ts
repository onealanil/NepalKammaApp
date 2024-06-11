import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import {ErrorToast} from '../components/ErrorToast';

export async function requestUserPermission() {
  if (Platform.OS == 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      getFCMToken();
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
      getFCMToken();
    }
  }
}

const getFCMToken = async () => {
  try {
    await messaging().registerDeviceForRemoteMessages();
    // if it is still signin 
    let fcmToken = await AsyncStorage.getItem('fcm_token');
    console.log('fcmToken:', fcmToken)
    
    if (fcmToken) {
    } else {
      //logout ---> remove fcm token and generate new one
      const token = await messaging().getToken();
      console.log("fcm token:" ,token)
      await AsyncStorage.setItem('fcm_token', token);
    }
  } catch (error) {
    ErrorToast('Error occured while getting FCM token');
  }
};

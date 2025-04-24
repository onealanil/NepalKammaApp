/**
 * @file SuccessToast.tsx
 * @description This file contains the SuccessToast component, which is used to display a success message using the react-native-toast-message library.
 * @component
 */
import Toast from 'react-native-toast-message';

export const SuccessToast = (message: string) => {
  return Toast.show({
    type: 'success',
    text1: message,
  });
};

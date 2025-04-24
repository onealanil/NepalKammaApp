/**
 * @file ErrorToast.tsx
 * @description This file contains a function that displays a toast message with an error message.
 */
import Toast from 'react-native-toast-message';

/**
 *
 * @param error - The error message to be displayed in the toast.
 * @returns A toast message with the error message.
 * @description This function displays a toast message with the error message passed to it. The toast is of type 'error' and displays the error message as text1.
 */
export const ErrorToast = (error: string) => {
  return Toast.show({
    type: 'error',
    text1: error,
  });
};

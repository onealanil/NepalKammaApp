import Toast from 'react-native-toast-message';

export const SuccessToast = (message: string) => {
  return Toast.show({
    type: 'success',
    text1: message,
  });
};

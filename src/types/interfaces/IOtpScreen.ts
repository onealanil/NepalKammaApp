import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamsList } from '../../navigation/AppStack';



export interface OtpScreenProps {
    navigation?: StackNavigationProp<RootStackParamsList>;
    route?: RouteProp<RootStackParamsList, 'OTP'>;
}

export interface LoginSignupStoreState {
    verifyUser: (data: { userId: string; otp: string }) => Promise<any>;
    resendOTP: (data: { userId: string; email: string }) => Promise<any>;
}
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../navigation/AppStack';

export interface ResetPasswordProps {
    email: string;
    password: string;
    confirmPassword?: string;
    security_answer?: string;
}

export interface LoginSignupStoreState {
    forgotPassword: (values: ResetPasswordProps) => Promise<any>;
}

export interface ForgetPassScreenProps {
    navigation: StackNavigationProp<RootStackParamsList>;
}
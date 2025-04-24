import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';

export interface SignUpDetails {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  security_answer?: string;
  role?: string | null;
  gender?: string | null;
  fcm_token?: string | null;
}

export interface SignupFormProps {
  navigation: StackNavigationProp<RootStackParamsList>;
  role: any;
}

export interface LoginSignupStoreState {
  signupUser: (values: SignUpDetails) => Promise<any>;
}
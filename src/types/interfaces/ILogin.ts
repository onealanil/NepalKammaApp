import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';


export interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamsList>;
}

export interface LoginDetails {
  email: string;
  password: string;
  fcm_token?: string;
}

export interface LoginSignupStoreState {
  loginUser: (values: LoginDetails) => Promise<any>;
}
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';

export interface mainHomeStoreState {
  checkAuth: () => Promise<any>;
}

export interface userStateProps {
  user: any;
}

export interface MainHomeScreenProps {
  navigation: StackNavigationProp<RootStackParamsList>;
}
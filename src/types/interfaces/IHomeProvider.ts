import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';


export interface logOutProps {
  navigation: StackNavigationProp<RootStackParamsList>;
  bottomNavigation: BottomTabNavigationProp<BottomStackParamsList>;
}

export type userStateProps = {
  __v: number;
  _id: string;
  email: string;
  isVerified: boolean;
  role: string;
  username: string;
  location: string;
  profilePic: any;
  title: string;
  skills: any[];
  isTick: boolean;
  bio: string;
  about_me: string;
  phoneNumber: string;
  isDocumentVerified: string;
};

export type dataProps = {
  id: number;
  what: string;
  text: string;
};

export interface GigData {
  gig: any[];
}

export interface getJobProps {
  getGig: () => Promise<GigData>;
}

export const initialGigData: GigData = {
  gig: [],
};
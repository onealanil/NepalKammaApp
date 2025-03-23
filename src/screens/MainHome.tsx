import React, {useEffect} from 'react';
import {useGlobalStore} from '../global/store';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../navigation/AppStack';
import Loading from './GlobalComponents/Loading';
import {getTokenKeyChain, removeTokenKeyChain} from '../utils/asyncStorage';

interface mainHomeStoreState {
  checkAuth: () => Promise<any>;
}

interface userStateProps {
  user: any;
}

interface MainHomeScreenProps {
  navigation: StackNavigationProp<RootStackParamsList>;
}

const MainHome = React.memo(({navigation}: MainHomeScreenProps) => {
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getTokenKeyChain(); // Retrieve the token
      if (token) {
        const response = await (
          useGlobalStore.getState() as mainHomeStoreState
        ).checkAuth();

        if (response) {
          const getUser = (useGlobalStore.getState() as userStateProps).user;
          if (getUser && getUser.role === 'job_seeker') {
            navigation.replace('Job_Seeker');
          } else if (getUser && getUser.role === 'job_provider') {
            navigation.replace('Job_Provider');
          }
        } else {
          await removeTokenKeyChain(); // Clear the token from Keychain
          useGlobalStore.setState({user: null});
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        }
      } else {
        // No token found, navigate to login
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      }
    };
    checkAuthentication();
  }, []);

  return <Loading />;
});

export default MainHome;

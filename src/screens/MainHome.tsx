import React, {useEffect} from 'react';
import {useGlobalStore} from '../global/store';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../navigation/AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './GlobalComponents/Loading';

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
      const response = await (
        useGlobalStore.getState() as mainHomeStoreState
      ).checkAuth();

      // if response is true
      if (response) {
        const getUser = (useGlobalStore.getState() as userStateProps).user;
        // if user is job seeker
        getUser &&
          getUser.role === 'job_seeker' &&
          navigation.replace('Job_Seeker');
        // if user is job provider
        getUser &&
          getUser.role === 'job_provider' &&
          navigation.replace('Job_Provider');
      } else {
        // not logged in than clear the id in local storage
        AsyncStorage.removeItem('currentUser');
        useGlobalStore.setState({user: null});
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

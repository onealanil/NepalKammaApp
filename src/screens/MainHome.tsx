/**
 * @file MainHome.tsx
 * @description This file contains the MainHome component, which is responsible for checking the authentication status of the user and navigating to the appropriate screen based on their role.
 * @author Anil Bhandari
 */

import React, {useEffect} from 'react';
import {useGlobalStore} from '../global/store';
import Loading from './GlobalComponents/Loading';
import {getTokenKeyChain, removeTokenKeyChain} from '../utils/asyncStorage';
import {
  MainHomeScreenProps,
  mainHomeStoreState,
  userStateProps,
} from '../types/interfaces/IMainHome';

/**
 * @function MainHome
 * @description This component checks the authentication status of the user and navigates to the appropriate screen based on their role.
 * @param {MainHomeScreenProps} navigation - The navigation prop passed from the parent component.
 * @returns {JSX.Element} - A loading component while checking authentication.
 */
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

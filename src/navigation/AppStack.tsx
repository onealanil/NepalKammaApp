/**
 * @file AppStack.tsx
 * @description This file contains the AppStack component which is responsible for managing the navigation stack of the application.
 * It includes the onboarding screen, login screen, signup screen, OTP screen, home screen, and the drawer stacks for job seekers and job providers.
 * @author Anil Bhandari
 */

import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getItemOnboarding, getTokenKeyChain} from '../utils/asyncStorage';
import {Home, Login, OnboardingScreen, OtpScreen, Signup} from '../screens';
import DrawerStack from './DrawerStack';
import Loading from '../screens/GlobalComponents/Loading';
import DrawerStackSeeker from './DrawerStackSeeker';
import ForgetPass from '../screens/LoginSignup/ForgetPass';

const stack = createNativeStackNavigator();

const AppStack = () => {
  const [isOnboarding, setIsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | null>(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    checkIfHomePage();
  }, []);

  useEffect(() => {
    /**
     * @description This function fetches the user token from the keychain and sets the current user state.
     */
    const fetchUser = async () => {
      try {
        const token = await getTokenKeyChain();
        if (token) {
          setCurrentUser(token);
        }
      } catch (error) {
        console.error('Error fetching user token:', error);
      } finally {
        setLoading(false); // Ensure loading is set to false only once
      }
    };

    fetchUser();
  }, []);

  /**
   *
   * @description This function checks if the user is on the onboarding screen or not.
   * @returns {Promise<void>}
   */

  const checkIfHomePage: any = async () => {
    let onboarding = await getItemOnboarding('onboarding');

    if (onboarding == '1') {
      setIsOnboarding(false);
    } else {
      setIsOnboarding(true);
    }
  };

  if (isOnboarding == null) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <stack.Navigator
      initialRouteName={
        isOnboarding ? 'Onboarding' : currentUser ? 'Home' : 'Login'
      }>
      <stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="OTP"
        component={OtpScreen}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="forget_password"
        component={ForgetPass}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="Job_Seeker"
        component={DrawerStackSeeker}
        options={{headerShown: false}}
      />
      <stack.Screen
        name="Job_Provider"
        component={DrawerStack}
        options={{headerShown: false}}
      />
    </stack.Navigator>
  );
};

export default AppStack;

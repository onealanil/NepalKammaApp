import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getItem} from '../utils/asyncStorage';
import {Home, Login, OnboardingScreen, OtpScreen, Signup} from '../screens';
import {JobProvider, JobSeeker} from '../screens';
import DrawerStack from './DrawerStack';
import Loading from '../screens/GlobalComponents/Loading';
import OtherProfile from '../screens/Job_provider/OtherProfile';
import DrawerStackSeeker from './DrawerStackSeeker';
import ForgetPass from '../screens/LoginSignup/ForgetPass';

export type RootStackParamsList = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: {id: string; email: string; timer: string};
  Job_Seeker: undefined;
  Job_Provider: undefined;
  Other_Profile: {id: string};
  forget_password: undefined;
};

const stack = createNativeStackNavigator();

const AppStack = () => {
  const [isOnboarding, setIsOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean | null>(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    checkIfHomePage();
    
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const storedCurrentUser = await AsyncStorage.getItem('currentUser');
      setCurrentUser(storedCurrentUser);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const checkIfHomePage: any = async () => {
    let onboarding = await getItem('onboarding');

    if (onboarding == '1') {
      setIsOnboarding(false);
    } else {
      setIsOnboarding(true);
    }
    // can remove it
    // setLoading(false);
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

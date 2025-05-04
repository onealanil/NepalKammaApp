/**
 * @file Login.tsx
 * @description This file contains the Login component which is used for user authentication.
 */

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {removeItem, setToken} from '../../utils/asyncStorage';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {LoginSVG} from '../../components/SvgComponents';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {LoginSignupStore} from './helper/LoginSignupStore';
import {useState} from 'react';
import {ErrorToast} from '../../components/ErrorToast';
import {SuccessToast} from '../../components/SuccessToast';
import {useUserContext} from '../../contexts/UserContext';
import {useGlobalStore} from '../../global/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoginDetails, LoginScreenProps} from '../../types/interfaces/ILogin';

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

/**
 *
 * @param naviagtion - navigation prop
 * @description Login component for user authentication.
 * @returns Login component
 */
const Login = ({navigation}: LoginScreenProps) => {
  // global store state
  const setUser = useGlobalStore((state: any) => state.setUser);

  //  state
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // for eye
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const removeHandler = async () => {
    await removeItem('onboarding');
  };

  //context
  const {setCurrentUser} = useUserContext();

  /**
   *
   * @param values - login details
   * @description login handler function that checks if the user is logged in or not and navigates to the appropriate screen.
   * @returns void
   * @async
   * @function loginHandlerFunction
   */
  const loginHandlerFunction = async (values: LoginDetails) => {
    setIsLoggingIn(true);
    try {
      const finalValues = {
        email: values.email,
        password: values.password,
        fcm_token: await AsyncStorage.getItem('fcm_token'),
      };
      const response = await (LoginSignupStore.getState() as any).loginUser(
        finalValues,
      );
      setCurrentUser(response.token);
      setUser(response.user);
      SuccessToast(response.message);

      // Store the token in Keychain
      await setToken(response.token);

      if (response.user.role === 'job_seeker') {
        navigation.replace('Job_Seeker');
      } else if (response.user.role === 'job_provider') {
        navigation.replace('Job_Provider');
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsLoggingIn(false);
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values: LoginDetails) => {
        loginHandlerFunction(values);
      }}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View className="w-[100%] h-[100%] flex items-center bg-white">
            <View className="w-[85%] flex gap-y-3 mt-3">
              <View className="flex-row items-center justify-between">
                <Image
                  source={require('../../../assets/images/sparkler.png')}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveHeight(8),
                    objectFit: 'contain',
                  }}
                />
                <View className="h-1 w-[70%] bg-yellow-300"></View>
              </View>
              <View className="flex flex-col gap-y-2">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(3),
                  }}>
                  Log in to your account
                </Text>
                <Text
                  className="text-black"
                  style={{fontFamily: 'Montserrat-Regular'}}>
                  Welcome back! Please enter your details
                </Text>
              </View>
              {/* svg images  */}
              <View className="w-full flex items-center justify-center">
                <LoginSVG />
              </View>
              <View className="gap-y-2">
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Email
                  </Text>
                  <TextInput
                    className="bg-[#effff8] rounded-md text-black"
                    style={{fontFamily: 'Montserrat-SemiBold'}}
                    placeholder="Enter your email"
                    placeholderTextColor="#bdbebf"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {errors.email && (
                    <Text
                      className="text-red-500"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      {errors.email}
                    </Text>
                  )}
                </View>
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Password
                  </Text>
                  <View className="w-[100%] flex flex-row items-center">
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black"
                      placeholder="Enter your password"
                      style={{fontFamily: 'Montserrat-SemiBold', flex: 1}}
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      className="bg-[#effff8] py-3"
                      onPress={toggleShowPassword}>
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#bdbdbd"
                        style={{
                          marginLeft: 10,
                          marginRight: responsiveWidth(5),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text
                      className="text-red-500"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      {errors.password}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('forget_password')}>
                <View className="flex flex-row items-center justify-between">
                  <Text className="text-black text-xs"></Text>
                  <Text
                    className="text-black"
                    style={{
                      fontSize: responsiveFontSize(1.9),
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Forget Password?
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <View className="w-[100%] bg-color2 flex items-center justify-center rounded-md">
                  {isLoggingIn ? (
                    <ActivityIndicator size="small" color="#00ff00" style={{
                      paddingVertical: responsiveHeight(1.75),
                      paddingHorizontal: responsiveWidth(2),
                    }} />
                  ) : (
                    <TouchableOpacity onPress={() => handleSubmit()}>
                      <Text
                        className="text-white"
                        style={{
                          paddingVertical: responsiveHeight(1.75),
                          paddingHorizontal: responsiveWidth(2),
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(2.25),
                        }}>
                        Log In
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View className="flex flex-row items-center justify-center gap-x-1">
                <Text
                  className="text-black"
                  style={{
                    paddingVertical: responsiveHeight(1.75),
                    paddingHorizontal: responsiveWidth(2),
                    fontFamily: 'Montserrat-Regular',
                    fontSize: responsiveFontSize(1.75),
                  }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Signup');
                  }}>
                  <Text
                    className="text-color1"
                    style={{
                      paddingVertical: responsiveHeight(1.75),
                      paddingHorizontal: responsiveWidth(2),
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={removeHandler}
                style={{marginTop: responsiveHeight(4)}}>
                <Text className="text-green-300">r</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
    </Formik>
  );
};

export default Login;

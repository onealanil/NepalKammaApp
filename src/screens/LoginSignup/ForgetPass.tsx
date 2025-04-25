/**
 * @file ForgetPass.tsx
 * @description This file contains the Forget Password screen component.
 */
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {ErrorToast} from '../../components/ErrorToast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginSignupStore} from './helper/LoginSignupStore';
import {SuccessToast} from '../../components/SuccessToast';
import {
  ForgetPassScreenProps,
  LoginSignupStoreState,
  ResetPasswordProps,
} from '../../types/interfaces/IForgetPass';

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
  security_answer: Yup.string().required('Security answer is required'),
});

/**
 *
 * @param navigation - The navigation prop from React Navigation.
 * @description This component renders the Forget Password screen.
 * It allows the user to reset their password by providing their email, new password, and answering a security question.
 * @returns {JSX.Element} - The rendered component.
 */
const ForgetPass = ({navigation}: ForgetPassScreenProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   *
   * @param values - The values from the form.
   * @description This function handles the form submission for resetting the password.
   * It sends the email, new password, and security answer to the server.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   * @throws {Error} - Throws an error if the submission fails.
   * @async
   * @function handleSignup
   *
   */
  const handleSignup = async (values: ResetPasswordProps) => {
    setIsSubmitting(true);
    try {
      if (values.security_answer) {
        const userDetails: ResetPasswordProps = {
          email: values.email,
          password: values.password,
          security_answer: values.security_answer,
        };

        const response = await (
          LoginSignupStore.getState() as LoginSignupStoreState
        ).forgotPassword(userDetails);

        SuccessToast(response.message);

        navigation.navigate('Login');
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsSubmitting(false);
  };

  return (
    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
      <View className="w-[100%] h-[100%] flex items-center bg-white">
        <View className="w-[85%] flex gap-y-3 mt-3">
          <View className="my-16">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(3),
              }}>
              Reset Password
            </Text>
          </View>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              security_answer: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values: ResetPasswordProps) => {
              handleSignup(values);
            }}>
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <View className="gap-y-2">
                  {/* email */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Email
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}
                      placeholder="Enter your Email"
                      placeholderTextColor="#bdbebf"
                      keyboardType="email-address"
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
                  {/* password */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Enter new Password
                    </Text>
                    <View className="w-[100%] flex flex-row items-center">
                      <TextInput
                        className="bg-[#effff8] rounded-md text-black px-2"
                        style={{fontFamily: 'Montserrat-SemiBold', flex: 1}}
                        placeholder="Enter your Password"
                        placeholderTextColor="#bdbebf"
                        secureTextEntry={!showPassword}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
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
                  {/* confirm password */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Confirm Password
                    </Text>
                    <View className="w-[100%] flex flex-row items-center">
                      <TextInput
                        className="bg-[#effff8] rounded-md text-black px-2"
                        style={{fontFamily: 'Montserrat-SemiBold', flex: 1}}
                        placeholder="Confirm your Password"
                        placeholderTextColor="#bdbebf"
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                      />
                      <TouchableOpacity
                        className="bg-[#effff8] py-3"
                        onPress={toggleShowConfirmPassword}>
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off' : 'eye'}
                          size={24}
                          color="#bdbdbd"
                          style={{
                            marginLeft: 10,
                            marginRight: responsiveWidth(5),
                          }}
                        />
                      </TouchableOpacity>
                    </View>

                    {errors.confirmPassword && (
                      <Text
                        className="text-red-500"
                        style={{fontFamily: 'Montserrat-Regular'}}>
                        {errors.confirmPassword}
                      </Text>
                    )}
                  </View>
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      What is your birthplace ? (Security Question)
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}
                      placeholder="Enter your birthplace"
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange('security_answer')}
                      onBlur={handleBlur('security_answer')}
                      value={values.security_answer}
                    />
                    {errors.security_answer && (
                      <Text
                        className="text-red-500"
                        style={{fontFamily: 'Montserrat-Regular'}}>
                        {errors.security_answer}
                      </Text>
                    )}
                  </View>
                  {/* Add a submit button */}
                  <View>
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      activeOpacity={0.8}>
                      <View className="w-[100%] bg-color2 flex items-center justify-center rounded-md">
                        <Text
                          className="text-white"
                          style={{
                            paddingVertical: responsiveHeight(1.75),
                            paddingHorizontal: responsiveWidth(2),
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(2.25),
                          }}>
                          {isSubmitting ? 'Reseting...' : 'Reset Password'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ForgetPass;

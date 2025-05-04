/**
 * @file OtpScreen.tsx
 * @description This file contains the OtpScreen component which is used to verify the OTP sent to the user's email.
 */

import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import OTPTextView from 'react-native-otp-textinput';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ErrorToast} from '../../components/ErrorToast';
import {LoginSignupStore} from './helper/LoginSignupStore';
import ModalBox from '../../components/ModalBox';
import {
  LoginSignupStoreState,
  OtpScreenProps,
} from '../../types/interfaces/IOtpScreen';

/**
 *
 * @param navigation - The navigation prop for navigating between screens.
 * @param route - The route prop for getting the parameters passed to the screen.
 * @description OtpScreen component is used to verify the OTP sent to the user's email.
 * @returns {JSX.Element} - Returns the OtpScreen component.
 */
const OtpScreen = ({navigation, route}: OtpScreenProps) => {
  // state
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [counter, setCounter] = useState<number | null>(null);

  //   get user id,timer and email
  const id = route?.params.id;
  const email = route?.params.email;
  const timer = route?.params.timer;

  //   counter for -->resend otp
  useEffect(() => {
    if (counter === null) {
      const expiryTime = timer ? Date.parse(timer) : Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setCounter(diff);
    }

    if (counter === 0) return;

    const interval = setInterval(() => {
      setCounter(prevCounter => {
        if (prevCounter !== null && prevCounter > 1) {
          return prevCounter - 1;
        } else {
          clearInterval(interval);
          return null;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, counter]);

  /**
   * @function verifyHandler
   * @description This function is used to verify the OTP entered by the user.
   * *@returns {Promise<void>} - Returns a promise that resolves when the OTP is verified.
   * @throws {Error} - Throws an error if the OTP verification fails.
   * @async
   */
  const verifyHandler = async () => {
    setIsVerifying(true);
    try {
      if (otp.length === 4 && id) {
        const data = {
          userId: id,
          otp: otp,
        };

        const response = await (
          LoginSignupStore.getState() as LoginSignupStoreState
        ).verifyUser(data);
        setResponseMessage(response.message);
        setModalVisible(true);
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsVerifying(false);
  };

  // handle ok function
  const handleOkFunction = () => {
    setModalVisible(false);
    navigation?.navigate('Login');
  };

  /**
   * * @function handleResendOTPFunction
   * * @description This function is used to resend the OTP to the user's email.
   * * @returns {Promise<void>} - Returns a promise that resolves when the OTP is resent.
   * * @throws {Error} - Throws an error if the OTP resend fails.
   * * @async
   */
  const handleResendOTPFunction = async () => {
    try {
      if (counter === 0 && id && email) {
        const data = {
          userId: id,
          email: email,
        };
        const response = await (
          LoginSignupStore.getState() as LoginSignupStoreState
        ).resendOTP(data);
        setOtp('');
        const newExpiryTime = response.data.expiresAt;
        const diff = Math.max(
          0,
          Math.floor((Date.parse(newExpiryTime) - Date.now()) / 1000),
        );
        setCounter(diff);
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <View className="w-[100%] h-[100%] flex items-center justify-center flex-col">
        <View className="w-[90%] flex flex-col items-center justify-center gap-y-10">
          {/* logo  */}
          <View>
            <Image
              source={require('../../../assets/images/NepalKamma.png')}
              style={{
                width: responsiveWidth(60),
                height: responsiveHeight(5),
              }}
            />
          </View>
          {/* text and otp  */}
          <View className="flex flex-col items-center justify-center">
            <Text
              className="text-black"
              style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveFontSize(2),
              }}>
              We sent OTP code to verify your email
            </Text>
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: responsiveFontSize(2),
              }}>
              {email ? email : ''}
            </Text>
            <View className="my-10">
              <OTPTextView
                textInputStyle={{
                  borderColor: 'green',
                  borderWidth: 1,
                  borderRadius: 10,
                }}
                tintColor={'green'}
                offTintColor={'green'}
                handleTextChange={(text: any) => setOtp(text)}
              />
            </View>
            <View className="mt-8 flex gap-y-2 items-center justify-center">
              <Text
                className="text-black"
                style={{fontFamily: 'Montserrat-Regular'}}>
                {counter === 0 ? (
                  'Now you can resend'
                ) : (
                  <>
                    After{' '}
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: responsiveFontSize(3),
                      }}
                      className="text-color2">
                      {counter}
                    </Text>{' '}
                    sec you can resend{' '}
                  </>
                )}
              </Text>
              {counter === 0 && (
                <TouchableOpacity onPress={handleResendOTPFunction}>
                  <View className="flex flex-row items-center justify-center gap-x-2">
                    <Text
                      className="text-color2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}>
                      Resend
                    </Text>
                    <AntDesign name="reload1" size={15} color="#79AC78" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* button  */}
          <View className="w-[100%] bg-color2 flex items-center justify-center rounded-md">
            {isVerifying ? (
              <ActivityIndicator size="small" color="#00ff00" style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
              }}/>
            ) : (
              <TouchableOpacity onPress={verifyHandler}>
                <Text
                  className="text-white tracking-widest"
                  style={{
                    paddingVertical: responsiveHeight(1.75),
                    paddingHorizontal: responsiveWidth(2),
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(2.25),
                  }}>
                  Verify
                </Text> 
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <ModalBox
        isModalVisible={isModalVisible}
        handleOkFunction={handleOkFunction}
        responseMessage={responseMessage}
        modalMessage="Verified"
      />
    </React.Fragment>
  );
};

export default OtpScreen;

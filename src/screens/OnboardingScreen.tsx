import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {setItemOnboarding} from '../utils/asyncStorage';
import {OnBoardingScreenProps} from '../types/OnboardingScreen';

const OnboardingScreen = ({navigation}: OnBoardingScreenProps) => {
  //handle skip
  const handleBoarding = () => {
    navigation.navigate('Login');
    setItemOnboarding('onboarding', '1');
  };

  return (
    <React.Fragment>
      <View className="w-[100%] flex items-center justify-center">
        <View className="relative flex items-center justify-center w-[95%]">
          {/* logo */}
          <View className="absolute" style={{top: responsiveHeight(5)}}>
            <Image
              source={require('../../assets/images/NepalKamma.png')}
              style={{
                width: responsiveWidth(60),
                height: responsiveHeight(5),
              }}
            />
          </View>
          {/* text  */}
          <View
            className="absolute w-[97%]"
            style={{top: responsiveHeight(15)}}>
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2.75),
                textAlign: 'center',
              }}>
              In Every <Text className="text-color2">Skill</Text>, We Find a{' '}
              <Text className="text-color2">Unique Story</Text>, and in Every
              Story, We Find <Text className="text-color2">Purpose</Text>
            </Text>
          </View>

          {/* make circle */}
          <View
            className="absolute bg-color2"
            style={{
              width: responsiveWidth(110),
              height: responsiveHeight(55),
              top: responsiveHeight(30),
              left: responsiveWidth(30),
              position: 'absolute',
              borderRadius: responsiveWidth(80),
            }}></View>
          {/* image  */}
          <View
            style={{
              position: 'absolute',
              top: responsiveHeight(30),
              left: responsiveWidth(25),
            }}>
            <Image
              source={require('../../assets/images/onBoarding.png')}
              style={{
                width: responsiveWidth(90),
                height: responsiveHeight(70),
              }}
            />
          </View>
          {/* text */}
          <View
            className="w-[90%] absolute"
            style={{top: responsiveHeight(85)}}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleBoarding}>
              <View className="w-[100%] bg-color2 flex items-center justify-center rounded-lg shadow-xl shadow-black">
                <Text
                  className="text-white tracking-wide"
                  style={{
                    paddingVertical: responsiveHeight(1.75),
                    paddingHorizontal: responsiveWidth(2),
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(2.25),
                  }}>
                  Get Started
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
};

export default OnboardingScreen;

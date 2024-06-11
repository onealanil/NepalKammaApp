import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Who from '../../components/Who';
import SignupForm from '../../components/SignupForm';

interface signUpScreenProps {
  navigation: StackNavigationProp<RootStackParamsList>;
}

const Signup = ({navigation}: signUpScreenProps) => {
  const [who, setWho] = useState<string>('');

  return (
    <React.Fragment>
      {who?.length > 0 ? (
        <>
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
                <View className="flex flex-col gap-y-2 mb-8">
                  <View className="flex flex-row items-center justify-between">
                    <Text
                      className="text-black"
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: responsiveFontSize(3),
                      }}>
                      Create and account
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setWho('');
                      }}>
                      <AntDesign name="back" size={30} color="#79AC78" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex flex-row items-center gap-x-1">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      Welcome to
                    </Text>
                    <View className="flex flex-row items-center gap-x-1">
                      <Text
                        className="text-color2"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(2.5),
                        }}>
                        Nepal
                      </Text>
                      <Text
                        className="text-black"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(2.5),
                        }}>
                        Kamma
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Form View start  */}
                <SignupForm role={who} navigation={navigation} />
                {/* Form view close */}
                <View className="flex flex-row items-center justify-center gap-x-1">
                  <Text
                    className="text-black"
                    style={{
                      paddingVertical: responsiveHeight(1.75),
                      paddingHorizontal: responsiveWidth(2),
                      fontFamily: 'Montserrat-Regular',
                      fontSize: responsiveFontSize(1.75),
                    }}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Login');
                    }}>
                    <Text
                      className="text-color1"
                      style={{
                        paddingVertical: responsiveHeight(1.75),
                        paddingHorizontal: responsiveWidth(2),
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </>
      ) : (
        <Who setWho={setWho} />
      )}
    </React.Fragment>
  );
};

export default Signup;

import {
  View,
  Text,
  useWindowDimensions,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import RenderHTML from 'react-native-render-html';
import {systemFonts} from './Cards';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CompletedJobSeeker = ({
  data,
  handlePresentModalPress,
  setSinglePaymentData,
}: any) => {
  const {width} = useWindowDimensions();

  const generateHtmlPreview = () => {
    let html = `<p style="color: black;">${data?.job.job_description}</p>`;
    html = html.replace(/\n/g, '<br/>');
    return html;
  };

  const requestPaymentHandler = async () => {
    handlePresentModalPress();
    setSinglePaymentData(data);
  };

  return (
    <View>
      <View className="p-4 shadow-2xl flex flex-col bg-white">
        <View className="py-2 px-4 my-2 bg-gray-100 rounded-md flex flex-row items-center gap-x-1 w-[90%]">
          <FontAwesome name="dollar" size={17} color="black" />
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveHeight(1.5),
            }}>
            Amount Rs.{data?.amount}/-
          </Text>
        </View>
        <View className="flex flex-row gap-x-4">
          {/* image  */}
          <View>
            {data && data?.job?.postedBy?.profilePic?.url && (
              <View className="relative">
                <Image
                  source={{uri: data?.job?.postedBy?.profilePic.url}}
                  style={{height: 40, width: 40, borderRadius: 40}}
                  className="relative"
                />
                <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-white" />
              </View>
            )}
          </View>
          {/* text  */}
          <View className="flex flex-col gap-y-1 w-[100%]">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(1.75),
              }}>
              {data?.job.title}
            </Text>

            <Text
              className="text-black ml-1"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveFontSize(1.5),
              }}>
              {data?.job?.postedBy?.username}
            </Text>
          </View>
        </View>
        <View
          className=""
          style={{
            width: responsiveWidth(82.75),
          }}>
          <RenderHTML
            contentWidth={width}
            source={{html: generateHtmlPreview()}}
            baseStyle={{
              color: 'black',
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.5),
              lineHeight: 18.5,
              height: responsiveHeight(21.85),
            }}
            // tagsStyles={{
            //   p: {color: 'red', fontFamily: 'Montserrat-Bold'},
            // }}
            systemFonts={systemFonts}
          />
        </View>
        <View className="py-2 px-4 my-2 bg-color1 rounded-md flex flex-row items-center gap-x-1 w-[90%]">
          <MaterialIcons name="currency-bitcoin" size={17} color="white" />
          <Text
            className="text-white"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveHeight(1.5),
            }}>
            Paid by {data?.PaymentBy.username}
          </Text>
        </View>
        {data?.paymentStatus === 'request_payment' && (
          <>
            <TouchableOpacity>
              <View className="py-2 px-4 mb-3 bg-gray-100 rounded-md flex flex-row justify-center items-center gap-x-1">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveHeight(1.5),
                    color: 'black',
                  }}>
                  {data?.paymentType === 'cash'
                    ? 'Just wait for admin approval'
                    : `Payment will be done soon: ${data?.recieverNumber}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View className="py-2 px-4 bg-color2 rounded-md flex flex-row justify-center items-center gap-x-1">
                <MaterialIcons name="check" size={17} color="white" />
                <Text
                  className=""
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveHeight(1.5),
                    color: 'white',
                  }}>
                  Requested
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {data?.paymentStatus === 'provider_paid' && (
          <TouchableOpacity
            onPress={() => {
              requestPaymentHandler();
            }}>
            <View className="py-2 px-4 bg-color2 rounded-md flex flex-row justify-center items-center gap-x-1">
              <MaterialIcons name="payment" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.5),
                  color: 'white',
                }}>
                {/* {isRequested ? 'Requesting...' : 'Request Payment'} */}
                {data?.paymentType === 'cash'
                  ? 'Accept Payment'
                  : 'Request Payment'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CompletedJobSeeker;

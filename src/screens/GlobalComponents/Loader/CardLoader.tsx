import {View, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const CardLoader = () => {
  return (
    <View className="p-4 shadow-2xl flex flex-col bg-white">
      <View className="flex flex-row gap-x-4">
        {/* image placeholder */}
        <ShimmerPlaceHolder style={{height: 40, width: 40, borderRadius: 40}} />
        {/* text placeholders */}
        <View className="flex flex-col gap-y-1">
          <ShimmerPlaceHolder
            style={{
              width: responsiveWidth(70),
              height: responsiveFontSize(2),
              marginBottom: responsiveFontSize(0.75),
            }}
          />
          <ShimmerPlaceHolder
            style={{
              width: responsiveWidth(70),
              height: responsiveFontSize(2),
              marginBottom: responsiveFontSize(0.75),
            }}
          />
          <ShimmerPlaceHolder
            style={{
              width: responsiveWidth(30),
              height: responsiveFontSize(1.5),
              marginBottom: responsiveFontSize(0.75),
            }}
          />
          <ShimmerPlaceHolder
            style={{
              width: responsiveWidth(30),
              height: responsiveFontSize(1.5),
              marginBottom: responsiveFontSize(0.75),
            }}
          />
        </View>
      </View>
      <View style={{width: responsiveWidth(82.75)}} className='mt-5'>
        <ShimmerPlaceHolder
          style={{width: '100%', height: responsiveFontSize(10)}}
        />
        <ShimmerPlaceHolder
          style={{width: '100%', height: responsiveFontSize(10)}}
        />
      </View>
    </View>
  );
};

export default CardLoader;

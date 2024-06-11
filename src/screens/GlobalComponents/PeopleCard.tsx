import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

const PeopleCard = ({data, navigation, route}: any) => {
  return (
    <View
      className="flex flex-row items-center justify-between"
      style={{marginTop: responsiveHeight(2)}}>
      <View className="flex flex-row items-center">
        {data && data?.profilePic?.url && (
          <View className="relative">
            <FastImage
              source={{uri: data?.profilePic.url}}
              style={{
                width: responsiveHeight(8),
                height: responsiveHeight(8),
                borderRadius: responsiveHeight(8) / 2,
              }}
            />
            <View
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-white ${
                data?.onlineStatus ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </View>
        )}

        <View className="flex flex-col ml-3">
          <View className="flex flex-row gap-x-1 items-center">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(2),
              }}>
              {data?.username}
            </Text>
            {data?.isDocumentVerified === 'verified' && (
              <MaterialIcons name="verified" size={15} color={'green'} />
            )}
          </View>
          <View>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveHeight(1.5),
              }}>
              {data?.title || 'Freelancer'}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <View className="flex flex-row gap-x-2 items-center">
          <MaterialIcons name="call" size={25} color="#79AC78" />
          <MaterialCommunityIcons
            name="android-messages"
            size={25}
            color="#79AC78"
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(PeopleCard);

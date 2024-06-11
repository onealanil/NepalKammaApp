import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useGlobalStore} from '../../global/store';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerStackParamsList} from '../../navigation/DrawerStack';
import {UserStore} from './helper/UserStore';
import {ErrorToast} from '../../components/ErrorToast';
import FastImage from 'react-native-fast-image';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface MyMileStoneProps {
  navigation: DrawerNavigationProp<DrawerStackParamsList>;
}

const MyMileStone = ({navigation}: MyMileStoneProps) => {
  const {user, checkAuth} = useGlobalStore();

  const [inProgressJobs, setInProgressJobs] = useState<number>(0);
  const [totalJobPosted, setTotalJobPosted] = useState<number>(0);

  const getTotaljobsJobProvider = React.useCallback(async () => {
    try {
      const response = await (
        UserStore.getState() as any
      ).getTotaljobsJobProvider(user?._id);
      if (response) {
        setTotalJobPosted(response.totalJobsbyProvider);
        setInProgressJobs(response.InprogressJobs);
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, [setTotalJobPosted, setInProgressJobs, user?._id]);

  useEffect(() => {
    getTotaljobsJobProvider();
  }, [getTotaljobsJobProvider]);

  //refresh handler
  const refreshHandler = useCallback(() => {
    getTotaljobsJobProvider();
    checkAuth();
  }, []);

  return (
    <React.Fragment>
      <View
        className="w-[100%] pb-52 flex flex-col bg-white"
        style={{padding: responsiveHeight(2)}}>
        {/* back button */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View className="mb-2 flex flex-row items-center gap-x-2">
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
            <Text
              className="font-bold"
              style={{
                fontSize: responsiveFontSize(2),
                color: '#333',
                fontFamily: 'Montserrat-Bold',
              }}>
              My Milestone
            </Text>
          </View>
        </TouchableOpacity>
        {/* profile pic  */}
        <View className="w-[100%] flex items-center justify-center py-3 h-[50%]">
          <View className="relative">
            <FastImage
              source={{uri: user?.profilePic.url}}
              style={{
                width: responsiveWidth(46),
                height: responsiveHeight(23),
                overflow: 'hidden',
                borderWidth: responsiveWidth(1),
                borderColor: '#79AC78',
              }}
              className="rounded-full"
            />
          </View>
          <View className="flex flex-row gap-x-2">
            <Text
              className="text-black"
              style={{
                fontSize: responsiveFontSize(2.5),
                color: '#333',
                fontFamily: 'Montserrat-Bold',
              }}>
              {user?.username}
            </Text>
            {user?.isDocumentVerified === 'verified' && (
              <MaterialIcons name="verified" size={20} color={'green'} />
            )}
          </View>
        </View>
        <Text
          className="text-black bg-gray-100 px-2 py-1 mb-3 rounded-md"
          style={{
            fontSize: responsiveFontSize(2),
            fontFamily: 'Montserrat-Bold',
          }}>
          Level - {user?.mileStone || 0}
        </Text>

        {/* body starts */}
        <View className="flex flex-row gap-x-2">
          <View className="bg-color2 py-2 px-5 flex flex-col items-center justify-center rounded-md">
            <Text
              className="text-white"
              style={{
                marginLeft: responsiveWidth(2.5),
                fontSize: responsiveFontSize(2),
                fontFamily: 'Montserrat-Bold',
              }}>
              Jobs Posted
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontFamily: 'Montserrat-Bold',
              }}>
              {totalJobPosted || 0}
            </Text>
          </View>
          <View className="bg-color2 py-2 px-5 flex flex-col items-center justify-center rounded-md">
            <Text
              className="text-white"
              style={{
                marginLeft: responsiveWidth(2.5),
                fontSize: responsiveFontSize(1.75),
                fontFamily: 'Montserrat-Bold',
              }}>
              Completed Jobs
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontFamily: 'Montserrat-Bold',
              }}>
              {user?.totalCompletedJobs || 0}
            </Text>
          </View>
        </View>

        {/* body starts - II  */}
        <View className="flex flex-row gap-x-2 mt-3">
          <View className="bg-color2 py-2 px-5 flex flex-col items-center justify-center rounded-md">
            <Text
              className="text-white"
              style={{
                marginLeft: responsiveWidth(2.5),
                fontSize: responsiveFontSize(2),
                fontFamily: 'Montserrat-Bold',
              }}>
              Amounts Paid
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontFamily: 'Montserrat-Bold',
              }}>
              Rs.{' '}
              {(user?.totalAmountPaid && user.totalAmountPaid.toFixed(2)) || 0}
            </Text>
          </View>
          <View className="bg-color2 py-2 px-3 flex flex-col items-center justify-center rounded-md">
            <Text
              className="text-white"
              style={{
                marginLeft: responsiveWidth(2.5),
                fontSize: responsiveFontSize(1.75),
                fontFamily: 'Montserrat-Bold',
              }}>
              In Progress Jobs
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                fontFamily: 'Montserrat-Bold',
              }}>
              {inProgressJobs || 0}
            </Text>
          </View>
        </View>

        {/* note section  */}
        <Text
          className="text-red-500"
          style={{
            fontSize: responsiveScreenFontSize(1.5),
            fontWeight: 'bold',
            textAlign: 'center',
            padding: responsiveHeight(2),
          }}>
          Guidelines: You can earn more by posting more jobs and completing
          them. Every 5 jobs completed will increase your level by 1. And in
          Each 5 levels you will get a bonus of Rs. 5000.
        </Text>
        <TouchableOpacity
          className="w-[100%] flex items-center justify-center"
          onPress={refreshHandler}>
          <View className="py-2 px-5 bg-color2 rounded-md flex flex-row items-center gap-x-1">
            <Text
              className="text-white"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              Refresh
            </Text>
            <EvilIcons name="refresh" size={25} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

export default MyMileStone;

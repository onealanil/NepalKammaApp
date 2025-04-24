/**
 * @format
 * @flow strict-local
 * @file Home.tsx
 * @description Home screen for job seekers. It displays job recommendations, nearby jobs, and most recent jobs based on the user's location and preferences.
 * @author Anil Bhandari
 */

import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useGlobalStore} from '../../global/store';
import TopNav from '../GlobalComponents/TopNav';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Cards from '../GlobalComponents/Cards';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottonSheetCardSeeker from './BottonSheetCardSeeker';
import {FetchJobStore} from './helper/FetchJobStore';
import CardLoader from '../GlobalComponents/Loader/CardLoader';
import Geolocation from 'react-native-geolocation-service';
import {ErrorToast} from '../../components/ErrorToast';
import {useSocket} from '../../contexts/SocketContext';
import {useMessageStore} from '../../global/MessageCount';
import {useIsFocused} from '@react-navigation/native';
import useLocationStore from '../../global/useLocationStore';
import HomeSearch from '../GlobalComponents/HomeSearch';
import {useNotificationCount} from '../../global/NotificationCount';
import {FlashList} from '@shopify/flash-list';
import {userStateProps} from '../../types/HomeSeekerTypes';
import {
  getJobProps,
  initialJobData,
  JobData,
  myLocationProps,
  profileProps,
} from '../../types/interfaces/IHomeSeeker';

/**
 *
 * @param navigation - navigation prop for navigating to other screens
 * @param bottomNavigation - bottom navigation prop for navigating to other screens
 * @returns Home component
 * @description Home component for job seekers. It displays job recommendations, nearby jobs, and most recent jobs based on the user's location and preferences.
 */

const Home = ({navigation, bottomNavigation}: profileProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const setLocation = useLocationStore((state: any) => state.setLocation);
  const isFocused = useIsFocused();
  const [currentTab, setCurrentTab] = React.useState<string>('Best Matches');
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [jobDetails, setJobDetails] = React.useState<JobData>(initialJobData);
  const [nearByJobDetails, setNearByJobDetails] =
    React.useState<JobData>(initialJobData);
  const [recommendedJob, setRecommendedJob] =
    React.useState<JobData>(initialJobData);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [myLocation, setMyLocation] = React.useState<myLocationProps>({
    latitude: 0,
    longitude: 0,
  });

  const socket = useSocket();

  /**
   * @description This function is used to read the unread message count from the message store.
   * @returns {Promise<void>}
   */
  const readUnreadMessage = useCallback(async () => {
    await (useMessageStore.getState() as any).unreadMessageCount();
  }, []);

  /**
   * @description This function is used to read the unread notification count from the notification store.
   * @returns {Promise<void>}
   */
  const readUnreadNotification = useCallback(async () => {
    await (useNotificationCount.getState() as any).unreadNotification();
  }, []);

  /**
   * @description This function is used to read the unread notification count from the notification store.
   * @returns {Promise<void>}
   */

  useEffect(() => {
    if (socket) {
      socket.emit('addUser', {username: user?.username, userId: user?._id});
    }
  }, [socket, user]);

  useEffect(() => {
    /**
     *
     * @param newNotification - new notification object
     * @description This function is used to listen for new notifications from the socket and update the notification count in the notification store.
     * @returns {Promise<void>}
     */
    const messageListener = async (newNotification: any) => {
      useNotificationCount.setState(state => ({
        notificationCount: state.notificationCount + 1,
      }));
    };

    socket?.on('notificationForLocationAndRecommend', messageListener);

    return () => {
      socket?.off('notificationForLocationAndRecommend', messageListener);
    };
  }, [socket]);

  useEffect(() => {
    /**
     *
     * @param sender - sender object
     * @param message - message object
     * @param conversationId - conversation id
     * @description This function is used to listen for new messages from the socket and update the message count in the message store.
     * @returns {Promise<void>}
     */
    const messageListener = ({sender, message, conversationId}: any) => {
      useMessageStore.setState(state => ({
        messageCount: state.messageCount + 1,
      }));
    };

    socket?.on('textMessageFromBack', messageListener);

    return () => {
      socket?.off('textMessageFromBack', messageListener);
    };
  }, [socket]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {}, []);

  /**
   * @description This function is used to get the job details from the job store.
   * @returns {Promise<void>}
   */
  const getJobDetails = useCallback(async () => {
    try {
      const response = await (FetchJobStore.getState() as getJobProps).getJob(
        1,
        5,
      );
      setJobDetails(response);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
  }, []);

  /**
   * @description This function is used to get the nearby job details from the job store.
   * @param latitude - latitude of the user
   * @param longitude - longitude of the user
   * @returns {Promise<void>}
   */
  const getNearbyJob = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await (
          FetchJobStore.getState() as getJobProps
        ).getNearbyJob(latitude, longitude);
        setNearByJobDetails(response);
      } catch (error: any) {
        ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
      }
    },
    [],
  );

  /**
   * @description This function is used to get the recommended job details from the job store.
   * @returns {Promise<void>}
   */
  const getRecommendedJob = useCallback(async () => {
    try {
      const response = await (
        FetchJobStore.getState() as getJobProps
      ).getJobRecommendation();
      setRecommendedJob(response);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
  }, []);

  /**
   * @description This function is used to show the permission denied alert when the user denies location permission.
   * @returns {Promise<void>}
   */
  const showPermissionDeniedAlert = useCallback(() => {
    Alert.alert(
      'Location Permission Required',
      'This app needs location permission to show nearby jobs. Please enable location permission in settings.\nPlease click Open Settings > Permissions > Location > Allow',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setLocationPermissionDenied(true);
            setIsLoading(false);
          },
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
            setLocationPermissionDenied(true);
            setIsLoading(false);
          },
        },
      ],
    );
  }, []);

  /**
   * @description This function is used to request location permission from the user.
   * @returns {Promise<void>}
   */
  const requestLocationPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'NepalKamma App Location Permission',
          message: 'NepalKamma App needs access to your Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermissionDenied(false);
        Geolocation.getCurrentPosition(
          position => {
            setMyLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLocation(position.coords.latitude, position.coords.longitude);
            getJobDetails();
            getNearbyJob(position.coords.latitude, position.coords.longitude);
            getRecommendedJob();
            setIsLoading(false);
          },
          error => {
            ErrorToast("Can't get location");
            setIsLoading(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        // First time denial
        setLocationPermissionDenied(false);
        setIsLoading(false);
      } else {
        // "Never ask again" selected or permission denied
        showPermissionDeniedAlert();
      }
    } catch (err: any) {
      ErrorToast(err.message);
      setIsLoading(false);
    }
  }, [
    getNearbyJob,
    getJobDetails,
    getRecommendedJob,
    setLocation,
    showPermissionDeniedAlert,
  ]);

  useEffect(() => {
    if (isFocused) {
      readUnreadMessage();
      readUnreadNotification();
      requestLocationPermission();
    }
  }, [
    isFocused,
    readUnreadMessage,
    readUnreadNotification,
    requestLocationPermission,
  ]);

  const setCurrentTabHandler = useCallback((item: string) => {
    setCurrentTab(item);
  }, []);

  const setSelectedItemHandler = useCallback((item: any) => {
    setSelectedData(item);
    handlePresentModalPress();
  }, []);

  const handleRetryPermission = useCallback(() => {
    setIsLoading(true);
    setLocationPermissionDenied(false);
    requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          paddingTop: responsiveHeight(16),
        }}>
        <View className="w-[95%]" style={{padding: responsiveHeight(2)}}>
          {/* top nav  */}
          <TopNav props={navigation} user={user} />
          {/* description start */}
          <View
            className="flex flex-col gap-y-1"
            style={{marginTop: responsiveHeight(3)}}>
            <View>
              <Text
                className="text-gray-500"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(2),
                }}>
                Discover
              </Text>
            </View>
            <View>
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2),
                }}>
                Job and earn money
              </Text>
            </View>
          </View>
          {/* description end  */}
          {/* search  */}
          <TouchableOpacity
            onPress={() =>
              bottomNavigation.navigate('explore', {
                id: 'explore',
              })
            }>
            <View style={{marginTop: responsiveHeight(3)}}>
              <HomeSearch text={'Home'} user={user} />
            </View>
          </TouchableOpacity>
          {/* body start */}
          <View style={{marginTop: responsiveHeight(3)}}>
            {/* text start */}
            <View className="flex flex-row items-center justify-between">
              {/* best matches */}
              <View
                className={`w-[33.33%] py-3 ${
                  currentTab === 'Best Matches' && 'border-b-2 border-color2'
                } items-center  `}>
                <TouchableOpacity
                  onPress={() => setCurrentTabHandler('Best Matches')}>
                  <Text
                    className={
                      currentTab === 'Best Matches'
                        ? 'text-color2'
                        : 'text-gray-500'
                    }
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    Best Matches
                  </Text>
                </TouchableOpacity>
              </View>
              {/* most recent  */}
              <View
                className={`w-[33.33%] py-3 ${
                  currentTab === 'Most Recent' && 'border-b-2 border-color2'
                } items-center `}>
                <TouchableOpacity
                  onPress={() => setCurrentTabHandler('Most Recent')}>
                  <Text
                    className={
                      currentTab === 'Most Recent'
                        ? 'text-color2'
                        : 'text-gray-500'
                    }
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    Most Recent
                  </Text>
                </TouchableOpacity>
              </View>
              {/* near by work  */}
              <View
                className={`w-[33.33%] items-center justify-center flex py-3 ${
                  currentTab === 'Nearby' && 'border-b-2 border-color2'
                } items-center `}>
                <TouchableOpacity
                  onPress={() => setCurrentTabHandler('Nearby')}>
                  <Text
                    className={
                      currentTab === 'Nearby' ? 'text-color2' : 'text-gray-500'
                    }
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    Nearby Jobs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* text end  */}

            {/* Best Matches  */}
            {isLoading && (
              <View
                style={{
                  height: responsiveHeight(70),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  data={[1, 1, 1, 1, 1]}
                  estimatedItemSize={100}
                  renderItem={({item, index}) => <CardLoader />}
                />
              </View>
            )}

            {locationPermissionDenied && (
              <View
                style={{
                  height: responsiveHeight(70),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(2),
                    color: 'red',
                    textAlign: 'center',
                    marginBottom: responsiveHeight(2),
                  }}>
                  Location permission denied
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: responsiveFontSize(1.5),
                    textAlign: 'center',
                    marginBottom: responsiveHeight(2),
                  }}>
                  Please enable location permission to see nearby jobs
                </Text>
                <TouchableOpacity
                  onPress={handleRetryPermission}
                  style={{
                    backgroundColor: '#79AC78',
                    padding: responsiveHeight(1.5),
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.5),
                      color: 'white',
                    }}>
                    Retry Permission
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!isLoading &&
              !locationPermissionDenied &&
              currentTab === 'Best Matches' && (
                <View
                  style={{
                    height: responsiveHeight(70),
                    width: responsiveWidth(90),
                  }}>
                  <FlashList
                    keyExtractor={item => item._id?.toString() || ''}
                    data={recommendedJob?.recommendJobsList}
                    estimatedItemSize={120}
                    renderItem={({item}) => (
                      <TouchableWithoutFeedback
                        onPress={() => setSelectedItemHandler(item)}>
                        <Cards data={item} user={user} />
                      </TouchableWithoutFeedback>
                    )}
                    ListEmptyComponent={() => (
                      <View style={{paddingBottom: responsiveHeight(25)}}>
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          No recommended jobs available
                        </Text>
                        <Text
                          className="text-color2"
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          Complete your profile to get recommended jobs
                        </Text>
                      </View>
                    )}
                    contentContainerStyle={{
                      paddingBottom: responsiveHeight(50),
                      paddingTop: responsiveHeight(1),
                    }}
                    ListFooterComponent={
                      <View style={{height: 50, backgroundColor: 'white'}} />
                    }
                    showsVerticalScrollIndicator={false}></FlashList>
                </View>
              )}
            {/* Most Recent  */}
            {!isLoading &&
              !locationPermissionDenied &&
              currentTab === 'Most Recent' && (
                <View
                  style={{
                    height: responsiveHeight(70),
                    width: responsiveWidth(90),
                  }}>
                  <FlashList
                    keyExtractor={item => item._id.toString()}
                    data={jobDetails?.job}
                    estimatedItemSize={120}
                    renderItem={({item}) => (
                      <TouchableWithoutFeedback
                        onPress={() => setSelectedItemHandler(item)}>
                        <Cards data={item} user={user} />
                      </TouchableWithoutFeedback>
                    )}
                    ListEmptyComponent={() => (
                      <View style={{paddingBottom: responsiveHeight(25)}}>
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          No jobs available
                        </Text>
                      </View>
                    )}
                    contentContainerStyle={{
                      paddingBottom: responsiveHeight(50),
                      paddingTop: responsiveHeight(1),
                    }}
                    ListFooterComponent={
                      <View style={{height: 50, backgroundColor: 'white'}} />
                    }
                    showsVerticalScrollIndicator={false}></FlashList>
                </View>
              )}
            {/* Near by Work */}
            {!isLoading &&
              !locationPermissionDenied &&
              currentTab === 'Nearby' && (
                <View
                  style={{
                    height: responsiveHeight(70),
                    width: responsiveWidth(90),
                  }}>
                  <FlashList
                    keyExtractor={item => item._id.toString()}
                    estimatedItemSize={120}
                    data={nearByJobDetails?.nearBy}
                    renderItem={({item}) => (
                      <TouchableWithoutFeedback
                        onPress={() => setSelectedItemHandler(item)}>
                        <Cards data={item} user={user} />
                      </TouchableWithoutFeedback>
                    )}
                    contentContainerStyle={{
                      paddingBottom: responsiveHeight(50),
                      paddingTop: responsiveHeight(1),
                    }}
                    ListEmptyComponent={() => (
                      <View style={{paddingBottom: responsiveHeight(25)}}>
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          No near by jobs available
                        </Text>
                      </View>
                    )}
                    ListFooterComponent={
                      <View style={{height: 50, backgroundColor: 'white'}} />
                    }
                    showsVerticalScrollIndicator={false}></FlashList>
                </View>
              )}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.8,
                shadowRadius: 24,
                elevation: 30,
                flex: 1,
                overflow: 'scroll',
              }}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <BottonSheetCardSeeker
                bottomSheetModalRef={bottomSheetModalRef}
                data={selectedData}
                navigation={bottomNavigation}
              />
            </BottomSheetModal>
          </View>
          {/* body end  */}
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

export default Home;

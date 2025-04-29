import {View, Text, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React, {useCallback, useEffect, useMemo, useRef, memo} from 'react';
import {useGlobalStore} from '../../global/store';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamsList} from '../../navigation/AppStack';
import TopNav from '../GlobalComponents/TopNav';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Cards from '../GlobalComponents/Cards';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottomSheetCard from './BottomSheetCard';
import {FetchGigStore} from './helper/FetchGigStore';
import CardLoader from '../GlobalComponents/Loader/CardLoader';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {useSocket} from '../../contexts/SocketContext';
import {useMessageStore} from '../../global/MessageCount';
import {useIsFocused} from '@react-navigation/native';
import Search from '../GlobalComponents/Search';
import {ErrorToast} from '../../components/ErrorToast';
import Geolocation from 'react-native-geolocation-service';
import useLocationStore from '../../global/useLocationStore';
import {useNotificationCount} from '../../global/NotificationCount';
import { myLocationProps } from '../../types/interfaces/IHomeSeeker';

interface logOutProps {
  navigation: StackNavigationProp<RootStackParamsList>;
  bottomNavigation: BottomTabNavigationProp<BottomStackParamsList>;
}

export type userStateProps = {
  __v: number;
  _id: string;
  email: string;
  isVerified: boolean;
  role: string;
  username: string;
  location: string;
  profilePic: any;
  title: string;
  skills: any[];
  isTick: boolean;
  bio: string;
  about_me: string;
  phoneNumber: string;
  isDocumentVerified: string;
};

type dataProps = {
  id: number;
  what: string;
  text: string;
};

export interface GigData {
  gig: any[];
}

export interface getJobProps {
  getGig: () => Promise<GigData>;
}

export const initialGigData: GigData = {
  gig: [],
};

const Home = memo(({navigation, bottomNavigation}: logOutProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const [isPopular, setIsPopular] = React.useState<boolean>(true);
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [gigDetails, setgigDetails] = React.useState<GigData>(initialGigData);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const isFocused = useIsFocused();

  //distance
  const [selectedDistance, setSelectedDistance] = React.useState(0);

  //low to high
  const [lowToHigh, setLowToHigh] = React.useState<boolean>(false);
  //high to low
  const [highToLow, setHighToLow] = React.useState<boolean>(false);
  //sort by rating
  const [sortByRating, setSortByRating] = React.useState<boolean>(false);
  // category
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  //search text
  const [searchText, setSearchText] = React.useState<string>('');

  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);

  const [nearByGigDetails, setNearByGigDetails] = React.useState<any>([]);

  const [isLoadingBottom, setIsLoadingBottom] = React.useState<boolean>(true);

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalGigs, setTotalGigs] = React.useState<number>(0);

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

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const setLocation = useLocationStore((state: any) => state.setLocation);

  //search gig
  const searchGig = useCallback(
    async (
      searchText: string,
      selectedCategory: string,
      selectedDistance: any,
      lowToHigh: boolean,
      highTolow: boolean,
      sortByRating: boolean,
      page: number,
      limit: number,
      lat: number,
      long: number,
    ) => {
      try {
        const response = await (FetchGigStore.getState() as any).searchGig(
          searchText,
          selectedCategory,
          selectedDistance,
          lowToHigh,
          highTolow,
          sortByRating,
          page,
          limit,
          lat,
          long,
        );
        setgigDetails({
          gig: [],
          // nearBy: [],
        });
        setTotalGigs(response?.totalGigs);
        setgigDetails(prevGig => ({
          ...prevGig,
          gig: [...response.gig],
        }));

        if (response.totalPages !== undefined) {
          setTotalPages(response.totalPages);
        }
        if (response.currentPage !== undefined) {
          setCurrentPage(response.currentPage);
        }
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoading(false);
    },
    [],
  );

  //get near by Gig
  const getNearbyGig = useCallback(
    async (latitude: number, longitude: number) => {
      const response = await (FetchGigStore.getState() as any).getNearbyGig(
        latitude,
        longitude,
      );
      setNearByGigDetails(response);
    },
    [],
  );

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
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position.coords.latitude, position.coords.longitude);
            setMyLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            searchGig(
              searchText,
              selectedCategory,
              selectedDistance,
              lowToHigh,
              highToLow,
              sortByRating,
              1,
              5,
              position.coords.latitude,
              position.coords.longitude,
            );
            getNearbyGig(position.coords.latitude, position.coords.longitude);
            setIsLoading(false);
          },
          error => ErrorToast("Something went wrong, can't get location"),
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        ErrorToast('Location permission denied');
      }
    } catch (err: any) {
      ErrorToast(err.message);
    }
  }, [searchGig, getNearbyGig, setLocation]);


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

  const handleOkFunction = useCallback(() => {
    setModalVisible(false);
    setIsLoading(true);
    setTotalGigs(0);
    searchGig(
      searchText,
      selectedCategory,
      selectedDistance,
      lowToHigh,
      highToLow,
      sortByRating,
      1,
      5,
      myLocation.latitude,
      myLocation.longitude,
    );
  }, [
    searchGig,
    searchText,
    selectedCategory,
    selectedDistance,
    lowToHigh,
    highToLow,
    sortByRating,
    myLocation.latitude,
    myLocation.longitude,
  ]);

  const resetSearch = useCallback(() => {
    setModalVisible(false);
    setIsLoading(true);
    setTotalGigs(0);
    setSelectedCategory('');
    setSearchText('');
    setSelectedDistance(0);
    setLowToHigh(false);
    setHighToLow(false);
    setSortByRating(false);
    searchGig(
      '',
      '',
      '',
      false,
      false,
      false,
      1,
      5,
      myLocation.latitude,
      myLocation.longitude,
    );
  }, [searchGig, myLocation.latitude, myLocation.longitude]);

  const setPopularTrueFunction = useCallback(() => {
    setIsPopular(true);
  }, [isPopular]);

  const setPopularFalseFunction = useCallback(() => {
    setIsPopular(false);
  }, [isPopular]);

  const setSelectedItemHandler = useCallback((item: any) => {
    setSelectedData(item);
    handlePresentModalPress();
  }, []);

  useEffect(() => {
    if (selectedData) {
      setIsLoadingBottom(false);
    }
  }, [selectedData]);

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
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
                services and freelancers
              </Text>
            </View>
          </View>
          {/* description end  */}
          {/* search  */}
          <View style={{marginTop: responsiveHeight(3)}}>
            <Search
              text={'Home'}
              user={user}
              setSelectedDistance={setSelectedDistance}
              setHighToLow={setHighToLow}
              setLowToHigh={setLowToHigh}
              setSortByRating={setSortByRating}
              handleOkFunction={handleOkFunction}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              selectedDistance={selectedDistance}
              setSearchText={setSearchText}
              resetSearch={resetSearch}
            />
          </View>
          {/* body start */}
          <View style={{marginTop: responsiveHeight(3)}}>
            {/* text start */}
            <View className="flex flex-row items-center justify-between">
              <View
                className={`w-[50%] py-3 ${
                  isPopular && 'border-b-2 border-color2'
                }  `}>
                <TouchableOpacity onPress={setPopularTrueFunction}>
                  <Text
                    className={isPopular ? 'text-color2' : 'text-gray-500'}
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Browse Gigs
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                className={`w-[50%] items-center justify-center flex py-3 ${
                  !isPopular && 'border-b-2 border-color2'
                }  `}>
                <TouchableOpacity onPress={setPopularFalseFunction}>
                  <Text
                    className={isPopular ? 'text-gray-500' : 'text-color2'}
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Near by Gigs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* text end  */}
            {/* */}
            {isLoading && (
              <View
                style={{
                  height: responsiveHeight(70),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  data={[1, 1, 1, 1, 1]}
                  estimatedItemSize={5}
                  renderItem={({item, index}) => <CardLoader />}
                />
              </View>
            )}
            {!isLoading && isPopular && (
              <View
                style={{
                  height: responsiveHeight(70),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  keyExtractor={item => item._id.toString()}
                  estimatedItemSize={5}
                  data={gigDetails?.gig?.slice(0, 5)}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      onPress={() => setSelectedItemHandler(item)}>
                      <Cards data={item} user={user} />
                    </TouchableWithoutFeedback>
                  )}
                  ListEmptyComponent={() => (
                    // Render this component when there's no data
                    <View style={{paddingBottom: responsiveHeight(25)}}>
                      <Text
                        className="text-red-500"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(1.75),
                        }}>
                        No Gigs available
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: responsiveHeight(50),
                    paddingTop: responsiveHeight(2),
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            {!isLoading && !isPopular && (
              <View
                style={{
                  height: responsiveHeight(70),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  keyExtractor={(item: any) => item._id.toString()}
                  estimatedItemSize={5}
                  data={nearByGigDetails?.nearByGigs?.slice(0, 5)}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      onPress={() => setSelectedItemHandler(item)}>
                      <Cards data={item} user={user} />
                    </TouchableWithoutFeedback>
                  )}
                  ListEmptyComponent={() => (
                    // Render this component when there's no data
                    <View style={{paddingBottom: responsiveHeight(25)}}>
                      <Text
                        className="text-red-500"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(1.75),
                        }}>
                        No near by Gigs available
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: responsiveHeight(50),
                    paddingTop: responsiveHeight(2),
                  }}
                  showsVerticalScrollIndicator={false}
                />
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
              snapPoints={snapPoints}>
              <BottomSheetCard
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
});

export default Home;

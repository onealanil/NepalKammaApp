import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Cards from '../GlobalComponents/Cards';
import Review from '../GlobalComponents/Review';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {FetchGigStore} from './helper/FetchGigStore';
import {UserStore} from '../Job_seeker/helper/UserStore';
import OtherScreenLoader from '../GlobalComponents/Loader/OtherScreenLoader';
import {MessageStore} from '../Job_seeker/helper/MessageStore';
import {useGlobalStore} from '../../global/store';
import {useSocket} from '../../contexts/SocketContext';
import Rating from '../GlobalComponents/Rating';
import {TextInput} from 'react-native-gesture-handler';
import {ErrorToast} from '../../components/ErrorToast';
import {ReviewStore} from '../Job_seeker/helper/ReviewStore';
import {NotificationStore} from '../Job_seeker/helper/NotificationStore';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import MoreModalBox from '../../components/MoreModalBox';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottomSheetCard from './BottomSheetCard';

interface OtherProfileProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
  route: RouteProp<BottomStackParamsList, 'Peoples'>;
}

const Loader = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <OtherScreenLoader />
  </View>
);

const OtherProfileRenderer = React.memo(
  ({navigation, route}: OtherProfileProps) => {
    const id = route?.params.id;
    const isFocused = useIsFocused();
    const Mydata: any = useGlobalStore((state: any) => state.user);
    const socket = useSocket();

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [gigDetails, setgigDetails] = React.useState<any>([]);
    const [user, setUser] = React.useState<any>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    //is rating and review
    const [isRating, setIsRating] = useState<boolean>(false);

    //get review
    const [reviewData, setReviewData] = useState<any>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [isFetchReview, setIsFetchReview] = React.useState<boolean>(false);
    const [isFetchAverageRating, setIsFetchAverageRating] =
      React.useState<boolean>(false);
    const [moreModalVisible, setMoreModalVisible] =
      React.useState<boolean>(false);
    const [selectedData, setSelectedData] = React.useState<any>(null);

    // ref
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // variables
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

    const handleNextItemPress = useCallback(
      (data: any) => {
        var nextIndex = (currentIndex + 1) % data.length;
        if (nextIndex === 5) {
          nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
      },
      [currentIndex],
    );

    const fetchAverageRating = useCallback(async (id: string) => {
      setIsFetchAverageRating(true);
      try {
        const response = await (ReviewStore.getState() as any).getAverageRating(
          id,
        );
        setAverageRating(response);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsFetchAverageRating(false);
    }, []);

    //get all gig details
    const getGigDetails = useCallback(async (id: string) => {
      try {
        const response = await (FetchGigStore.getState() as any).getSingleGigs(
          id,
        );
        setgigDetails(response);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    }, []);

    const getSingleUser = useCallback(async (id: string) => {
      setIsLoading(true);
      try {
        const response = await (UserStore.getState() as any).getSingleUser(id);
        setUser(response?.user);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoading(false);
    }, []);

    React.useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          await getGigDetails(route?.params?.id);
          await getSingleUser(route?.params?.id);
          await fetchAverageRating(route?.params?.id);
        } catch (error: any) {
          const errorMessage = error
            .toString()
            .replace('[Error: ', '')
            .replace(']', '');
          ErrorToast(errorMessage);
        }
        setIsLoading(false);
      };
      if (id && isFocused) {
        fetchData();
      }
    }, [
      fetchAverageRating,
      getGigDetails,
      getSingleUser,
      id,
      isFocused,
      route?.params?.id,
    ]);

    const backPressHandler = useCallback(() => {
      setUser({});
      navigation.navigate('Peoples', {
        id: '',
      });
    }, [navigation]);

    const sendMessageHandler = useCallback(
      async (conversationId: string) => {
        const newValues = {
          conversationId: conversationId,
          msg: `I want to ask you something about your gig.`,
          recipientId: user?._id,
        };
        const response = await (MessageStore.getState() as any).createMessage(
          newValues,
        );
        if (response) {
          navigation.navigate('Actual_Message', {
            conversation_id: conversationId,
          });
        }

        const messageData = {
          sender: Mydata?._id,
          receiver: user?._id,
          message: newValues.msg,
          conversationId: newValues.conversationId,
        };
        socket.emit('textMessage', messageData);
      },
      [Mydata, navigation, socket, user],
    );

    const createConversation = useCallback(async () => {
      const newValues = {
        senderId: Mydata?._id,
        receiverId: user?._id,
      };
      const response = await (
        MessageStore.getState() as any
      ).createConversation(newValues);
      if (response) {
        sendMessageHandler(response?.conversation._id.toString());
      }
    }, [Mydata, sendMessageHandler, user]);

    // apply job handler function
    const applyJobHandler = useCallback(() => {
      if (Mydata?.isDocumentVerified === 'verified') {
        createConversation();
      } else {
        ErrorToast('Please verify your document first');
      }
    }, [createConversation]);

    React.useEffect(() => {
      if (isFocused && user && user.can_review && user.can_review.length > 0) {
        const ids = user.can_review.map((item: any) => item.user);
        if (ids.includes(Mydata?._id)) {
          setIsRating(true);
        } else {
          setIsRating(false);
        }
      } else {
        setIsRating(false);
      }
    }, [isFocused, Mydata?._id, user]);

    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>('');

    const fetchReview = useCallback(async (id: string) => {
      setIsFetchReview(true);
      try {
        const response = await (ReviewStore.getState() as any).getReview(id);
        setReviewData(response);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsFetchReview(false);
    }, []);

    React.useEffect(() => {
      if (user?._id) {
        fetchReview(user?._id);
      }
    }, [fetchReview, user]);

    const handleCreateNotification = useCallback(async () => {
      try {
        await (NotificationStore.getState() as any).createReview(
          Mydata?._id,
          id,
          null,
          null,
          review,
          'review',
        );
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    }, [Mydata, id, review]);

    const handleReviewSubmit = useCallback(async () => {
      setIsSubmitting(true);
      try {
        await (ReviewStore.getState() as any).createReview(
          Mydata?._id,
          user?._id,
          review,
          rating,
        );
        handleCreateNotification();
        fetchReview(user?._id);
        setReview('');
        setRating(0);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsSubmitting(false);
    }, [Mydata, fetchReview, handleCreateNotification, rating, review, user]);

    // phone handler
    const phoneHandler = useCallback(() => {
      if (Mydata?.isDocumentVerified !== 'verified') {
        ErrorToast('Please verify your document first');
        return;
      }
      const phoneNumber = user?.phoneNumber;
      let phoneNumberWithPrefix = '';

      if (Platform.OS === 'android') {
        phoneNumberWithPrefix = `tel:${phoneNumber}`;
      } else if (Platform.OS === 'ios') {
        phoneNumberWithPrefix = `telprompt:${phoneNumber}`;
      }

      Linking.openURL(phoneNumberWithPrefix).catch(err =>
        console.error('An error occurred: ', err),
      );
    }, [user?.phoneNumber]);

    if (isLoading || Object.keys(user).length === 0) {
      return <Loader />;
    }

    return (
      // <ScrollView className="bg-white">
      <View
        className="w-[100%] flex flex-col"
        style={{padding: responsiveHeight(2)}}>
        {/* back button */}
        <TouchableOpacity onPress={backPressHandler}>
          <View className="mb-2 flex flex-row items-center gap-x-2">
            <IconIcons name="arrow-back" size={30} color="gray" />
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveHeight(2),
              }}>
              Back
            </Text>
          </View>
        </TouchableOpacity>
        {/* for profile pic and simple details */}
        <View className="flex flex-row gap-x-5 items-center">
          {/* profile pic  */}
          <View>
            {user && user?.profilePic && (
              <FastImage
                source={{uri: user?.profilePic?.url}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100 / 2,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: '#79AC78',
                }}
              />
            )}
          </View>
          {/* simple details start */}
          <View
            className="flex flex-col gap-y-2"
            style={{width: responsiveWidth(60)}}>
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(3),
              }}>
              {user?.username}
            </Text>
            <View className="flex flex-row gap-x-1">
              {/* star  */}
              <IconIcons
                name="star"
                size={17}
                color={`${averageRating > 0 ? '#E2EA3B' : 'gray'}`}
              />
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(2),
                }}>
                {isFetchAverageRating ? (
                  <Text className="text-color2">Loading...</Text>
                ) : (
                  averageRating?.toFixed(1) || 0
                )}
              </Text>
            </View>
            {/* bio */}
            <Text
              className="text-black tracking-wide leading-5"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: responsiveHeight(1.75),
              }}>
              {user?.bio || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveHeight(1.75),
                  }}>
                  No bio
                </Text>
              )}
            </Text>
            <View className="flex flex-row gap-x-1">
              <IconIcons name="location-outline" size={17} color="#79AC78" />
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: responsiveHeight(1.75),
                }}>
                {user?.location || (
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveHeight(1.75),
                    }}>
                    No location
                  </Text>
                )}
              </Text>
            </View>
          </View>
          {/* simple details end  */}
        </View>
        {/* buttons  */}
        <View
          className="flex flex-row items-center justify-between gap-x-2"
          style={{marginTop: responsiveHeight(4)}}>
          <TouchableOpacity onPress={applyJobHandler}>
            <View className="py-2 px-5 bg-color2 rounded-md flex flex-row items-center gap-x-1">
              <Feather name="message-circle" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.75),
                  color: 'white',
                }}>
                Message
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={phoneHandler}>
            <View className="py-2 px-5 bg-color2 rounded-md flex flex-row items-center gap-x-1">
              <IconIcons name="call-outline" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.75),
                  color: 'white',
                }}>
                Call
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMoreModalVisible(true)}>
            <View className="py-2 px-5 bg-color2 rounded-md flex flex-row items-center gap-x-1">
              <MaterialIcon name="unfold-more" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.75),
                  color: 'white',
                }}>
                More
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* other details */}
        <View className="mt-6">
          {/* about me  */}
          <View className="flex flex-col gap-y-2">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(2),
              }}>
              About me
            </Text>
            <Text
              className="text-black tracking-wide"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: responsiveHeight(1.75),
              }}>
              {user?.about_me || (
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveHeight(1.75),
                  }}>
                  No about me
                </Text>
              )}
            </Text>
          </View>
          {/* skills  */}
          <View className="mt-6">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(2),
              }}>
              Skills
            </Text>
            <View>
              <View style={{height: 50, width: 130}}>
                <FlashList
                  estimatedItemSize={100}
                  horizontal={true}
                  data={user?.skills}
                  renderItem={({item}: any) => {
                    return (
                      <View
                        style={{marginBottom: responsiveHeight(1)}}
                        className="bg-gray-300 mr-2 py-1 px-2 rounded-md">
                        <Text
                          className="text-black"
                          style={{
                            fontSize: responsiveFontSize(1.75),
                            fontFamily: 'Montserrat-Regular',
                          }}>
                          {item}
                        </Text>
                      </View>
                    );
                  }}
                  ListEmptyComponent={() => (
                    // Render this component when there's no data
                    <View>
                      <Text
                        className="text-red-500"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(1.75),
                        }}>
                        No Skills Added
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </View>
        {/* gigs show  */}
        <View className="flex flex-col gap-y-2">
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveHeight(2),
            }}>
            My Gigs
          </Text>
          <View>
            {/* gigs card start  */}
            <View
              style={{
                height: gigDetails?.userGigs.length > 0 ? responsiveHeight(38): responsiveHeight(10),
                width: responsiveWidth(90),
              }}>
              <FlashList
                horizontal={true}
                keyExtractor={(item: any) => item._id.toString()}
                estimatedItemSize={10}
                data={gigDetails?.userGigs?.slice(
                  currentIndex,
                  currentIndex + 1,
                )}
                renderItem={({item}) => (
                  <View style={{width: responsiveWidth(90)}}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSelectedData(item);
                        handlePresentModalPress();
                      }}>
                      <Cards data={item} />
                    </TouchableWithoutFeedback>
                  </View>
                )}
                ListEmptyComponent={() => (
                  // Render this component when there's no data
                  <View>
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
                  paddingBottom: responsiveHeight(2),
                  paddingTop: responsiveHeight(2),
                }}></FlashList>
            </View>
            {gigDetails &&
              gigDetails?.userGigs &&
              gigDetails?.userGigs.length > 0 && (
                <TouchableOpacity
                  className="bg-color2 py-2 flex items-center justify-center rounded-md mb-3"
                  onPress={() => handleNextItemPress(gigDetails?.userGigs)}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveHeight(2),
                      color: 'white',
                    }}>
                    Next
                  </Text>
                </TouchableOpacity>
              )}

            {/* gits card end  */}
          </View>
          {/* review start  */}
          <View className="flex flex-col">
            <Text
              className="text-black mb-3"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              Reviews
            </Text>
            {/* make a line */}
            <View
              className="mb-3"
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
              }}
            />
            {isRating && (
              <React.Fragment>
                {/* rating input start  */}
                <View
                  className="flex flex-row gap-x-3"
                  style={{marginBottom: responsiveHeight(3)}}>
                  <View className="w-[13%]">
                    <Image
                      source={{uri: Mydata?.profilePic.url}}
                      style={{height: 40, width: 40, borderRadius: 40}}
                    />
                  </View>
                  <View className="w-[80%] flex flex-col gap-y-1">
                    <Text
                      className="text-black"
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: responsiveFontSize(1.75),
                      }}>
                      {Mydata?.username}
                    </Text>
                    <Text
                      className="text-black"
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: responsiveFontSize(1.75),
                      }}>
                      {Mydata?.location}
                    </Text>
                    <Rating initialRating={rating} onRatingChange={setRating} />
                    <TextInput
                      multiline
                      placeholder="Write your review..."
                      value={review}
                      onChangeText={setReview}
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: responsiveFontSize(1.75),
                      }}
                      placeholderTextColor={'gray'}
                      className="text-black border-solid border-[1px] border-color2 rounded-md p-2 w-full mt-2"
                    />
                    {isSubmitting && (
                      <TouchableOpacity className="w-[100%] flex items-center justify-center py-2 px-5 bg-color2 rounded-md mt-2">
                        <Text
                          className="text-white"
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          Submitting...
                        </Text>
                      </TouchableOpacity>
                    )}
                    {!isSubmitting && (
                      <TouchableOpacity
                        onPress={handleReviewSubmit}
                        className="w-[100%] flex items-center justify-center py-2 px-5 bg-color2 rounded-md mt-2">
                        <Text
                          className="text-white"
                          style={{
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          Submit
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {/* rating input end  */}
                {/* make a line */}
                <View
                  className="mb-3"
                  style={{
                    borderBottomColor: 'gray',
                    borderBottomWidth: 1,
                  }}
                />
              </React.Fragment>
            )}

            {isFetchReview ? (
              <Text
                className="text-color2"
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: responsiveFontSize(1.75),
                }}>
                Loading...
              </Text>
            ) : (
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: responsiveFontSize(1.75),
                }}>
                Total {reviewData?.length} Reviews
              </Text>
            )}

            <View className="flex flex-col gap-y-4">
              {!isFetchReview && reviewData.length > 0 && (
                <View
                  style={{
                    height: responsiveHeight(70),
                    width: responsiveWidth(90),
                  }}>
                  <FlashList
                    keyExtractor={(item: any) => item._id?.toString() || ''}
                    estimatedItemSize={10}
                    data={reviewData}
                    renderItem={({item}) => <Review data={item} />}
                    ListEmptyComponent={() => (
                      // Render this component when there's no data
                      <View style={{paddingBottom: responsiveHeight(10)}}>
                        <Text
                          className="text-red-500"
                          style={{
                            fontFamily: 'Montserrat-Bold',
                            fontSize: responsiveFontSize(1.75),
                          }}>
                          No review found
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
            </View>
          </View>
        </View>
        <MoreModalBox
          isModalVisible={moreModalVisible}
          setIsModalVisible={setMoreModalVisible}
          address={user?.address}
          reportedBy={Mydata}
          reportedTo={user?._id}
        />
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
            navigation={navigation}
          />
        </BottomSheetModal>
      </View>
    );
  },
);

const OtherProfile = ({navigation, route}: OtherProfileProps) => {
  return (
    <BottomSheetModalProvider>
      <FlatList
        style={{backgroundColor: 'white'}}
        data={[
          {
            key: 'form-key',
            component: (
              <OtherProfileRenderer navigation={navigation} route={route} />
            ),
          },
        ]}
        renderItem={({item}) => item.component}
      />
    </BottomSheetModalProvider>
  );
};

export default React.memo(OtherProfile);

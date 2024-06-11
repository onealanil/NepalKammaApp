import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  TextInput,
  Button,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Review from '../GlobalComponents/Review';
import RenderHTML, {defaultSystemFonts} from 'react-native-render-html';
import {systemFonts} from '../GlobalComponents/Cards';
import {MessageStore} from './helper/MessageStore';
import {userStateProps} from './Home';
import {useGlobalStore} from '../../global/store';
import {useSocket} from '../../contexts/SocketContext';
import Rating from '../GlobalComponents/Rating';
import {ErrorToast} from '../../components/ErrorToast';
import {ReviewStore} from './helper/ReviewStore';
import {NotificationStore} from './helper/NotificationStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import MapModal from '../GlobalComponents/MapModal';
import {UserStore} from './helper/UserStore';
import {SuccessToast} from '../../components/SuccessToast';
import {formatDistanceToNow} from 'date-fns';

const BottonSheetCardSeeker = ({
  bottomSheetModalRef,
  data,
  navigation,
  getJobDetails,
  fromSavedJob,
}: any) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);


  const {checkAuth} = useGlobalStore();
  // Convert the single data into an array
  const dataArray = data ? [data] : [];

  //socket io
  const socket = useSocket();

  //is applying state
  const [isApplying, setIsApplying] = useState<boolean>(false);

  //is rating and review
  const [isRating, setIsRating] = useState<boolean>(false);

  //get review
  const [reviewData, setReviewData] = useState<any>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [averageRating, setAverageRating] = useState<number>(0);

  const [isLocationModalVisible, setLocationModalVisible] =
    useState<boolean>(false);

  const [isFetchAverageRating, setIsFetchAverageRating] =
    React.useState<boolean>(false);
  const [isFetchReview, setIsFetchReview] = React.useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isPostSaved, setIsPostSaved] = useState<boolean>(false);

  const {width} = useWindowDimensions();

  const generateHtmlPreview = useCallback(() => {
    let html = `<p style="color: black;">${data?.job_description}</p>`;
    html = html.replace(/\n/g, '<br/>');
    return html;
  }, [data]);

  useEffect(() => {
    if (user && user?.savedPostJob.includes(data?._id)) {
      setIsPostSaved(true);
    }
  }, [user, data?._id]);

  // send message handler function
  const sendMessageHandler = useCallback(
    async (conversationId: string) => {
      const newValues = {
        conversationId,
        msg: `Hello, I am interested in your job [${data?.title}]. Can we discuss more about it?. My username is ${user?.username}.`,
        recipientId: data?.postedBy._id,
      };
      const response = await (MessageStore.getState() as any).createMessage(
        newValues,
      );
      setIsApplying(false);
      if (response) {
        navigation.navigate('Actual_Message', {
          conversation_id: conversationId,
        });
      }

      const messageData = {
        sender: user?._id,
        receiver: data?.postedBy._id,
        message: newValues.msg,
        conversationId: newValues.conversationId,
      };
      socket.emit('textMessage', messageData);
    },
    [data, user, navigation, socket],
  );

  const createConversation = useCallback(async () => {
    const newValues = {
      senderId: user._id,
      receiverId: data?.postedBy?._id,
    };
    const response = await (MessageStore.getState() as any).createConversation(
      newValues,
    );
    if (response) {
      sendMessageHandler(response?.conversation._id.toString());
    }
  }, [data, user, sendMessageHandler]);

  // apply job handler function
  const applyJobHandler = useCallback(() => {
    if (user?.isDocumentVerified !== 'verified') {
      ErrorToast('Please verify your document first');
      return;
    }
    setIsApplying(true);
    createConversation();
  }, [createConversation]);

  useEffect(() => {
    const ids = data?.postedBy?.can_review?.map((item: any) => item.user);
    if (ids.includes(user?._id)) {
      setIsRating(true);
    }
  }, [data, user]);

  const fetchReview = useCallback(async (id: string) => {
    setIsFetchReview(true);
    try {
      const response = await (ReviewStore.getState() as any).getReview(id);
      setReviewData(response);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
    setIsFetchReview(false);
  }, []);

  const fetchAverageRating = useCallback(async (id: string) => {
    setIsFetchAverageRating(true);
    try {
      const response = await (ReviewStore.getState() as any).getAverageRating(
        id,
      );
      setAverageRating(response);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
    setIsFetchAverageRating(false);
  }, []);

  useEffect(() => {
    fetchReview(data?.postedBy?._id);
    fetchAverageRating(data?.postedBy?._id);
  }, [fetchReview, fetchAverageRating, data]);

  const handleCreateNotification = useCallback(async () => {
    try {
      await (NotificationStore.getState() as any).createReview(
        user?._id,
        data?.postedBy?._id,
        data?._id,
        null,
        review,
        'review',
      );
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
  }, [data, review, user]);

  const handleReviewSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await (ReviewStore.getState() as any).createReview(
        user?._id,
        data?.postedBy?._id,
        review,
        rating,
      );
      handleCreateNotification();
      fetchReview(data?.postedBy?._id);
      setReview('');
      setRating(0);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
    setIsSubmitting(false);

    const notificationData = {
      sender: user?._id,
      receiver: data?.postedBy._id,
      type: 'review',
    };
    socket.emit('notification', notificationData);
  }, [
    data,
    review,
    rating,
    handleCreateNotification,
    fetchReview,
    user,
    socket,
  ]);

  const saveJobHandler = useCallback(async () => {
    try {
      const res = await (UserStore.getState() as any).saveJob(data?._id);
      if (res) {
        checkAuth();
        SuccessToast(res?.message);
      }
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
  }, []);

  const unsaveJobHandler = useCallback(async () => {
    try {
      const res = await (UserStore.getState() as any).unsaveJob(data?._id);
      await checkAuth();
      if (fromSavedJob === 'from_saved_job') {
        await getJobDetails();
      }
      bottomSheetModalRef.current?.close();
      SuccessToast(res?.message);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
  }, [data, getJobDetails]);

  const renderItem = ({item}: any) => (
    <View>
      {/* main body starts  */}
      <View className="flex flex-col gap-y-4 p-8">
        {/* title  */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            {data?.title}
          </Text>
        </View>
        {/* uploader images profiel */}
        <View className="flex flex-row gap-x-2">
          {/* profile pic  */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Other_Profile', {
                id: data?.postedBy?._id,
              })
            }>
            <View>
              {data?.postedBy?.profilePic && (
                <View className="relative">
                  <FastImage
                    source={{uri: data?.postedBy?.profilePic.url}}
                    style={{height: 40, width: 40, borderRadius: 40}}
                    className="relative"
                  />
                  <View
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-white ${
                      data?.postedBy?.onlineStatus
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
          {/* name  */}
          <View className="flex flex-col gap-y-1">
            <View className="flex flex-row items-center justify-between">
              <Text
                className="text-black w-[70%]"
                style={{fontFamily: 'Montserrat-Bold'}}>
                {' '}
                {data?.postedBy?.username}
              </Text>
              {isPostSaved ? (
                <TouchableOpacity onPress={unsaveJobHandler}>
                  <MaterialCommunityIcons
                    className="w-[30%] mt-2"
                    name="content-save-all"
                    size={20}
                    color="#79AC78"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={saveJobHandler}>
                  <MaterialCommunityIcons
                    className="w-[30%] mt-2"
                    name="content-save-all-outline"
                    size={20}
                    color="#79AC78"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View className="flex flex-row gap-x-1">
              <FontAwesome
                name="star"
                size={15}
                color={`${averageRating > 0 ? '#E2EA3B' : 'gray'}`}
              />
              <Text
                className="text-black"
                style={{fontFamily: 'Montserrat-Bold'}}>
                {' '}
                {isFetchAverageRating ? (
                  <Text className="text-color2">Loading...</Text>
                ) : (
                  averageRating?.toFixed(1) || 0
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* about the job  */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            About this Job
          </Text>

          <RenderHTML
            contentWidth={width}
            source={{html: generateHtmlPreview()}}
            baseStyle={{
              color: 'black',
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.75),
              lineHeight: 18.5,
            }}
            systemFonts={systemFonts}
          />
        </View>

        {/* skills required */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            Skills Required
          </Text>

          <View style={{padding: responsiveHeight(1)}}>
            <FlatList
              horizontal={true}
              data={data?.skills_required}
              renderItem={({item}) => {
                return (
                  <View
                    style={{marginBottom: responsiveHeight(1)}}
                    className="border-color2 border-solid border-[1px] mr-2 py-1 px-2 rounded-md">
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
            />
          </View>
        </View>

        <View className="flex flex-col">
          <Text
            className="text-black mb-2"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            Payment
          </Text>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.75),
            }}>
            Payment Starts from Rs.{' '}
            <Text className="text-black font-bold">{data?.price}</Text>
          </Text>
          <Text
            className="text-red-500 mt-2 leading-4"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(1.5),
            }}>
            Payment varies based on experience, qualifications, and project
            scope. Contact the job provider for details before applying. Thank
            you for your proactive approach
          </Text>
        </View>

        {/* Payment method */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            Payment Method
          </Text>

          <View style={{padding: responsiveHeight(1)}}>
            <FlatList
              horizontal={true}
              data={data?.payment_method}
              renderItem={({item}) => {
                return (
                  <View
                    style={{marginBottom: responsiveHeight(1)}}
                    className="border-color2 border-solid border-[1px] mr-2 py-1 px-2 rounded-md">
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
            />
          </View>
        </View>

        {/* charging  */}
        <View className="flex flex-col gap-y-2">
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            For more Details
          </Text>
          <View className="flex flex-row pt-2 items-center justify-around">
            <TouchableOpacity onPress={applyJobHandler}>
              <Text
                className="text-white py-2 px-5 bg-color2 rounded-md"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(1.75),
                }}>
                {isApplying ? 'Applying...' : 'Apply Now'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
              <Text
                className="text-white py-2 px-5 bg-color2 rounded-md"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(1.75),
                }}>
                View on Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row gap-x-2">
          <Text
            className="text-black mt-2 leading-4"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(1.5),
            }}>
            Job will expire in
          </Text>
          <Text
            className="text-red-500 mt-2 leading-4"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(2),
            }}>
            {formatDistanceToNow(new Date(data?.experiesIn))}
          </Text>
        </View>

        {/* REview */}
        <View className="flex flex-col">
          <Text
            className="text-black mb-3"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            Seller Reviews
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
                    source={{uri: user?.profilePic.url}}
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
                    {user?.username}
                  </Text>
                  <Text
                    className="text-black"
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      fontSize: responsiveFontSize(1.75),
                    }}>
                    {user?.location}
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
                  <TouchableOpacity
                    onPress={handleReviewSubmit}
                    className="w-[100%] flex items-center justify-center py-2 px-5 bg-color2 rounded-md mt-2">
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(1.75),
                      }}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
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

          <View className="flex flex-col gap-y-4">
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

            {!isFetchReview && reviewData.length > 0 && (
              <View
                style={{
                  height: responsiveHeight(70),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  estimatedItemSize={100}
                  keyExtractor={(item: any) => item._id?.toString() || ''}
                  data={reviewData}
                  renderItem={({item}) => <Review data={item} />}
                  ListEmptyComponent={() => (
                    <View style={{paddingBottom: responsiveHeight(25)}}>
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
                  showsVerticalScrollIndicator={false}></FlashList>
              </View>
            )}
          </View>
        </View>
      </View>
      <MapModal
        isModalVisible={isLocationModalVisible}
        setIsModalVisible={setLocationModalVisible}
        address={data?.address}
      />
    </View>
  );

  return (
    <>
      <View className="w-[100%] flex flex-row justify-between px-8 pb-2">
        <View className="flex flex-row items-center justify-center gap-x-2">
          <IonIcons
            name="home-outline"
            size={20}
            color="#79AC78"
            className="p-5"
          />
          <MaterialIcons
            name="arrow-forward-ios"
            size={20}
            color="gray"
            className="p-5"
          />
          <Text
            className="text-gray-500"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.75),
            }}>
            {data?.category}
          </Text>
        </View>

        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
          <AntDesign name="closecircle" size={20} color="red" className="p-5" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataArray}
        renderItem={item => renderItem(item)}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
        }}></FlatList>
    </>
  );
};

export default React.memo(BottonSheetCardSeeker);

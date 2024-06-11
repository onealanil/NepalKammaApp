import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import React, {useState, useCallback} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import Review from '../GlobalComponents/Review';
import RenderHTML from 'react-native-render-html';
import {systemFonts} from '../GlobalComponents/Cards';
import {useGlobalStore} from '../../global/store';
import {userStateProps} from '../Job_seeker/Home';
import {ReviewStore} from '../Job_seeker/helper/ReviewStore';
import {ErrorToast} from '../../components/ErrorToast';
import Rating from '../GlobalComponents/Rating';
import {NotificationStore} from '../Job_seeker/helper/NotificationStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import MapModal from '../GlobalComponents/MapModal';

const BottomSheetCard = ({bottomSheetModalRef, data, navigation}: any) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  // Convert the single data into an array
  const dataArray = data ? [data] : [];

  //is rating and review
  const [isRating, setIsRating] = useState<boolean>(false);

  //get review
  const [reviewData, setReviewData] = useState<any>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isFetchAverageRating, setIsFetchAverageRating] =
    React.useState<boolean>(false);
  const [isFetchReview, setIsFetchReview] = React.useState<boolean>(false);

  const [isLocationModalVisible, setLocationModalVisible] =
    useState<boolean>(false);

  const {width} = useWindowDimensions();

  const generateHtmlPreview = useCallback(() => {
    let html = `<p style="color: black;">${data?.gig_description}</p>`;
    html = html.replace(/\n/g, '<br/>');
    return html;
  }, [data?.gig_description]);

  React.useEffect(() => {
    const ids = data?.postedBy?.can_review?.map((item: any) => item.user);
    if (ids && ids.includes(user?._id)) {
      setIsRating(true);
    }
  }, [data, user?._id]);

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

  React.useEffect(() => {
    fetchReview(data?.postedBy?._id);
    fetchAverageRating(data?.postedBy?._id);
  }, [fetchReview, fetchAverageRating]);

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
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, [data?._id, data?.postedBy?._id, review, user?._id]);

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
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsSubmitting(false);
  }, [
    user?._id,
    data?.postedBy?._id,
    review,
    rating,
    handleCreateNotification,
    fetchReview,
  ]);

  const renderItem = () => (
    <View>
      {/* main body starts  */}
      <View className="flex flex-col gap-y-5 p-8">
        {/* title  */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            I will do {data?.title}
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
              {data?.postedBy?.profilePic?.url && (
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
            <View className="flex  flex-row items-center justify-between">
              <Text
                className="text-black"
                style={{fontFamily: 'Montserrat-Bold'}}>
                {' '}
                {data?.postedBy?.username}
              </Text>
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
        {/* photo/banner */}
        <View style={{width: responsiveWidth(85), height: 230}}>
          <Swiper showsButtons={true}>
            {data?.images?.map((image: any, index: any) => (
              <View
                style={{alignItems: 'center', backgroundColor: '#fff'}}
                key={image?.url}>
                <FastImage
                  style={{width: responsiveWidth(85), height: 200}}
                  // source={require('../../../assets/images/user-profile.jpg')}
                  source={{uri: image?.url}}
                />
                <Text
                  className="text-black text-xs"
                  style={{
                    fontFamily: 'Montserrat-Regular',
                  }}>
                  Banner - {index + 1}
                </Text>
              </View>
            ))}
          </Swiper>
        </View>
        {/* about the gig  */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            About this gig
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
        {/* skills required  */}
        <View>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            Skills
          </Text>

          <View style={{height: 50, width: 130}}>
            <FlashList
              estimatedItemSize={100}
              horizontal={true}
              data={data?.postedBy?.skills || []}
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
        {/* charging  */}
        <View className="flex flex-col gap-y-2">
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            Pricing
          </Text>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.75),
            }}>
            I will start from Rs.{''}
            <Text className="text-black font-bold"> {data?.price}</Text> for
            this gig.
          </Text>
          <Text
            className="text-red-500 mt-2 leading-4"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(1.5),
            }}>
            Please be aware that pricing may vary depending on the complexity
            and scale of the job. However, we believe in transparent pricing and
            ensuring that you receive the best value for your investment
          </Text>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(2),
            }}>
            For more Details
          </Text>
          <View className="flex flex-row pt-2 items-center justify-between">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Other_Profile', {
                  id: data?.postedBy?._id,
                })
              }>
              <Text
                className="text-white py-2 px-5 bg-color2 rounded-md"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(1.75),
                }}>
                Contact Me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
              <Text
                className="text-white py-2 px-5 bg-color2 rounded-md"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(1.75),
                }}>
                Get My Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* REview */}
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
                  <FastImage
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
                        {isSubmitting ? 'Submitting...' : 'Submit'}
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
        address={data?.postedBy?.address}
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
        }}></FlatList>
    </>
  );
};

export default React.memo(BottomSheetCard);

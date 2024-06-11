import {View, Text, Platform, Linking} from 'react-native';
import React, {useCallback} from 'react';
import {ScrollView} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {TouchableOpacity} from 'react-native';
import IconIcons from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {UserStore} from './helper/UserStore';
import {useIsFocused} from '@react-navigation/native';
import {FlatList} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Cards from '../GlobalComponents/Cards';
import {useGlobalStore} from '../../global/store';
import {MessageStore} from './helper/MessageStore';
import {useSocket} from '../../contexts/SocketContext';
import OtherScreenLoader from '../GlobalComponents/Loader/OtherScreenLoader';
import {ErrorToast} from '../../components/ErrorToast';
import {FlashList} from '@shopify/flash-list';
import MoreModalBox from '../../components/MoreModalBox';
import FastImage from 'react-native-fast-image';
import {ReviewStore} from './helper/ReviewStore';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottonSheetCardSeeker from './BottonSheetCardSeeker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OtherProfile = ({navigation, route}: any) => {
  const isFocused = useIsFocused();
  const Mydata: any = useGlobalStore((state: any) => state.user);
  const socket = useSocket();
  const [user, setUser] = React.useState<any>({});
  const [jobs, setJobs] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [moreModalVisible, setMoreModalVisible] =
    React.useState<boolean>(false);
  const [isFetchAverageRating, setIsFetchAverageRating] =
    React.useState<boolean>(false);
  const [averageRating, setAverageRating] = React.useState<number>(0);

  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ['50%', '90%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleNextItemPress = (jobs:any) => {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Reset the index to 0 when reaching the end
    }
  };

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

  const getSingleUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await (UserStore.getState() as any).getSingleUser(id);
      setUser(response?.user);
      setJobs(response?.userJobs);
    } catch (error: any) {
      if (error) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isFocused) {
      getSingleUser(route?.params?.id);
      fetchAverageRating(route?.params?.id);
    }
  }, [isFocused]);

  // send message handler function
  const sendMessageHandler = useCallback(
    async (conversationId: string) => {
      const newValues = {
        conversationId: conversationId,
        msg: `I want to ask you something about your job.`,
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
    [Mydata?._id, user?._id, navigation, socket],
  );

  const backPressHandler = useCallback(() => {
    setUser({});
    navigation.navigate('Home_bottom', {
      id: '',
    });
  }, [navigation]);

  const createConversation = useCallback(async () => {
    const newValues = {
      senderId: Mydata?._id,
      receiverId: user?._id,
    };
    const response = await (MessageStore.getState() as any).createConversation(
      newValues,
    );
    if (response) {
      sendMessageHandler(response?.conversation._id.toString());
    }
  }, [Mydata?._id, user?._id, sendMessageHandler]);

  // apply job handler function
  const applyJobHandler = () => {
    if (Mydata?.isDocumentVerified !== 'verified') {
      ErrorToast('Please verify your document first');
      return;
    }
    // setIsApplying(true);
    createConversation();
  };

  const setSelectedItemHandler = useCallback((item: any) => {
    setSelectedData(item);
    handlePresentModalPress();
  }, []);

  if (isLoading || Object.keys(user).length === 0) {
    return <OtherScreenLoader />;
  }

  return (
    <BottomSheetModalProvider>
      <ScrollView className="bg-white">
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
              {user && user?.profilePic?.url && (
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
              <View className="flex flex-row items-center gap-x-2">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveHeight(3),
                  }}>
                  {user?.username}
                </Text>
                {user?.isDocumentVerified === 'verified' && (
                  <MaterialIcons name="verified" size={15} color={'green'} />
                )}
              </View>
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
              <View
                className="w-[60%] flex items-center"
                style={{
                  borderRadius: responsiveHeight(1),
                  borderColor: '#79AC78',
                  borderWidth: 1,
                }}>
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: responsiveHeight(1.75),
                    padding: responsiveHeight(1),
                  }}>
                  Level {user?.mileStone} Seller
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
          </View>

          {/* gigs show  */}
          <View
            className="flex flex-col gap-y-2"
            style={{marginTop: responsiveHeight(2)}}>
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(2),
              }}>
              Jobs
            </Text>
            <View>
              {/* jobs card start  */}
              <View
                style={{
                  height: responsiveHeight(38),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  horizontal={true}
                  keyExtractor={(item: any) => item._id.toString()}
                  estimatedItemSize={10}
                  data={jobs?.reverse().slice(currentIndex, currentIndex + 1)}
                  renderItem={({item}) => (
                    <View style={{width: responsiveWidth(90)}}>
                      <TouchableWithoutFeedback
                        onPress={() => setSelectedItemHandler(item)}>
                        <Cards data={item} user={Mydata} />
                      </TouchableWithoutFeedback>
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: responsiveHeight(2),
                    paddingTop: responsiveHeight(1),
                  }}></FlashList>
              </View>
              <TouchableOpacity
                className="bg-color2 py-2 flex items-center justify-center rounded-md mb-3"
                onPress={() => handleNextItemPress(jobs)}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveHeight(2),
                    color: 'white',
                  }}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
              navigation={navigation}
            />
          </BottomSheetModal>
          <MoreModalBox
            isModalVisible={moreModalVisible}
            setIsModalVisible={setMoreModalVisible}
            address={user?.address}
            reportedBy={Mydata}
            reportedTo={user?._id}
          />
        </View>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};

export default React.memo(OtherProfile);

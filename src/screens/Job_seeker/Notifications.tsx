import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import { BottomStackParamsList } from '../../navigation/ButtonNavigatorSeeker';
import { userStateProps } from './Home';
import { useGlobalStore } from '../../global/store';
import { useIsFocused } from '@react-navigation/native';
import { ErrorToast } from '../../components/ErrorToast';
import { NotificationStore } from './helper/NotificationStore';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../contexts/SocketContext';
import { useNotificationCount } from '../../global/NotificationCount';
import { FlashList } from '@shopify/flash-list';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface notificationProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
}

const NotificationRenderer = ({ item }: any) => {
  return (
    <React.Fragment>
      <View
        className="flex flex-row gap-x-2 mb-2"
        style={{ padding: responsiveHeight(1) }}>
        {/* photos */}
        <View style={{ width: '20%' }}>
          {item?.senderId?.profilePic?.url && (
            <Image
              source={{ uri: item?.senderId?.profilePic?.url }}
              style={{
                height: responsiveHeight(8),
                width: responsiveHeight(8),
                borderRadius: 100,
              }}
            />
          )}
        </View>
        {/* Message */}
        <View style={{ width: '70%' }}>
          {item?.type === 'job_posted' && (
            <View className="bg-color2 flex py-1 items-center rounded-md">
              <Text
                className="text-white"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveHeight(1.25),
                }}>
                Recommendation for you
              </Text>
            </View>
          )}
          {item?.type === 'job_posted_location' && (
            <View className="bg-color2 flex py-1 items-center rounded-md">
              <Text
                className="text-white"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveHeight(1.25),
                }}>
                Nearby job for you : 10km
              </Text>
            </View>
          )}
          <Text
            numberOfLines={1}
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveHeight(1.5),
            }}>
            {item?.senderId?.username || ''} :
            {item?.type === 'review' && (
              <Text className="text-color2"> reviewed you</Text>
            )}
            {item?.type === 'job_posted' && (
              <Text className="text-color2"> Posted a new job</Text>
            )}
            {item?.type === 'job_posted_location' && (
              <Text className="text-color2"> Posted a new job</Text>
            )}
          </Text>
          <Text
            numberOfLines={3}
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveHeight(1.5),
            }}>
            {item?.notification || ''}
          </Text>
          {item?.type === 'review' && (
            <Text
              numberOfLines={1}
              className="text-color2"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: responsiveHeight(1.25),
              }}>
              Click here to view
            </Text>
          )}
          <View className="">
            <Text className="text-black">
              {formatDistanceToNow(item?.createdAt)}
            </Text>
          </View>
        </View>
        {/* time */}
      </View>
    </React.Fragment>
  );
};

const Notifications = ({ navigation }: notificationProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const socket = useSocket();
  const [arrivalMessage, setArrivalMessage] = React.useState<any>(null);
  const [isLoadingFetchNotification, setIsLoadingFetchNotification] = React.useState<boolean>(true);

  //notifications
  const [notification, setNotification] = React.useState<any>([]);

  const isFocused = useIsFocused();

  const readallNotifications = useCallback(async () => {
    try {
      await (NotificationStore.getState() as any).readAllNotifications();
      useNotificationCount.setState(state => ({
        notificationCount: 0,
      }));
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, []);

  const fetchNotifications = useCallback(
    async (id: string) => {
      try {
        const response = await (
          NotificationStore.getState() as any
        ).getNotificationById(id);
        if (response) {
          setNotification(response);
        }
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoadingFetchNotification(false);

    },
    [setNotification],
  );

  const memoizedUserId = useMemo(() => user?._id, [user?._id]);
  const memoizedIsFocused = useMemo(() => isFocused, [isFocused]);

  useEffect(() => {
    setIsLoadingFetchNotification(true);
    if (memoizedUserId && memoizedIsFocused) {
      fetchNotifications(memoizedUserId);
      readallNotifications();
    }
  }, [memoizedUserId, memoizedIsFocused, fetchNotifications]);

  const messageListener = useCallback(
    async (newNotification: any) => {
      setArrivalMessage({
        senderId: {
          profilePic: { url: newNotification?.profilePic },
          username: newNotification?.senderUsername,
        },
        notification: newNotification.notification,
        type: newNotification.type,
        createdAt: newNotification.createdAt,
      });
      setNotification((prevNotification: any) => [
        {
          _id: Math.random().toString(),
          senderId: {
            profilePic: { url: newNotification?.profilePic },
            username: newNotification?.senderUsername,
          },
          recipientId: newNotification?.recipientId,
          notification: newNotification?.notification,
          type: newNotification?.type,
          createdAt: new Date().toISOString(),
        },
        ...prevNotification,
      ]);
      try {
        await (useNotificationCount.getState() as any).unreadNotification();
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    },
    [setArrivalMessage, setNotification],
  );

  useEffect(() => {
    socket?.on('notificationForLocationAndRecommend', messageListener);

    return () => {
      socket?.off('notificationForLocationAndRecommend', messageListener);
    };
  }, [socket, messageListener]);

  return (
    <View className="bg-white">
      <View
        className="w-[100%] flex flex-col"
        style={{ padding: responsiveHeight(2) }}>
        {/* back button */}
        <View className="mb-2 flex flex-row items-center gap-x-8">
          <TouchableOpacity onPress={() => navigation.navigate('Home_bottom')}>
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
          </TouchableOpacity>
          <Text
            className="text-lg text-black"
            style={{
              fontSize: responsiveHeight(2),
              fontFamily: 'Montserrat-Bold',
            }}>
            Notifications
          </Text>
        </View>
        <View style={{ padding: responsiveHeight(1) }}>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveHeight(2),
            }}>
            New
          </Text>
        </View>
        {/* flat list  */}
        <View
          style={{
            height: responsiveHeight(100),
            width: responsiveWidth(90),
          }}>
          {
            isLoadingFetchNotification && (
              <ActivityIndicator size="large" color="#00ff00" />
            )
          }
          {
            !isLoadingFetchNotification && (
              <FlashList
                horizontal={false}
                data={[...notification]}
                estimatedItemSize={100}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                  padding: responsiveHeight(1),
                  paddingBottom: responsiveHeight(75),
                }}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('Other_Profile', {
                        id: item?.senderId?._id,
                      })
                    }>
                    <NotificationRenderer item={item} />
                  </TouchableWithoutFeedback>
                )}
                ListEmptyComponent={() => (
                  // Render this component when there's no data
                  <View style={{ paddingBottom: responsiveHeight(25) }}>
                    <Text
                      className="text-red-500"
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: responsiveFontSize(1.75),
                      }}>
                      No Notification found
                    </Text>
                  </View>
                )}
              />
            )
          }

        </View>
      </View>
    </View>
  );
};

export default Notifications;

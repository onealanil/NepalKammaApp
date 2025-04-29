import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {MessageStore} from '../Job_seeker/helper/MessageStore';
import {formatDistanceToNow} from 'date-fns';
import {useIsFocused} from '@react-navigation/native';
import {useSocket} from '../../contexts/SocketContext';
import {useGlobalStore} from '../../global/store';
import {ErrorToast} from '../../components/ErrorToast';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Conversation = ({data}: any) => {
  const isFocused = useIsFocused();
  const socket = useSocket();
  const user = useGlobalStore((state: any) => state.user);
  const [lastMessage, setLastMessage] = React.useState({} as any);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getLastMesssage = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await (MessageStore.getState() as any).getLastMessage(
        data?._id,
      );
      setLastMessage(response.result);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  }, [data?._id]);

  useEffect(() => {
    if (isFocused) {
      getLastMesssage();
    }
  }, [isFocused, getLastMesssage]);

  const messageListener = useCallback(
    ({sender, message, conversationId}: any) => {
      console.log("this is whhat", sender, message, conversationId);
      if (conversationId === data?._id) {
        // Append the received message to the messages state
        setLastMessage((prevMessages: any) => {
          const newMessage = {
            __v: 0,
            _id: Math.random().toString(),
            conversationId: data?._id,
            createdAt: new Date().toISOString(),
            msg: message,
            senderId: sender,
            updatedAt: new Date().toISOString(),
          };
          return [newMessage];
        });
      }
    },
    [data?._id],
  );

  useEffect(() => {
    socket?.on('textMessageFromBack', messageListener);

    return () => {
      socket?.off('textMessageFromBack', messageListener);
    };
  }, [data?._id, socket, messageListener]);

  return (
    <View className="flex pl-5 flex-row gap-x-5 py-2 rounded-md border-b-[1.5px] border-[#e5e8e9]">
      {/* image  */}
      <View>
        <FastImage
          source={{uri: data?.conversation[0]?.profilePic.url}}
          style={{
            width: responsiveHeight(8),
            height: responsiveHeight(8),
            borderRadius: responsiveHeight(8) / 2,
          }}
        />
      </View>
      {/* other things */}
      <View className="flex flex-col justify-center gap-y-1">
        {/* name  */}
        <View className="flex flex-row gap-x-20">
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(2),
            }}>
            {data?.conversation[0]?.username}
          </Text>
          <Text
            className="text-color2"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(1.5),
            }}>
            {lastMessage &&
              lastMessage[0]?.createdAt &&
              formatDistanceToNow(new Date(lastMessage[0]?.createdAt))}
          </Text>
        </View>
        {/* message  */}
        <View>
          {isLoading ? (
            <ShimmerPlaceholder style={styles.messagePlaceholder} />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(1.5),
                color:
                  lastMessage[0]?.senderId !== user?._id
                    ? lastMessage[0]?.isRead
                      ? '#888'
                      : 'red'
                    : 'gray',
              }}>
              {lastMessage[0]?.msg}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messagePlaceholder: {
    width: responsiveHeight(20),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
});

export default React.memo(Conversation);
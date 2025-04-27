import React, {memo, useCallback, useMemo, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Conversation from '../GlobalComponents/Conversation';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {useIsFocused} from '@react-navigation/native';
import {useGlobalStore} from '../../global/store';
import {MessageStore} from '../Job_seeker/helper/MessageStore';
import {useSocket} from '../../contexts/SocketContext';
import {ErrorToast} from '../../components/ErrorToast';
import ConversationLoader from '../GlobalComponents/Loader/ConversationLoader';
import {useMessageStore} from '../../global/MessageCount';
import {FlashList} from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';

interface MessageProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
}

const Message = ({navigation}: MessageProps) => {
  const isFocused = useIsFocused();
  const socket = useSocket();
  const user = useGlobalStore((state: any) => state.user);
  const [conversations, setConversations] = useState([] as any);
  const [onlineUsers, setOnlineUsers] = useState([] as any);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    const fetchOnlineUsers = () => {
      socket?.emit('getOnlineUsers');
    };

    const onlineUsersListener = (data: any) => {
      // Ensure we have a proper array
      const formattedData = Array.isArray(data) ? data : [];
      console.log('Online users:', formattedData);
      setOnlineUsers(formattedData);
    };

    fetchOnlineUsers();
    socket?.on('getOnlineUsers', onlineUsersListener);

    // Add error handling
    socket?.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket?.off('getOnlineUsers', onlineUsersListener);
      socket?.off('connect_error');
    };
  }, [socket]);

  const getConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await (
        MessageStore.getState() as any
      ).getAllConversation();
      console.log(response?.result[0].conversation.length, "this is the response");
      setConversations(response?.result);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      getConversations();
    }
  }, [getConversations]);

  const readAllMessages = useCallback(async (conversation_id: string) => {
    try {
      await (MessageStore.getState() as any).readAllMessage(conversation_id);
      useMessageStore.setState(state => ({
        messageCount: 0,
      }));
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, []);

  const clickedConversationHandler = useCallback(
    (conversationId: string) => {
      navigation.navigate('Actual_Message', {conversation_id: conversationId});
      readAllMessages(conversationId);
    },
    [navigation, readAllMessages],
  );

  if (isLoading) {
    return <ConversationLoader />;
  }

  return (
    <View className="bg-white">
      <View
        className="w-[100%] flex flex-col"
        style={{padding: responsiveHeight(2)}}>
        {/* back button */}
        <View className="mb-2 flex flex-row justify-between items-center gap-x-2">
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
          </TouchableOpacity>
          <View className="flex flex-row items-center gap-x-1">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(2),
              }}>
              {user?.username}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={25} color="black" />
          </View>
          <Feather name="edit" size={25} color="black" />
        </View>

        <View>
          <View>
            <View style={{padding: responsiveHeight(1)}}>
              <FlashList
                horizontal={true}
                estimatedItemSize={90}
                data={conversations?.slice(0, 10)}
                keyExtractor={(item: any) => item._id.toString()}
                contentContainerStyle={{
                  padding: responsiveHeight(1),
                }}
                renderItem={({item}) => (
                  <MemoizedConversationItem
                    item={item}
                    onlineUsers={onlineUsers}
                    myId={user?._id?.toString()}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* message start  */}
        <View className="flex flex-row items-center justify-between">
          <View className="w-[50%] py-3">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2),
              }}>
              Messages
            </Text>
          </View>
        </View>

        {/* Conversation Start  */}
        <View
          style={{height: responsiveHeight(70), width: responsiveWidth(90)}}>
          <FlashList
            keyExtractor={(item: any) => item._id.toString()}
            estimatedItemSize={100}
            data={conversations}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  paddingBottom:
                    item.length < 2
                      ? responsiveHeight(15)
                      : responsiveHeight(1),
                }}
                onPress={() => clickedConversationHandler(item._id.toString())}>
                <MemoizedConversation data={item} onlineUsers={onlineUsers} myId={user?._id?.toString()} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingBottom: responsiveHeight(65),
              paddingTop: responsiveHeight(2),
            }}
            ListEmptyComponent={() => (
              // Render this component when there's no data
              <View style={{paddingBottom: responsiveHeight(25)}}>
                <Text
                  className="text-color2"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(1.75),
                  }}>
                  No Conversations
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const MemoizedConversation = memo(({data, onlineUsers}: any) => (
  <Conversation data={data} onlineUsers={onlineUsers} />
));

// const MemoizedConversationItem = memo(({item, onlineUsers}: any) => {
//   console.log("this is memoized conversation item", item, onlineUsers);
//   const userId = item?.conversation[0]?._id?.toString();
//   const isOnline = isUserOnline(userId, onlineUsers);

//   console.log(`Checking online status for user ${userId}:`, isOnline);
//   console.log('Online users data:', onlineUsers);

//   return (
//     <View style={{alignItems: 'center', marginRight: responsiveWidth(4)}}>
//       <FastImage
//         source={{uri: item?.conversation[0].profilePic?.url}}
//         style={{
//           width: responsiveHeight(9),
//           height: responsiveHeight(9),
//           borderRadius: 100,
//         }}
//       />
//       <View
//         style={{
//           position: 'absolute',
//           right: 0,
//           bottom: 12,
//           width: responsiveHeight(2.5),
//           height: responsiveHeight(2.5),
//           borderRadius: 100,
//           backgroundColor: isOnline ? 'green' : 'red',
//           borderWidth: 2,
//           borderColor: 'white',
//         }}
//       />
//       <Text style={{
//         marginTop: responsiveHeight(1),
//         fontFamily: 'Montserrat-Bold',
//         fontSize: responsiveFontSize(1.25),
//         color: 'black',
//       }}>
//         {item?.conversation[0]?.username}
//       </Text>
//     </View>
//   );
// },
// // Custom comparison function to prevent unnecessary re-renders
// (prevProps, nextProps) => {
//   const prevUserId = prevProps.item?.conversation[0]?._id?.toString();
//   const nextUserId = nextProps.item?.conversation[0]?._id?.toString();
//   const prevOnline = isUserOnline(prevUserId, prevProps.onlineUsers);
//   const nextOnline = isUserOnline(nextUserId, nextProps.onlineUsers);

//   return prevUserId === nextUserId && prevOnline === nextOnline;
// });

const MemoizedConversationItem = memo(({item, onlineUsers, myId}: any) => {

  // console.log(item.conversations, "this is item");
  // console.log("this is my id", item);
  // Extract the user ID from the conversation item
  const userId = item?.conversation[0]?.onlineStatus;
  console.log(userId);
  // const isOnline = isUserOnline(userId, onlineUsers);

  for(let i = 0 ; i < 2 ; i++){
    console.log("this is the ids", item?.conversation[i]?._id?.toString())
  }

  // console.log('Checking online status for:', {
  //   userId,
  //   onlineUsers,
  //   isOnline
  // });

  return (
    <View style={{alignItems: 'center', marginRight: responsiveWidth(4)}}>
      <FastImage
        source={{uri: item?.conversation[0].profilePic?.url}}
        style={{
          width: responsiveHeight(9),
          height: responsiveHeight(9),
          borderRadius: 100,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 12,
          width: responsiveHeight(2.5),
          height: responsiveHeight(2.5),
          borderRadius: 100,
          backgroundColor: userId ? 'green' : 'red',
          borderWidth: 2,
          borderColor: 'white',
        }}
      />
      <Text
        style={{
          marginTop: responsiveHeight(1),
          fontFamily: 'Montserrat-Bold',
          fontSize: responsiveFontSize(1.25),
          color: 'black',
        }}>
        {item?.conversation[0]?.username}
      </Text>
    </View>
  );
});

// Updated to expect a userId string
const isUserOnline = (
  userId: string | undefined | null,
  onlineUsers: any[] | undefined | null,
): boolean => {
  // Early returns for invalid cases
  if (!userId || !onlineUsers || !Array.isArray(onlineUsers)) return false;

  return onlineUsers.some(onlineUser => {
    return onlineUser?.userId?.toString() === userId;
  });
};

export default Message;

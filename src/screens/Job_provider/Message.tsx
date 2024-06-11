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

  useEffect(() => {
    socket.emit('getOnlineUsers', {message: 'get online users'});

    // Event listener for 'getU' event
    socket.on('getU', (data: any) => {
      setOnlineUsers(data);
    });
    // Clean up the event listener when component unmounts
    return () => {
      socket.off('getU');
    };
  }, [socket]);

  const getConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await (
        MessageStore.getState() as any
      ).getAllConversation();
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
                keyExtractor={(item:any) => item._id.toString()}
                contentContainerStyle={{
                  padding: responsiveHeight(1),
                }}
                renderItem={({item}) => (
                  <MemoizedConversationItem
                    item={item}
                    onlineUsers={onlineUsers}
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
                <MemoizedConversation data={item} onlineUsers={onlineUsers} />
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

const MemoizedConversationItem = memo(({item, onlineUsers}: any) => (
  <View
    style={{
      alignItems: 'center',
      marginRight: responsiveWidth(4),
    }}>
    <FastImage
      source={{uri: item?.conversation[0].profilePic?.url}}
      style={{
        width: responsiveHeight(9),
        height: responsiveHeight(9),
        borderRadius: 100,
      }}
    />
    {isUserOnline(item, onlineUsers) ? (
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 12,
          width: responsiveHeight(2.5),
          height: responsiveHeight(2.5),
          borderRadius: 100,
          backgroundColor: 'green',
          borderWidth: 2,
          borderColor: 'white',
        }}
      />
    ) : (
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 12,
          width: responsiveHeight(2.5),
          height: responsiveHeight(2.5),
          borderRadius: 100,
          backgroundColor: 'red',
          borderWidth: 2,
          borderColor: 'white',
        }}
      />
    )}
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
));

const isUserOnline = (item: any, onlineUsers: any) => {
  return onlineUsers?.find(
    (u: any) => u?.userId === item?.conversation[0]?._id,
  );
};

export default Message;

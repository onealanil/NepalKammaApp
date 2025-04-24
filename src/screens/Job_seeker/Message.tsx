import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import React, {useCallback} from 'react';
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
import {BottomStackParamsList} from '../../navigation/ButtonNavigatorSeeker';
import {MessageStore} from './helper/MessageStore';
import {useIsFocused} from '@react-navigation/native';
import {useGlobalStore} from '../../global/store';
import {useSocket} from '../../contexts/SocketContext';
import ConversationLoader from '../GlobalComponents/Loader/ConversationLoader';
import {ErrorToast} from '../../components/ErrorToast';
import {useMessageStore} from '../../global/MessageCount';

interface MessageProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
}

const Message = ({navigation}: MessageProps) => {
  const isFocused = useIsFocused();
  const socket = useSocket();
  const user = useGlobalStore((state: any) => state.user);
  const [conversations, setConversations] = React.useState([] as any);
  const [onlineUsers, setOnlineUsers] = React.useState([] as any);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);


  console.log(socket);

  // In your frontend component
  React.useEffect(() => {
    const fetchOnlineUsers = () => {
      socket?.emit('getOnlineUsers');
    };

    const onlineUsersListener = (data: any) => {
      setOnlineUsers(data);
    };

    fetchOnlineUsers();
    socket?.on('getOnlineUsers', onlineUsersListener);

    return () => {
      socket?.off('getOnlineUsers', onlineUsersListener);
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

  React.useEffect(() => {
    if (isFocused) {
      getConversations();
      console.log('getConversations');
    }
    console.log('useEffect');
  }, [isFocused, getConversations]);

  const readAllMessages = async (conversation_id: string) => {
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
  };

  const clickedConversationHandler = (conversationId: string) => {
    navigation.navigate('Actual_Message', {
      conversation_id: conversationId,
    });
    readAllMessages(conversationId);
  };

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
          <TouchableOpacity onPress={() => navigation.navigate('Home_bottom')}>
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
              <FlatList
                horizontal={true}
                data={conversations?.slice(0, 10)}
                keyExtractor={item => item._id.toString()}
                contentContainerStyle={{
                  padding: responsiveHeight(1),
                }}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        alignItems: 'center',
                        marginRight: responsiveWidth(4),
                      }}>
                      <Image
                        source={{uri: item?.conversation[0].profilePic?.url}}
                        style={{
                          width: responsiveHeight(9),
                          height: responsiveHeight(9),
                          borderRadius: 100,
                        }}
                      />
                      {onlineUsers?.find(
                        (u: any) => u?.userId === item?.conversation[0]?._id,
                      ) ? (
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
                  );
                }}
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
        <FlatList
          keyExtractor={item => item._id.toString()}
          initialNumToRender={10}
          data={conversations?.slice(0, 10)}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                paddingBottom:
                  item.length < 2 ? responsiveHeight(15) : responsiveHeight(1),
              }}
              onPress={() => clickedConversationHandler(item._id.toString())}>
              <Conversation data={item} />
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
  );
};

export default Message;

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import IonIcons from 'react-native-vector-icons/Ionicons';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const MessageLoader = ({otherUser, navigation, phoneHandler}: any) => {
  const renderMessageSkeleton = (isMyMessage: any) => (
    <View
      style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}>
      <View style={styles.messageContent}>
        <ShimmerPlaceHolder style={styles.shimmerAvatar} />
        <View style={styles.messageTextContainer}>
          <ShimmerPlaceHolder style={styles.shimmerText} />
          <ShimmerPlaceHolder style={styles.shimmerText} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Message')}>
          <IonIcons name="chevron-back-sharp" size={30} color="gray" />
        </TouchableOpacity>
        <View style={styles.profile}>
          {otherUser?.profilePic?.url && (
            <Image
              source={{uri: otherUser?.profilePic?.url}}
              style={styles.profileImage}
            />
          )}
          <ShimmerPlaceHolder style={styles.shimmerProfileName} />
        </View>
        <TouchableOpacity onPress={phoneHandler}>
          <IonIcons name="call" size={30} color="#79AC78" />
        </TouchableOpacity>
      </View>
      {renderMessageSkeleton(false)}
      {renderMessageSkeleton(true)}
      {renderMessageSkeleton(false)}
      {renderMessageSkeleton(false)}
      {renderMessageSkeleton(true)}
      {renderMessageSkeleton(true)}
      {renderMessageSkeleton(true)}
      {renderMessageSkeleton(false)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsiveHeight(2),
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    marginRight: responsiveHeight(1),
  },
  shimmerProfileName: {
    width: responsiveHeight(10),
    height: responsiveHeight(2),
    borderRadius: 20,
  },
  messageContainer: {
    marginVertical: responsiveHeight(1),
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shimmerAvatar: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    marginRight: responsiveHeight(1),
  },
  messageTextContainer: {
    flexDirection: 'column',
    backgroundColor: '#f0f5f8',
    borderRadius: 20,
    padding: 10,
    maxWidth: '80%',
  },
  shimmerText: {
    width: '100%',
    height: responsiveHeight(2),
    borderRadius: 20,
    marginBottom: responsiveHeight(0.5),
  },
});

export default MessageLoader;

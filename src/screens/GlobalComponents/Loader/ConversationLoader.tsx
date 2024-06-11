import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FlatList} from 'react-native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Conversation = () => {
  return (
    <View style={styles.conversationContainer}>
      <ShimmerPlaceholder style={styles.profilePicPlaceholder} />
      <View style={styles.detailsContainer}>
        <View style={styles.nameContainer}>
          <ShimmerPlaceholder style={styles.namePlaceholder} />
          <ShimmerPlaceholder style={styles.timePlaceholder} />
        </View>
        <ShimmerPlaceholder style={styles.messagePlaceholder} />
      </View>
    </View>
  );
};

const ConversationLoader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ShimmerPlaceholder style={styles.backButtonPlaceholder} />
        <View style={styles.userInfoContainer}>
          <ShimmerPlaceholder style={styles.userNamePlaceholder} />
          <ShimmerPlaceholder style={styles.iconPlaceholder} />
        </View>
        <ShimmerPlaceholder style={styles.iconPlaceholder} />
      </View>

      <View style={styles.storiesContainer}>
        <FlatList
          horizontal
          data={Array.from({length: 10}, (_, index) => index)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.storiesContentContainer}
          renderItem={() => (
            <View style={styles.storyContainer}>
              <ShimmerPlaceholder style={styles.storyProfilePicPlaceholder} />
              <ShimmerPlaceholder style={styles.storyIndicatorPlaceholder} />
              <ShimmerPlaceholder style={styles.storyNamePlaceholder} />
            </View>
          )}
        />
      </View>

      <View style={styles.messagesContainer}>
        <ShimmerPlaceholder style={styles.messagesTitlePlaceholder} />
        <FlatList
          data={Array.from({length: 10}, (_, index) => index)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.conversationsContentContainer}
          renderItem={() => <Conversation />}
          ListEmptyComponent={() => (
            <View style={styles.noConversationsContainer}>
              <ShimmerPlaceholder style={styles.noConversationsPlaceholder} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: responsiveHeight(2),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  backButtonPlaceholder: {
    width: responsiveHeight(3.5),
    height: responsiveHeight(3.5),
    borderRadius: responsiveHeight(1.75),
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveHeight(1),
  },
  userNamePlaceholder: {
    width: responsiveHeight(6),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
  iconPlaceholder: {
    width: responsiveHeight(3),
    height: responsiveHeight(3),
    borderRadius: responsiveHeight(1.5),
  },
  storiesContainer: {
    marginBottom: responsiveHeight(2),
  },
  storiesContentContainer: {
    paddingVertical: responsiveHeight(1),
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: responsiveWidth(4),
  },
  storyProfilePicPlaceholder: {
    width: responsiveHeight(9),
    height: responsiveHeight(9),
    borderRadius: responsiveHeight(4.5),
  },
  storyIndicatorPlaceholder: {
    position: 'absolute',
    right: 0,
    bottom: responsiveHeight(1.5),
    width: responsiveHeight(2.5),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
    borderWidth: 2,
    borderColor: 'white',
  },
  storyNamePlaceholder: {
    marginTop: responsiveHeight(1),
    width: responsiveHeight(6),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  messagesContainer: {
    flex: 1,
  },
  messagesTitlePlaceholder: {
    width: responsiveHeight(6),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
    marginBottom: responsiveHeight(2),
  },
  conversationsContentContainer: {
    paddingBottom: responsiveHeight(65),
    paddingTop: responsiveHeight(2),
  },
  conversationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: responsiveHeight(2),
    paddingVertical: responsiveHeight(2),
    borderBottomWidth: 1.5,
    borderBottomColor: '#e5e8e9',
    gap: responsiveHeight(5),
  },
  profilePicPlaceholder: {
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(4),
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: responsiveHeight(1),
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  namePlaceholder: {
    width: responsiveHeight(10),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
  timePlaceholder: {
    width: responsiveHeight(6),
    height: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
  },
  messagePlaceholder: {
    width: responsiveHeight(20),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
  noConversationsContainer: {
    paddingBottom: responsiveHeight(25),
  },
  noConversationsPlaceholder: {
    width: responsiveHeight(10),
    height: responsiveHeight(2.5),
    borderRadius: responsiveHeight(1.25),
  },
});

export default ConversationLoader;

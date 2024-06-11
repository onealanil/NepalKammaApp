import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';

// Sample data
const notifications = [
  {
    id: '1',
    title: 'Recommendation for you:',
    message:
      'Urgent Requirement for React Developer at Bangalore. Apply Now!. Click here to apply now!',
    image: 'https://randomuser.me/api/portraits/men/83.jpg',
  },

  {
    id: '2',
    title: 'Near by jobs for you:',
    message: 'Urgent Requirement for React Developer at Bangalore. Apply Now!',
    image: 'https://randomuser.me/api/portraits/men/84.jpg',
  },
  {
    id: '3',
    title: 'Recommendation for you:',
    message:
      'Urgent Requirement for React Developer at Bangalore. Apply Now!. Click here to apply now!',
    image: 'https://randomuser.me/api/portraits/men/85.jpg',
  },
  {
    id: '4',
    title: 'Near by jobs for you:',
    message: 'Urgent Requirement for React Developer at Bangalore. Apply Now!',
    image: 'https://randomuser.me/api/portraits/women/83.jpg',
  },
  {
    id: '5',
    title: 'Recommendation for you:',
    message:
      'Urgent Requirement for React Developer at Bangalore. Apply Now!. Click here to apply now!',
    image: 'https://randomuser.me/api/portraits/women/84.jpg',
  },
];

const Notifications = () => {
  return (
    <View className="bg-white">
      <View
        className="w-[100%] flex flex-col"
        style={{padding: responsiveHeight(2)}}>
        {/* back button */}
        <View className="mb-2 flex flex-row items-center gap-x-8">
          <TouchableOpacity>
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
        <View style={{padding: responsiveHeight(1)}}>
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
        <View>
          <FlatList
            horizontal={false}
            data={notifications?.slice(0, 10)}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{
              padding: responsiveHeight(1),
              paddingBottom: responsiveHeight(50),
            }}
            renderItem={({item}) => {
              return (
                <React.Fragment>
                  <View
                    className="flex flex-row gap-x-2 mb-2"
                    style={{padding: responsiveHeight(1)}}>
                    {/* photos */}
                    <View style={{width: '20%'}}>
                      <Image
                        source={{
                          uri: item.image,
                        }}
                        style={{
                          height: responsiveHeight(8),
                          width: responsiveHeight(8),
                          borderRadius: 100,
                        }}
                      />
                    </View>
                    {/* Message */}
                    <View style={{width: '70%'}}>
                      <Text
                        numberOfLines={1}
                        className="text-black"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveHeight(1.5),
                        }}>
                        {item?.title}
                      </Text>
                      <Text
                        numberOfLines={3}
                        className="text-black"
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          fontSize: responsiveHeight(1.5),
                        }}>
                        {item?.message}
                      </Text>
                    </View>
                    {/* time */}
                    <View>
                      <Text className="text-black">1h</Text>
                    </View>
                  </View>
                </React.Fragment>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Notifications;

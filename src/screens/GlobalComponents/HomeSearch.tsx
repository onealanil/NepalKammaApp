import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const HomeSearch = ({text, user}: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <IonIcons name="search" color="gray" size={25} />
        </View>
        {user?.role === 'job_seeker' ? (
          <View style={styles.input}>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveFontSize(2),
              }}>
              Search for job...
            </Text>
          </View>
        ) : (
          <View style={styles.input}>
            <Text
              className="text-gray-500"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveFontSize(2),
              }}>
              {text && text === 'Home'
                ? 'Search Gigs ...'
                : 'Search Freelancers ...'}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.button}>
        <View>
          <View style={styles.iconContainer}>
            <IonIcons name="options-outline" color="black" size={25} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 5,
  },
  iconContainer: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 3,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Montserrat-SemiBold',
  },
  button: {
    padding: 5,
    marginLeft: 1,
  },
});

export default React.memo(HomeSearch);

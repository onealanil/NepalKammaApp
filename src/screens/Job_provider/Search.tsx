import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TopNav from '../GlobalComponents/TopNav';
import Search from '../GlobalComponents/Search';
import {userStateProps} from './Home';
import {useGlobalStore} from '../../global/store';
import PeopleCard from '../GlobalComponents/PeopleCard';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {ErrorToast} from '../../components/ErrorToast';
import {UserStore} from './helper/UserStore';
import PeopleLoader from '../GlobalComponents/Loader/PeopleLoader';
import useLocationStore, {LocationState} from '../../global/useLocationStore';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {FlashList} from '@shopify/flash-list';

interface peopleProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
  route: RouteProp<BottomStackParamsList, 'Peoples'>;
}

const People = ({navigation, route}: peopleProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const location: LocationState = useLocationStore(
    (state: any) => state.location,
  );

  const isFocused = useIsFocused();

  const [isSeller, setIsSeller] = React.useState<boolean>(true);
  const [jobSeekers, setJobSeekers] = React.useState<any>([]);
  const [nearByJobSeekers, setSetNearByJobSeekers] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [searchText, setSearchText] = React.useState<string>('');

  const getAllJobSeekers = useCallback(async (searchWord: string) => {
    try {
      const response = await (UserStore.getState() as any).getJobSeekers(
        searchWord,
      );
      setJobSeekers(response);
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, []);

  const getNearByJobSeekers = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await (
          UserStore.getState() as any
        ).getNearByJobSeekers(latitude, longitude);
        setSetNearByJobSeekers(response);
        setIsLoading(false);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (isFocused && location) {
      getAllJobSeekers(searchText);
      getNearByJobSeekers(location.latitude, location.longitude);
    }
  }, [isFocused, location]);

  const navigateToProfile = useCallback((id: string) => {
    navigation.navigate('Other_Profile', {
      id: id,
    });
  }, []);

  const handleOkFunction = useCallback(() => {
    getAllJobSeekers(searchText);
  }, [searchText, getAllJobSeekers]);

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingTop: responsiveHeight(11.25),
      }}>
      <View className="w-[95%]" style={{padding: responsiveHeight(2)}}>
        <TopNav props={navigation} user={user} />
        <View style={{marginTop: responsiveHeight(3)}}>
          <Search
            text={'freelancers'}
            setSearchText={setSearchText}
            handleOkFunction={handleOkFunction}
          />
        </View>
        {/* text start */}
        <View className="flex flex-row items-center justify-between">
          <View
            className={`w-[50%] py-3 ${
              isSeller && 'border-b-2 border-color2'
            }  `}>
            <TouchableOpacity onPress={() => setIsSeller(true)}>
              <Text
                className={isSeller ? 'text-color2' : 'text-gray-500'}
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2),
                }}>
                Most Popular
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className={`w-[50%] items-center justify-center flex py-3 ${
              !isSeller && 'border-b-2 border-color2'
            }  `}>
            <TouchableOpacity onPress={() => setIsSeller(false)}>
              <Text
                className={isSeller ? 'text-gray-500' : 'text-color2'}
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2),
                }}>
                Near by Sellers
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* text end  */}
        {/* seller card start */}
        {isLoading && (
          <View
            style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
            }}>
            <FlashList
              data={[1, 1, 1, 1, 1]}
              estimatedItemSize={5}
              renderItem={({item, index}) => <PeopleLoader />}
            />
          </View>
        )}
        {!isLoading && isSeller && (
          <View
            style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
            }}>
            <FlashList
              keyExtractor={(item: any) => item._id.toString()}
              estimatedItemSize={5}
              data={jobSeekers?.users}
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                  onPress={() => navigateToProfile(item?._id)}>
                  <PeopleCard
                    data={item}
                    navigation={navigation}
                    route={route}
                  />
                </TouchableWithoutFeedback>
              )}
              ListEmptyComponent={() => (
                // Render this component when there's no data
                <View style={{paddingBottom: responsiveHeight(25)}}>
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.75),
                    }}>
                    No Job Seekers Found
                  </Text>
                </View>
              )}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(60),
                paddingTop: responsiveHeight(2),
              }}
            />
          </View>
        )}
        {!isLoading && !isSeller && (
          <View
            style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
            }}>
            <FlashList
              keyExtractor={(item: any) => item._id.toString()}
              estimatedItemSize={5}
              data={nearByJobSeekers?.nearBy}
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                  onPress={() => navigateToProfile(item?._id)}>
                  <PeopleCard
                    data={item}
                    navigation={navigation}
                    route={route}
                  />
                </TouchableWithoutFeedback>
              )}
              ListEmptyComponent={() => (
                // Render this component when there's no data
                <View style={{paddingBottom: responsiveHeight(25)}}>
                  <Text
                    className="text-red-500"
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.75),
                    }}>
                    No near by Job Seekers Found
                  </Text>
                </View>
              )}
              contentContainerStyle={{
                paddingBottom: responsiveHeight(80),
                paddingTop: responsiveHeight(2),
              }}></FlashList>
          </View>
        )}

        {/* seller card end */}
      </View>
    </View>
  );
};

export default People;

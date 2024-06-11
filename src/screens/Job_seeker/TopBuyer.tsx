import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import GeoLocation from '../GlobalComponents/GeoLocation';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerStackParamsListSeeker} from '../../navigation/DrawerStackSeeker';
import {BottomStackParamsList} from '../../navigation/ButtonNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import {UserStore} from './helper/UserStore';
import {ErrorToast} from '../../components/ErrorToast';
import {FlashList} from '@shopify/flash-list';
import PeopleLoader from '../GlobalComponents/Loader/PeopleLoader';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import PeopleCard from '../GlobalComponents/PeopleCard';

interface topBuyerProps {
  navigation: DrawerNavigationProp<DrawerStackParamsListSeeker>;
  bottomNavigation: BottomTabNavigationProp<BottomStackParamsList>;
}

const TopBuyer = ({navigation, bottomNavigation }: topBuyerProps) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [jobProviders, setJobProviders] = React.useState<any>([]);

  const getTopProvider = useCallback(async () => {
    try {
      const response = await (UserStore.getState() as any).getTopJobProvider();
      setJobProviders(response);
      setIsLoading(false);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      getTopProvider();
    }
  }, [isFocused]);

  return (
    <React.Fragment>
      <View
        className="w-[100%] flex flex-col bg-white"
        style={{padding: responsiveHeight(2)}}>
        {/* back button */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View className="mb-2 flex flex-row items-center gap-x-2">
            <IconIcons name="chevron-back-sharp" size={30} color="gray" />
            <Text
              className="font-bold"
              style={{
                fontSize: responsiveFontSize(2),
                color: '#333',
                fontFamily: 'Montserrat-Bold',
              }}>
              Top Buyers
            </Text>
          </View>
        </TouchableOpacity>
        {/* body starts */}
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
        {!isLoading && (
          <View
            style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
            }}>
            <FlashList
              keyExtractor={(item: any) => item._id.toString()}
              estimatedItemSize={5}
              data={jobProviders}
              renderItem={({item}) => (
                <TouchableWithoutFeedback
                
                onPress={()=>{
                  bottomNavigation.navigate('Other_Profile', {
                    id: item._id,
                  });
                }}
                >
                  <PeopleCard
                    data={item}
                    // navigation={navigation}
                    // route={route}
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
      </View>
    </React.Fragment>
  );
};

export default TopBuyer;

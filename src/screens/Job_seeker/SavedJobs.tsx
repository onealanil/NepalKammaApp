import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IconIcons from 'react-native-vector-icons/Ionicons';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerStackParamsListSeeker} from '../../navigation/DrawerStackSeeker';
import {UserStore} from './helper/UserStore';
import {ErrorToast} from '../../components/ErrorToast';
import {useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import CardLoader from '../GlobalComponents/Loader/CardLoader';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Cards from '../GlobalComponents/Cards';
import {userStateProps} from './Home';
import {useGlobalStore} from '../../global/store';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottonSheetCardSeeker from './BottonSheetCardSeeker';
import {BottomStackParamsList} from '../../navigation/ButtonNavigatorSeeker';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

interface savedJobsProps {
  navigation: DrawerNavigationProp<DrawerStackParamsListSeeker>;
  bottomNavigation: BottomTabNavigationProp<BottomStackParamsList>;
}

const SavedJobs = ({navigation, bottomNavigation}: savedJobsProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);

  const isFocused = useIsFocused();
  const [jobDetails, setJobDetails] = React.useState<any>([]);
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const getJobDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await (UserStore.getState() as any).getSavejob();
      setJobDetails(response);
    } catch (error: any) {
      ErrorToast(error.toString().replace('[Error: ', '').replace(']', ''));
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      getJobDetails();
    }
  }, [isFocused]);

  const setSelectedItemHandler = useCallback((item: any) => {
    setSelectedData(item);
    handlePresentModalPress();
  }, []);

  return (
    <BottomSheetModalProvider>
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
                Saved Jobs List
              </Text>
            </View>
          </TouchableOpacity>
          {/* body starts */}
          <View>
            {/* Best Matches  */}
            {isLoading && (
              <View
                style={{
                  height: responsiveHeight(100),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  data={[1, 1, 1, 1, 1]}
                  estimatedItemSize={100}
                  renderItem={({item, index}) => <CardLoader />}
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
                  keyExtractor={(item: any) => item._id?.toString() || ''}
                  data={jobDetails?.savedPosts}
                  estimatedItemSize={120}
                  renderItem={({item}) => (
                    <TouchableWithoutFeedback
                      onPress={() => setSelectedItemHandler(item)}>
                      <Cards data={item} user={user} />
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
                        No Saved jobs available
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: responsiveHeight(50),
                    paddingTop: responsiveHeight(1),
                  }}
                  ListFooterComponent={
                    <View style={{height: 50, backgroundColor: 'white'}} />
                  }
                  showsVerticalScrollIndicator={false}></FlashList>
              </View>
            )}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                shadowColor: '#000000',
                shadowOffset: {
                  width: 0,
                  height: 20,
                },
                shadowOpacity: 0.8,
                shadowRadius: 24,
                elevation: 30,
                flex: 1,
                overflow: 'scroll',
              }}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}>
              <BottonSheetCardSeeker
                bottomSheetModalRef={bottomSheetModalRef}
                data={selectedData}
                navigation={bottomNavigation}
                fromSavedJob={'from_saved_job'}
                getJobDetails={getJobDetails}
              />
            </BottomSheetModal>
          </View>
        </View>
      </React.Fragment>
    </BottomSheetModalProvider>
  );
};

export default SavedJobs;

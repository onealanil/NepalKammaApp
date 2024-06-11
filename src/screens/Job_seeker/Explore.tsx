import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TopNav from '../GlobalComponents/TopNav';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomStackParamsList} from '../../navigation/ButtonNavigatorSeeker';
import {RouteProp} from '@react-navigation/native';
import {userStateProps} from './Home';
import {useGlobalStore} from '../../global/store';
import Search from '../GlobalComponents/Search';
import Cards from '../GlobalComponents/Cards';
import {FetchJobStore} from './helper/FetchJobStore';
import {initialJobData, JobData} from './Home';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import BottonSheetCardSeeker from './BottonSheetCardSeeker';
import CardLoader from '../GlobalComponents/Loader/CardLoader';
import {Picker} from '@react-native-picker/picker';
import {categoryFilter} from '../GlobalComponents/SkillsData';
import {ErrorToast} from '../../components/ErrorToast';
import useLocationStore, {LocationState} from '../../global/useLocationStore';
import {FlashList} from '@shopify/flash-list';

interface peopleProps {
  navigation: BottomTabNavigationProp<BottomStackParamsList>;
  route: RouteProp<BottomStackParamsList, 'explore'>;
}

const Explore = ({navigation, route}: peopleProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const location: LocationState = useLocationStore(
    (state: any) => state.location,
  );
  const [jobDetails, setJobDetails] = React.useState<JobData>(initialJobData);
  const [selectedData, setSelectedData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [totalJobs, setTotalJobs] = React.useState<number>(0);
  const [isFetchingMore, setIsFetchingMore] = React.useState<boolean>(false);

  //distance
  const [selectedDistance, setSelectedDistance] = React.useState(0);

  //low to high
  const [lowToHigh, setLowToHigh] = React.useState<boolean>(false);
  //high to low
  const [highToLow, setHighToLow] = React.useState<boolean>(false);
  //sort by rating
  const [sortByRating, setSortByRating] = React.useState<boolean>(false);
  // category
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  //search text
  const [searchText, setSearchText] = React.useState<string>('');

  const [isModalVisible, setModalVisible] = React.useState<boolean>(false);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
  }, []);

  const fetchJob = React.useCallback(
    async (
      searchText: string,
      selectedCategory: string,
      selectedDistance: any,
      lowToHigh: boolean,
      highToLow: boolean,
      sortByRating: boolean,
      page: number,
      limit: number,
      lat: number,
      long: number,
    ) => {
      try {
        const response = await (FetchJobStore.getState() as any).searchJob(
          searchText,
          selectedCategory,
          selectedDistance,
          lowToHigh,
          highToLow,
          sortByRating,
          page,
          limit,
          lat,
          long,
        );

        // Update total jobs and pages
        setTotalJobs(response?.totalJobs || 0);
        if (response.totalPages !== undefined) {
          setTotalPages(response.totalPages);
        }
        setCurrentPage(response.currentPage);

        // Merge new jobs with existing jobs
        setJobDetails(prevJobDetails => ({
          ...prevJobDetails,
          job: [...prevJobDetails.job, ...response.job],
        }));
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [setJobDetails, setTotalJobs, setTotalPages, setCurrentPage, ErrorToast],
  );

  const handleEndReached = React.useCallback(() => {
    if (!isFetchingMore && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setIsFetchingMore(true);
      fetchJob(
        searchText,
        selectedCategory,
        selectedDistance,
        lowToHigh,
        highToLow,
        sortByRating,
        nextPage,
        5,
        location.latitude,
        location.longitude,
      )
        .then(() => setIsFetchingMore(false))
        .catch(error => {
          console.error('Error fetching more data:', error);
          setIsFetchingMore(false);
        });
    }
  }, [
    isFetchingMore,
    currentPage,
    totalPages,
    searchText,
    selectedCategory,
    selectedDistance,
    lowToHigh,
    highToLow,
    sortByRating,
    location.latitude,
    location.longitude,
    fetchJob,
    setIsFetchingMore,
  ]);

  const handleReachEnd = React.useCallback(
    ({layoutMeasurement, contentOffset, contentSize}: any) => {
      const paddingToBottom = 25;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    },
    [],
  );

  const handleScroll = React.useCallback(
    (event: any) => {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      if (handleReachEnd({layoutMeasurement, contentOffset, contentSize})) {
        if (currentPage < totalPages) {
          handleEndReached();
        }
      }
    },
    [handleReachEnd, currentPage, totalPages, handleEndReached],
  );

  const searchJob = React.useCallback(
    async (
      searchText: string,
      selectedCategory: string,
      selectedDistance: any,
      lowToHigh: boolean,
      highTolow: boolean,
      sortByRating: boolean,
      page: number,
      limit: number,
      lat: number,
      long: number,
    ) => {
      try {
        const response = await (FetchJobStore.getState() as any).searchJob(
          searchText,
          selectedCategory,
          selectedDistance,
          lowToHigh,
          highTolow,
          sortByRating,
          page,
          limit,
          lat,
          long,
        );
        setJobDetails({
          job: [],
          nearBy: [],
        });
        setTotalJobs(response?.totalJobs);
        setJobDetails(prevJob => ({
          ...prevJob,
          job: [...response.job],
        }));

        if (response.totalPages !== undefined) {
          setTotalPages(response.totalPages);
        }
        if (response.currentPage !== undefined) {
          setCurrentPage(response.currentPage);
        }
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoading(false);
    },
    [setJobDetails, setTotalJobs, setTotalPages, setCurrentPage, ErrorToast],
  );
  const handleOkFunction = React.useCallback(() => {
    setModalVisible(false);
    setIsLoading(true);
    setTotalJobs(0);

    searchJob(
      searchText,
      selectedCategory,
      selectedDistance,
      lowToHigh,
      highToLow,
      sortByRating,
      1,
      5,
      location.latitude,
      location.longitude,
    );
  }, [
    setModalVisible,
    setIsLoading,
    setTotalJobs,
    searchText,
    selectedCategory,
    selectedDistance,
    lowToHigh,
    highToLow,
    sortByRating,
    location.latitude,
    location.longitude,
    searchJob,
  ]);

  const resetSearch = React.useCallback(() => {
    setModalVisible(false);
    setIsLoading(true);
    setTotalJobs(0);
    setSelectedCategory('');
    setSearchText('');
    setSelectedDistance(0);
    setLowToHigh(false);
    setHighToLow(false);
    setSortByRating(false);
    searchJob(
      '',
      '',
      '',
      false,
      false,
      false,
      1,
      5,
      location.latitude,
      location.longitude,
    );
  }, [
    setModalVisible,
    setIsLoading,
    setTotalJobs,
    setSelectedCategory,
    setSearchText,
    setSelectedDistance,
    setLowToHigh,
    setHighToLow,
    setSortByRating,
    location.latitude,
    location.longitude,
    searchJob,
  ]);

  React.useEffect(() => {
    setIsLoading(true);
    setTotalJobs(0);
    searchJob(
      searchText,
      selectedCategory,
      selectedDistance,
      lowToHigh,
      highToLow,
      sortByRating,
      1,
      5,
      location.latitude,
      location.longitude,
    );
  }, [selectedCategory, searchJob]);

  // useEffect(() => {
  //   searchJob(
  //     searchText,
  //     selectedCategory,
  //     selectedDistance,
  //     lowToHigh,
  //     highToLow,
  //     sortByRating,
  //     1,
  //     5,
  //     location.latitude,
  //     location.longitude,
  //   );
  //   console.log("hitted 2...")
  // }, []);

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          paddingTop: responsiveHeight(19.25),
        }}>
        <View
          className="w-[95%]"
          style={{
            padding: responsiveHeight(2),
            marginTop: responsiveHeight(1.5),
          }}>
          <TopNav props={navigation} user={user} />
          <View style={{marginTop: responsiveHeight(3)}}>
            <Search
              text={'people'}
              user={user}
              setSelectedDistance={setSelectedDistance}
              setHighToLow={setHighToLow}
              setLowToHigh={setLowToHigh}
              setSortByRating={setSortByRating}
              handleOkFunction={handleOkFunction}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              selectedDistance={selectedDistance}
              setSearchText={setSearchText}
              resetSearch={resetSearch}
            />
          </View>
          {/* Category */}
          <View className="gap-y-2 mt-2">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(1.5),
              }}>
              Category
            </Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={itemValue => setSelectedCategory(itemValue)}
              style={{
                height: 40,
                backgroundColor: '#effff8',
                borderRadius: 20,
                color: 'black',
                marginBottom: responsiveHeight(4),
                fontFamily: 'Montserrat-SemiBold',
              }}
              dropdownIconColor="black"
              dropdownIconRippleColor="black">
              {categoryFilter.map(item => (
                <Picker.Item
                  key={item.id}
                  label={item.name}
                  value={item.name}
                  style={{fontFamily: 'Montserrat-SemiBold'}}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View className="w-[95%] flex flex-row justify-between pb-2">
          <View className="w-[50%] flex flex-row pb-2">
            <Text
              className="text-black ml-3 mr-1"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(1.5),
              }}>
              Explore
            </Text>
            <Text
              className="text-color2"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(1.5),
              }}>
              Jobs
            </Text>
            <Text
              className="text-black ml-3 mr-1"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(1.5),
              }}>
              {`( ${totalJobs} )`}
            </Text>
          </View>
          <View style={{marginRight: responsiveWidth(2)}}>
            <Text
              className="text-red-500 ml-3 mr-1"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveHeight(1.5),
              }}>
              {selectedCategory}
            </Text>
          </View>
        </View>
        <View className="w-[90%]">
          {isLoading ? (
            <>
              <View
                style={{
                  height: responsiveHeight(112),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  data={[1, 1, 1, 1, 1]}
                  estimatedItemSize={100}
                  renderItem={({item, index}) => <CardLoader />}
                />
              </View>
            </>
          ) : (
            <View
              style={{
                height: responsiveHeight(112),
                width: responsiveWidth(90),
              }}>
              <FlashList
                keyExtractor={(item, index) =>
                  item._id ? item._id.toString() : index.toString()
                }
                onScroll={handleScroll}
                estimatedItemSize={100}
                data={jobDetails?.job}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setSelectedData(item);
                      handlePresentModalPress();
                    }}>
                    <Cards data={item} user={user} />
                  </TouchableWithoutFeedback>
                )}
                contentContainerStyle={{paddingBottom: responsiveHeight(70)}}
                showsVerticalScrollIndicator={false}
                // onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                  // Render this component when there's no data
                  <View style={{paddingBottom: responsiveHeight(30)}}>
                    <Text
                      className="text-red-500"
                      style={{
                        fontFamily: 'Montserrat-Bold',
                        fontSize: responsiveFontSize(1.75),
                      }}>
                      No jobs available
                    </Text>
                  </View>
                )}
                // ListHeaderComponent={() =>
                //   isFetchingPrevious ? (
                //     <View style={{alignItems: 'center', paddingVertical: 10}}>
                //       <Text
                //         className="text-black"
                //         style={{
                //           fontFamily: 'Montserrat-SemiBold',
                //           fontSize: responsiveHeight(2),
                //         }}>
                //         Loading...
                //       </Text>
                //     </View>
                //   ) : null
                // }
                ListFooterComponent={() =>
                  isFetchingMore ? (
                    <View style={[styles.container, styles.horizontal]}>
                      <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                  ) : null
                }></FlashList>
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
            {/* <View className="flex flex-1 items-center rounded-t-2xl"> */}
            <BottonSheetCardSeeker
              bottomSheetModalRef={bottomSheetModalRef}
              data={selectedData}
              navigation={navigation}
            />
            {/* </View> */}
          </BottomSheetModal>
          <View className="bg-color2 ">
            <Text className="text-black">Load More</Text>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default Explore;

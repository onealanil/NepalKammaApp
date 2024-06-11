import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerStackParamsList } from '../../navigation/DrawerStack';
import IconIcons from 'react-native-vector-icons/Ionicons';
import Review from '../GlobalComponents/Review';
import { userStateProps } from './Home';
import { useGlobalStore } from '../../global/store';
import { ReviewStore } from '../Job_seeker/helper/ReviewStore';
import { ErrorToast } from '../../components/ErrorToast';
import { FlashList } from '@shopify/flash-list';

interface MyReviewProps {
  navigation: DrawerNavigationProp<DrawerStackParamsList>;
}

const MyReview = ({ navigation }: MyReviewProps) => {
  const user: userStateProps = useGlobalStore((state: any) => state.user);
  const [reviewData, setReviewData] = React.useState<any>([]);
  const [averageRating, setAverageRating] = React.useState<any>(0);
  const [totalRating, setTotalRating] = React.useState<any>(0);
  const [isLoadingReview, setIsLoadingReview] = React.useState<boolean>(true);

  const fetchAverageRating = useCallback(
    async (id: string) => {
      try {
        const response = await (ReviewStore.getState() as any).getAverageRating(
          id,
        );
        setAverageRating(response);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoadingReview(false);
    },
    [setAverageRating],
  );

  const fetchReview = useCallback(
    async (id: string) => {
      try {
        const response = await (ReviewStore.getState() as any).getReview(id);
        setReviewData(response);
        setTotalRating(response?.length);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    },
    [setReviewData, setTotalRating],
  );

  const memoizedUserId = useMemo(() => user?._id, []);

  React.useEffect(() => {
    setIsLoadingReview(true);
    if (memoizedUserId) {
      fetchReview(memoizedUserId);
      fetchAverageRating(memoizedUserId);
    }
  }, [memoizedUserId, fetchReview, fetchAverageRating]);

  return (
    <React.Fragment>
      <View
        className="w-[100%] flex flex-col bg-white"
        style={{ padding: responsiveHeight(2) }}>
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
              My Reviews
            </Text>
          </View>
        </TouchableOpacity>
        {
          isLoadingReview && (
            <View style={{
              height: responsiveHeight(100),
              width: responsiveWidth(90),
            }}>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          )
        }

        {
          !isLoadingReview && (

            <View className="flex flex-col gap-y-4">
              <View>
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(1.5),
                  }}>
                  Total Review:{' '}
                  <Text
                    className="text-color2"
                    style={{
                      fontSize: responsiveFontSize(2),
                    }}>
                    {totalRating || 0}
                  </Text>
                </Text>
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(1.5),
                  }}>
                  Average Rating:{' '}
                  <Text
                    className="text-color2"
                    style={{
                      fontSize: responsiveFontSize(2),
                    }}>
                    {(averageRating && averageRating?.toFixed(1)) || 0} out of 5
                  </Text>
                </Text>
              </View>
              <View
                style={{
                  height: responsiveHeight(100),
                  width: responsiveWidth(90),
                }}>
                <FlashList
                  keyExtractor={(item: any) => item._id?.toString() || ''}
                  estimatedItemSize={50}
                  data={reviewData}
                  renderItem={({ item }) => <Review data={item} />}
                  ListEmptyComponent={() => (
                    // Render this component when there's no data
                    <View style={{ paddingBottom: responsiveHeight(25) }}>
                      <Text
                        className="text-red-500"
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(1.75),
                        }}>
                        No review found
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={{
                    paddingBottom: responsiveHeight(50),
                    paddingTop: responsiveHeight(1),
                  }}
                  ListFooterComponent={
                    <View style={{ height: 50, backgroundColor: 'white' }} />
                  }></FlashList>
              </View>
            </View>
          )
        }


      </View>
    </React.Fragment >
  );
};

export default MyReview;

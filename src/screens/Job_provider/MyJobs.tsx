import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import IconIcons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerStackParamsList} from '../../navigation/DrawerStack';
import {useGlobalStore} from '../../global/store';
import {useIsFocused} from '@react-navigation/native';
import {UserStore} from '../Job_seeker/helper/UserStore';
import {ErrorToast} from '../../components/ErrorToast';
import Cards from '../GlobalComponents/Cards';
import CardLoader from '../GlobalComponents/Loader/CardLoader';
import {FlashList} from '@shopify/flash-list';

interface MyJobsProps {
  navigation: DrawerNavigationProp<DrawerStackParamsList>;
}

const MyJobs = ({navigation}: MyJobsProps) => {
  const {user, checkAuth} = useGlobalStore();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [jobs, setJobs] = React.useState<any>([]);
  const [my_data, setMy_data] = React.useState<any>(null);

  const getSingleUser = React.useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const response = await (UserStore.getState() as any).getSingleUserProvider(id);
        setJobs(response?.userJobs);
        setMy_data(response?.user);
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
      setIsLoading(false);
    },
    [setJobs, setMy_data],
  );

  const memoizedIsFocused = React.useMemo(() => isFocused, [isFocused]);

  React.useEffect(() => {
    if (memoizedIsFocused) {
      getSingleUser(user?._id);
    }
  }, [memoizedIsFocused, getSingleUser, user?._id]);

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
              My Jobs
            </Text>
          </View>
        </TouchableOpacity>
        {/* body starts */}
        <View>
          <Text
            className="text-black"
            style={{
              marginLeft: responsiveWidth(3.5),
              paddingVertical: responsiveHeight(1),
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            Total jobs ({jobs?.length})
          </Text>
          {isLoading && (
            <View
              style={{
                height: responsiveHeight(100),
                width: responsiveWidth(90),
              }}>
              <FlashList
                data={[1, 1, 1, 1, 1]}
                estimatedItemSize={5}
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
                keyExtractor={(item: any) => item._id.toString()}
                estimatedItemSize={100}
                data={[...jobs].reverse()}
                renderItem={({item}) => (
                  <Cards
                    data={item}
                    user={user}
                    useCase={'myProfile'}
                    getSingleUser={getSingleUser}
                    getButton={'getButton'}
                  />
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
                      You Don't post any job yet!!
                    </Text>
                  </View>
                )}
                contentContainerStyle={{
                  paddingBottom: responsiveHeight(50),
                  paddingTop: responsiveHeight(2),
                }}
                showsVerticalScrollIndicator={false}></FlashList>
            </View>
          )}
        </View>
        {/* body end  */}
      </View>
    </React.Fragment>
  );
};

export default React.memo(MyJobs);

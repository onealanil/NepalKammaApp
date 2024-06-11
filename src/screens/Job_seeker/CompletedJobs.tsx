import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import IconIcons from 'react-native-vector-icons/Ionicons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/native';
import {ErrorToast} from '../../components/ErrorToast';
import {KhaltiStore} from '../GlobalComponents/helper/KhaltiStore';
import {DrawerStackParamsListSeeker} from '../../navigation/DrawerStackSeeker';
import CompletedJobSeeker from '../GlobalComponents/CompletedJobSeeker';
import CompletedJobLoader from '../GlobalComponents/Loader/CompletedJobLoader';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import PaymentSlip from '../GlobalComponents/PaymentSlip';

interface MyJobsProps {
  navigation: DrawerNavigationProp<DrawerStackParamsListSeeker>;
}

const CompletedJobs = ({navigation}: MyJobsProps) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [jobs, setJobs] = React.useState<any>([]);
  const [singlePaymentData, setSinglePaymentData] = React.useState<any>({});

  const getCompletedJob = async () => {
    setIsLoading(true);
    try {
      const response = await (KhaltiStore.getState() as any).getPaymentByUser();
      setJobs(response);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (isFocused) {
      getCompletedJob();
    }
  }, [isFocused]);

  // ref
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = React.useMemo(() => ['50%', '95%'], []);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = React.useCallback((index: number) => {
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
                Completed Jobs List
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
              <FlatList
                data={[1, 1, 1, 1, 1]}
                renderItem={({item, index}) => <CompletedJobLoader />}
              />
            )}
            {!isLoading && (
              <FlatList
                keyExtractor={item => item._id.toString()}
                initialNumToRender={5}
                data={jobs}
                renderItem={({item}) => (
                  <>
                    <CompletedJobSeeker
                      data={item}
                      handlePresentModalPress={handlePresentModalPress}
                      setSinglePaymentData={setSinglePaymentData}
                    />
                  </>
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
                      Job's not completed yet!!
                    </Text>
                  </View>
                )}
                contentContainerStyle={{
                  paddingBottom: responsiveHeight(50),
                  paddingTop: responsiveHeight(2),
                }}
                showsVerticalScrollIndicator={false}></FlatList>
            )}
          </View>
          {/* body end  */}
        </View>
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
          <PaymentSlip
            bottomSheetModalRef={bottomSheetModalRef}
            getCompletedJob={getCompletedJob}
            data={singlePaymentData}
          />
        </BottomSheetModal>
      </React.Fragment>
    </BottomSheetModalProvider>
  );
};

export default CompletedJobs;

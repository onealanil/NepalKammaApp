import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback} from 'react';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Picker} from '@react-native-picker/picker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import openMap from 'react-native-open-maps';
import useLocationStore from '../global/useLocationStore';
import {ErrorToast} from './ErrorToast';
import {TextInput} from 'react-native-gesture-handler';
import {ReportStore} from '../screens/GlobalComponents/helper/ReportStore';
import {SuccessToast} from './SuccessToast';

const MoreModalBox = ({
  isModalVisible,
  setIsModalVisible,
  address,
  reportedBy,
  reportedTo,
}: any) => {
  const location = useLocationStore((state: any) => state.location);
  const [selectedStatus, setSelectedStatus] =
    React.useState<string>('report this user');
  const [reportText, setReportText] = React.useState<string>('');
  const [isReporting, setIsReporting] = React.useState<boolean>(false);


  const status = [
    {id: 1, name: 'report this user'},
    {id: 2, name: 'view on map'},
  ];

  const _goToYosemite = useCallback(() => {
    if (reportedBy?.isDocumentVerified !== 'verified') {
      console.log(reportedBy)
      ErrorToast('Please verify your document first');
      return;
    }
    if (
      location.latitude === 0 &&
      location.longitude === 0 &&
      !address.coordinates
    ) {
      ErrorToast('Please enable location services to view the map');
    } else {
      openMap({
        start: `${location.latitude}, ${location.longitude}`,
        end: `${address.coordinates[1]}, ${address.coordinates[0]}`,
        travelType: 'drive',
      });
    }
  }, [selectedStatus]);

  const ReportUserHandler = useCallback(async () => {
    if (reportedBy?.isDocumentVerified !== 'verified') {
      ErrorToast('Please verify your document first');
      return;
    }
    if (reportText === '') {
      ErrorToast("Report text can't be empty");
      return;
    }
    setIsReporting(true);
    try {
      const response = await (ReportStore.getState() as any).createReport(
        reportedBy?._id,
        reportedTo,
        reportText,
      );
      if (response) {
        SuccessToast('Reported Successfully');
        setIsModalVisible(false);
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsReporting(false);
  }, [reportText]);

  return (
    <Modal isVisible={isModalVisible}>
      <View style={{flex: 1}} className="flex items-center justify-center">
        <View
          style={{width: responsiveWidth(85)}}
          className="bg-white rounded-lg py-8">
          <View className="w-[100%] flex items-end justify-end px-4">
            <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false);
              }}>
              <Entypo name="circle-with-cross" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col items-center justify-center">
            <FontAwesome6 name="user-ninja" size={60} color="#79AC78" />
            <Text
              className="text-color2 mb-3"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(1.5),
              }}>
              What do you want to do?
            </Text>
            <View
              style={{
                height: 40,
                backgroundColor: '#effff8',
                borderRadius: 20,
                marginBottom: responsiveHeight(4),
                width: '90%',
              }}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={itemValue => setSelectedStatus(itemValue)}
                dropdownIconColor="black"
                dropdownIconRippleColor="white"
                mode="dropdown"
                style={{width: '90%'}}>
                {status.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.name}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#79AC78',
                    }}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {selectedStatus === 'report this user' && (
            <View className="flex w-[100%] flex-col ml-4">
              <Text
                className="text-color2"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(1.5),
                  marginBottom: responsiveHeight(1),
                }}>
                Write your report here:
              </Text>
              <TextInput
                style={{
                  height: 40,
                  width: '90%',
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginBottom: responsiveHeight(4),
                  padding: 10,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                  fontSize: responsiveFontSize(1.5),
                }}
                placeholder="Enter your report here..."
                placeholderTextColor={'gray'}
                multiline={true}
                numberOfLines={4}
                onChangeText={text => setReportText(text)}
                value={reportText}
              />
            </View>
          )}

          {/* button start  */}
          <View className="w-[100%] justify-start items-center mb-4">
            {selectedStatus &&
              selectedStatus !== '' &&
              selectedStatus === 'view on map' && (
                <TouchableOpacity onPress={() => _goToYosemite()}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '50%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      View on Map
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            {selectedStatus &&
              selectedStatus !== '' &&
              selectedStatus === 'report this user' && (
                <TouchableOpacity onPress={ReportUserHandler}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '70%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      {isReporting ? 'Reporting...' : 'Post a Report'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
          </View>

          {/* bottom end  */}
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(MoreModalBox);

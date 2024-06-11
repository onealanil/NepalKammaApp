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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import openMap from 'react-native-open-maps';
import useLocationStore from '../../global/useLocationStore';
import {ErrorToast} from '../../components/ErrorToast';
import {useGlobalStore} from '../../global/store';

const MapModal = ({isModalVisible, setIsModalVisible, address}: any) => {
  const Mydata: any = useGlobalStore((state: any) => state.user);
  const location = useLocationStore((state: any) => state.location);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('walk');

  const status = [
    {id: 1, name: 'drive'},
    {id: 2, name: 'walk'},
    {id: 3, name: 'public_transport'},
  ];

  const _goToYosemite = useCallback(() => {
    if (Mydata?.isDocumentVerified !== 'verified') {
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
        travelType: selectedStatus as 'drive' | 'walk' | 'public_transport',
      });
    }
  }, [selectedStatus]);

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
            <MaterialCommunityIcons
              name="horse-human"
              size={60}
              color="#79AC78"
            />
            <Text
              className="text-color2 mb-3"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(1.5),
              }}>
              How would you like to get to that location?
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
          <View className="w-[100%] justify-start items-center mb-4">
            {selectedStatus && selectedStatus !== '' && (
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
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(MapModal);

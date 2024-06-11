import {View, Text, Button} from 'react-native';
import React from 'react';
import openMap from 'react-native-open-maps';

const TopSeller = () => {
  function _goToYosemite() {
    openMap({
      start: '26.6679, 87.3649', // Your starting latitude and longitude
      end: '27.7000, 85.3333', // Your destination latitude and longitude
      travelType: 'drive', // or 'walk' or 'public_transport'
    });
  }
  return (
    <View>
      <Button
        color={'#bdc3c7'}
        onPress={_goToYosemite}
        title="Click To Open Maps 🗺"
      />
    </View>
  );
};

export default TopSeller;

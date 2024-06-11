import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ErrorToast } from '../../components/ErrorToast';

interface Place {
  geometry: {
    coordinates: number[];
    type: string;
  };
  properties: {
    city: string;
    country: string;
  };
  type: string;
}

const GeoLocation = ({ setGeometry, setLocationName }: any) => {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [inputValue, setInputValue] = useState('');

  const fetchSuggestions = async (value: string) => {
    if (!value) return;

    // Your Geoapify API key
    const apiKey = '0aa09cb2c0fd4384851d76a77b1225bb';
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      `${value},Nepal`,
    )}&limit=5&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        ErrorToast('Network response was not ok');
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      setSuggestions(data.features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    fetchSuggestions(value);
  };

  const handleSuggestionPress = (place: Place) => {
    setInputValue(place.properties.city);
    setGeometry(place.geometry);
    setLocationName(place.properties.city);
  };

  return (
    <View>
      <TextInput
        className="bg-[#effff8] rounded-md text-black px-2"
        style={{ fontFamily: 'Montserrat-SemiBold' }}
        placeholder="Enter Location"
        placeholderTextColor="#bdbebf"
        onChangeText={handleInputChange}
        value={inputValue} // Bind input value to state
      />
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          className="bg-[#effff8] rounded-md text-black px-2 p-2 mt-2"
          key={index}
          onPress={() => handleSuggestionPress(suggestion)}>
          <View className="flex flex-row items-center gap-x-2">
            <IonIcons name="location" size={20} color="green" />
            <Text className="text-color2">
              {suggestion.properties.city},{suggestion.properties.country}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default GeoLocation;

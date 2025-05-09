/**
 * @file ModalBoxFilter.tsx
 * @description This file contains the ModalBoxFilter component, which is used to display a modal for filtering job listings based on distance and sorting options.
 */

import {View, Text, TouchableOpacity} from 'react-native';
import React, {useCallback, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import DistanceOption from './DistanceOption';
import {useGlobalStore} from '../global/store';
import Entypo from 'react-native-vector-icons/Entypo';

/**
 *
 * @param modalMessage - The message to be displayed in the modal.
 * @param isModalVisible - A boolean indicating whether the modal is visible or not.
 * @param handleOkFunction - A function to be called when the OK button is pressed.
 * @param resetSearch - A function to reset the search filters.
 * @param setSelectedDistance - A function to set the selected distance.
 * @param setLowToHigh - A function to set the low to high sorting option.
 * @param setHighToLow - A function to set the high to low sorting option.
 * @param setSortByRating - A function to set the sort by rating option.
 * @param selectedDistance - The currently selected distance.
 * @param setModalVisible - A function to set the modal visibility.
 * @description ModalBoxFilter component is used to display a modal for filtering job listings based on distance and sorting options.
 * @component
 * @returns {JSX.Element} - Returns a modal component with filtering options.
 */
const ModalBoxFilter = ({
  modalMessage,
  isModalVisible,
  handleOkFunction,
  resetSearch,
  setSelectedDistance,
  setLowToHigh,
  setHighToLow,
  setSortByRating,
  selectedDistance,
  setModalVisible,
}: any) => {
  const user = useGlobalStore(state => state.user);
  const [modalVisibles, setModalVisibles] = useState<boolean>(false);
  const [lowToHigh, setLowToHighState] = useState<boolean>(false);
  const [highToLow, setHighToLowState] = useState<boolean>(false);
  const [sortByRating, setSortByRatingState] = useState<boolean>(false);

  /**
   * @function handleLowToHighPress
   * @description Handles the press event for the "Low to High" button. Sets the state for low to high sorting and resets other sorting states.
   * @returns {void}
   */
  const handleLowToHighPress = useCallback(() => {
    setLowToHighState(true);
    setHighToLowState(false);
    setSortByRatingState(false);
    setLowToHigh(true);
    setHighToLow(false);
    setSortByRating(false);
  }, []);

  /**
   * @function handleHighToLowPress
   * @description Handles the press event for the "High to Low" button. Sets the state for high to low sorting and resets other sorting states.
   * @returns {void}
   */
  const handleHighToLowPress = useCallback(() => {
    setLowToHighState(false);
    setHighToLowState(true);
    setSortByRatingState(false);
    setLowToHigh(false);
    setHighToLow(true);
    setSortByRating(false);
  }, []);

  /**
   * @function handleSortByRatingPress
   * @description Handles the press event for the "Sort by Rating" button. Sets the state for sorting by rating and resets other sorting states.
   * @returns {void}
   */
  const handleSortByRatingPress = useCallback(() => {
    setLowToHighState(false);
    setHighToLowState(false);
    setSortByRatingState(true);
    setLowToHigh(false);
    setHighToLow(false);
    setSortByRating(true);
  }, []);

  /**
   * @function handleOkFunction
   * @description Handles the press event for the OK button. Calls the provided handleOkFunction and sets the modal visibility to false.
   * * @returns {void}
   */
  const handleResetFunction = useCallback(() => {
    setLowToHighState(false);
    setHighToLowState(false);
    setSortByRatingState(false);
    setLowToHigh(false);
    setHighToLow(false);
    setSortByRating(false);
    resetSearch();
  }, []);

  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1}} className="flex items-center justify-center">
          <View
            style={{
              width: responsiveWidth(85),
            }}
            className="bg-white rounded-lg items-center justify-between py-8">
            <View className="w-[100%] flex items-end justify-end px-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Entypo name="circle-with-cross" size={30} color="red" />
              </TouchableOpacity>
            </View>
            <View className="flex items-center gap-y-3 justify-center">
              <Text
                className="text-color2"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2.5),
                }}>
                {modalMessage ? modalMessage : ''}
              </Text>
              <View className=" w-[100%] flex flex-col items-center mb-2 justify-center">
                <TouchableOpacity onPress={handleLowToHighPress}>
                  <Text
                    className={`text-black py-3 border-y-2 border-black ${
                      lowToHigh ? 'text-color2' : ''
                    }`}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Low to high Price
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleHighToLowPress}>
                  <Text
                    className={`text-black py-3 border-b-2 border-black ${
                      highToLow ? 'text-color2' : ''
                    }`}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    High to Low Price
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSortByRatingPress}>
                  <Text
                    className={`text-black py-3 border-b-2 border-black ${
                      sortByRating ? 'text-color2' : ''
                    }`}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveFontSize(2),
                    }}>
                    Sort by Rating
                  </Text>
                </TouchableOpacity>
                {/* DistanceOption component */}
                {user && user.role === 'job_seeker' && (
                  <DistanceOption
                    setModalVisible={setModalVisibles}
                    modalVisible={modalVisibles}
                    setSelectedDistance={setSelectedDistance}
                    selectedDistance={selectedDistance}
                  />
                )}
              </View>
              {/* button */}
              <View className="w-[100%] justify-start items-center">
                <TouchableOpacity onPress={() => handleOkFunction()}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '25%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
                {/* reset button  */}
                <TouchableOpacity onPress={handleResetFunction}>
                  <View
                    className="bg-red-500 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '45%', marginTop: responsiveHeight(2)}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      Reset
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(ModalBoxFilter);

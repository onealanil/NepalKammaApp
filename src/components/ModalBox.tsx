/**
 * @file ModalBox.tsx
 * @description This file contains a modal component that displays a message and an OK button.
 *
 */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

/**
 *
 * @param modalMessage - The message to be displayed in the modal.
 * @param isModalVisible - A boolean that determines if the modal is visible or not.
 * @param handleOkFunction - A function to be called when the OK button is pressed.
 * @param responseMessage - A message to be displayed in the modal.
 * @description This component renders a modal with a message and an OK button.
 * @component 
 * @returns A modal component.
 */
const ModalBox = ({
  modalMessage,
  isModalVisible,
  handleOkFunction,
  responseMessage,
}: any) => {
  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1}} className="flex items-center justify-center">
          <View
            style={{
              width: responsiveWidth(85),
            }}
            className="bg-white rounded-lg items-center justify-between py-8">
            <View className="flex items-center gap-y-3 justify-center">
              <AntDesign name="checkcircle" size={60} color="#79AC78" />
              <Text
                className="text-color2"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2.5),
                }}>
                {modalMessage ? modalMessage : ''}
              </Text>
              <View className="flex items-center mb-2 justify-center">
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveFontSize(2),
                  }}>
                  {responseMessage ? responseMessage : ''}
                </Text>
              </View>
              {/* button  */}
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
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalBox;

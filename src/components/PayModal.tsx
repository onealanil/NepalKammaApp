/**
 * @file PayModal.tsx
 * @description This file contains the PayModal component which is used to handle the payment process for a job.
 */
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {KhaltiStore} from '../screens/GlobalComponents/helper/KhaltiStore';
import {SuccessToast} from './SuccessToast';
import {ErrorToast} from './ErrorToast';
import {JobStore} from '../screens/Job_provider/helper/JobStore';

/**
 *
 * @param setIsVisible - function to set the visibility of the modal
 * @param isModalVisible - boolean to check if the modal is visible
 * @param getCompletedJob - function to get the completed job
 * @param job_data - data of the job
 * @description PayModal component is used to handle the payment process for a job.
 * @returns PayModal component
 */
const PayModal = ({
  setIsVisible,
  isModalVisible,
  getCompletedJob,
  job_data,
}: any) => {
  const [amount, setAmount] = React.useState<number>(0);
  const [isPaying, setIsPaying] = React.useState<boolean>(false);

  /**
   * @function updateJobStatus
   * @param id - string - id of the job
   * @param job_status - string - status of the job
   * @param selectedUserId - string - id of the user
   * @description This function is used to update the job status.
   * @returns {Promise<void>} - Promise that resolves when the job status is updated
   * @throws {Error} - If there is an error while updating the job status
   */
  const updateJobStatus = async (
    id: string,
    job_status: string,
    selectedUserId: string,
  ) => {
    try {
      await (JobStore.getState() as any).EditJobStatus(
        id,
        job_status,
        selectedUserId ? selectedUserId : null,
      );
      getCompletedJob();
      SuccessToast('Job status updated successfully');
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

  /**
   *
   * @param paymentBy -string - id of the user who is making the payment
   * @param paymentTo - string - id of the user who is receiving the payment
   * @param job - string - id of the job
   * @param amount - number - amount to be paid
   * @param payment_type -string - type of payment (e.g. cash, card)
   * @description This function is used to create a payment.
   * @returns {Promise<void>} - Promise that resolves when the payment is created
   * @throws {Error} - If there is an error while creating the payment
   */
  const createPayment = async (
    paymentBy: string,
    paymentTo: string,
    job: string,
    amount: number,
    payment_type: string,
  ) => {
    try {
      await (KhaltiStore.getState() as any).createPayment(
        paymentBy,
        paymentTo,
        job,
        amount,
        payment_type,
      );
      SuccessToast('Payment created successfully');
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

  /**
   * @function offlinePaymentHandler
   * @description This function is used to handle the offline payment process.
   * @returns {Promise<void>} - Promise that resolves when the offline payment is handled
   * @throws {Error} - If there is an error while handling the offline payment
   */
  const offlinePaymentHandler = async () => {
    setIsPaying(true);
    try {
      await createPayment(
        job_data?.postedBy._id,
        job_data?.assignedTo._id,
        job_data?._id,
        amount,
        'cash',
      );
      await updateJobStatus(job_data?._id, 'Paid', job_data?.assignedTo._id);

      setIsVisible(false);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsPaying(false);
  };

  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View style={{flex: 1}} className="flex items-center justify-center">
          <View
            style={{width: responsiveWidth(85)}}
            className="bg-white rounded-lg py-8">
            <View className="w-[100%] flex items-end justify-end px-4">
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(false);
                }}>
                <Entypo name="circle-with-cross" size={30} color="red" />
              </TouchableOpacity>
            </View>
            {/* body starts  */}
            <View className="flex flex-col items-center justify-center">
              <MaterialIcons name="offline-bolt" size={60} color="#79AC78" />
              <Text
                className="text-color2 mb-3"
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(1.5),
                }}>
                How much is fixed with the job seeker?
              </Text>
              {/* input amount  */}
              <View className="flex w-[100%] flex-col ml-4">
                <Text
                  className="text-color2"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveFontSize(1.5),
                    marginBottom: responsiveHeight(1),
                  }}>
                  Write your amount here:
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
                  placeholder="Enter your amount here..."
                  placeholderTextColor={'gray'}
                  multiline={true}
                  keyboardType="numeric"
                  onChangeText={(text: string) => setAmount(Number(text))}
                  value={amount.toString()}
                />
              </View>
              {/* button start  */}
              <View className="w-[100%] justify-start items-center mb-4">
                <TouchableOpacity onPress={offlinePaymentHandler}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '50%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      {isPaying ? 'Paying....' : 'Pay'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* body end  */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PayModal;

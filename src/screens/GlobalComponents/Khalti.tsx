import axios from 'axios';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import {
  KhatiSdk,
} from 'rn-all-nepal-payment';
import {SuccessToast} from '../../components/SuccessToast';
import {JobStore} from '../Job_provider/helper/JobStore';
import {ErrorToast} from '../../components/ErrorToast';
import {KhaltiStore} from './helper/KhaltiStore';
import {BACKEND_URL} from '../../global/config';

type khalitProps = any;

const Khalti = ({isVisible, setIsVisible, job_data, getCompletedJob}: any) => {
  //update job status
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

  const _onPaymentComplete = async (data: khalitProps) => {
    const str = data.nativeEvent.data;
    const resp = JSON.parse(str);
    if (resp.event === 'CLOSED') {
      // handle closed action
    } else if (resp.event === 'SUCCESS') {
      const response = await axios.post(`${BACKEND_URL}/charge`, {
        token: resp.data.token,
        amount: resp.data.amount,
      });
      if (response.data.status === 'success') {
        createPayment(
          job_data?.postedBy._id,
          job_data?.assignedTo._id,
          job_data?._id,
          20,
          'online',
        );
        console.log(response.data);
        updateJobStatus(job_data?._id, 'Paid', job_data?.assignedTo._id);
        setIsVisible(false);
        SuccessToast('Payment Successful');
      }
    } else if (resp.event === 'ERROR') {
      ErrorToast('Payment Failed');
    }
  };

  return (
    <SafeAreaView>
      <KhatiSdk
        amount={10 * 100} // Number in paisa
        isVisible={isVisible}
        paymentPreference={[
          'KHALTI',
          'EBANKING',
          'MOBILE_BANKING',
          'CONNECT_IPS',
          'SCT',
        ]}
        productName={'Dragon'}
        productIdentity={'1234567890'}
        onPaymentComplete={_onPaymentComplete}
        productUrl={'http://gameofthrones.wikia.com/wiki/Dragons'}
        publicKey={'test_public_key_7158ad7a084447d2a0de7cc7ad2433c3'}
      />
    </SafeAreaView>
  );
};

export default React.memo(Khalti);

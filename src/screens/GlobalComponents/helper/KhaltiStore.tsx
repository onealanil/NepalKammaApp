import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const KhaltiStore = create(set => ({
  createPayment: async (
    PaymentBy: string,
    PaymentTo: string,
    job: string,
    amount: number,
    payment_type: string,
  ) => {
    try {
      const response = await axios_auth.post(`/payment/createPayment/`, {
        PaymentBy,
        PaymentTo,
        job,
        amount,
        payment_type,
      });
      if (response.status == 200) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
  getPaymentByUser: async () => {
    try {
      const response = await axios_auth.get(`/payment/getPaymentByProvider`);
      if (response.status == 200) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
  updateKhaltiNumber: async (id: string, recieverNumber: string) => {
    try {
      const response = await axios_auth.put(
        `/payment/updateKhalitNumber/${id}`,
        {
          recieverNumber,
        },
      );
      if (response.status == 200) {
        return response.data;
      }
      return [];
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
}));

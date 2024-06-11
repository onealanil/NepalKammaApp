import {create} from 'zustand';
import {axios_no_auth} from '../../../global/config';

export const LoginSignupStore = create(set => ({
  userDetails: [],
  signupUser: async (data: any) => {
    try {
      const response = await axios_no_auth.post('/user/signup', data);
      if (response.data.status === 'pending') {
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
  verifyUser: async (data: any) => {
    try {
      const response = await axios_no_auth.post('/user/verify', data);
      if (response.data.status === 'success') {
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
  resendOTP: async (data: any) => {
    try {
      const response = await axios_no_auth.post('/user/resend-otp', data);
      if (response.data.status === 'pending') {
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
  loginUser: async (data: any) => {
    try {
      const response = await axios_no_auth.post('/user/login', data);
      if (response.data.status === 'success') {
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
  forgotPassword: async (data: any) => {
    try {
      const response = await axios_no_auth.put('/user/forgetPassword', data);
      if (response.status === 200) {
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

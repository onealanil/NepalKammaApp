/**
 * @file LoginSignupStore.tsx
 * @description Zustand store for managing user login and signup state in a React application.
 * Handles user-related auth flows including signup, verification, OTP resending, login, and password recovery.
 *
 * @author Anil Bhandari
 *
 * ## Zustand Store: LoginSignupStore
 *
 * ### State:
 * - `userDetails` (Array): Stores user-related data (currently unused but can be used for caching).
 *
 * ### Actions (API Integration):
 *
 * 1. **signupUser(data: object): Promise<object | []>**
 *    - **API Endpoint:** `POST /user/signup`
 *    - **Purpose:** Registers a new user.
 *    - **Request Body:** `{ email, password, fullName, ... }`
 *    - **Success Response:** `{ status: 'pending', message: 'OTP sent', ... }`
 *    - **Failure:** Throws error with API message.
 *
 * 2. **verifyUser(data: object): Promise<object | []>**
 *    - **API Endpoint:** `POST /user/verify`
 *    - **Purpose:** Verifies a user's account using OTP.
 *    - **Request Body:** `{ email, otp }`
 *    - **Success Response:** `{ status: 'success', token, user, ... }`
 *    - **Failure:** Throws error with API message.
 *
 * 3. **resendOTP(data: object): Promise<object | []>**
 *    - **API Endpoint:** `POST /user/resend-otp`
 *    - **Purpose:** Resends OTP to user's email.
 *    - **Request Body:** `{ email }`
 *    - **Success Response:** `{ status: 'pending', message: 'OTP resent', ... }`
 *    - **Failure:** Throws error with API message.
 *
 * 4. **loginUser(data: object): Promise<object | []>**
 *    - **API Endpoint:** `POST /user/login`
 *    - **Purpose:** Authenticates user and returns token.
 *    - **Request Body:** `{ email, password }`
 *    - **Success Response:** `{ status: 'success', token, user, ... }`
 *    - **Failure:** Throws error with API message.
 *
 * 5. **forgotPassword(data: object): Promise<object | []>**
 *    - **API Endpoint:** `PUT /user/forgetPassword`
 *    - **Purpose:** Initiates password reset flow.
 *    - **Request Body:** `{ email }`
 *    - **Success Response:** `{ message: 'Reset link sent', ... }`
 *    - **Failure:** Throws error with API message.
 *
 * ### Dependencies:
 * - Uses `axios_no_auth` instance from `/global/config` for unauthenticated API requests.
 *
 * ### Usage:
 * ```tsx
 * const { signupUser, loginUser } = LoginSignupStore();
 * await signupUser({ email, password });
 * ```
 */

import {create} from 'zustand';
import {axios_no_auth} from '../../../global/config';

/**
 * @typedef {Object} LoginSignupStore
 * @property {Array} userDetails - Array to store user details.
 * @property {Function} signupUser - Function to handle user signup.
 * @property {Function} verifyUser - Function to verify user.
 * @property {Function} resendOTP - Function to resend OTP.
 * @property {Function} loginUser - Function to handle user login.
 * @property {Function} forgotPassword - Function to handle forgot password.
 *
 *
 */
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

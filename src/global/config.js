/**
 * @file config.js
 * @description This file contains the configuration for the API endpoints and axios instances used in the application.
 * @author Anil Bhandari
 */

import axios from 'axios';
import {getTokenKeyChain} from '../utils/asyncStorage';

//college testing ip -> IIC staff
export const API_URL = 'http://192.168.20.52:8000/api/v1';

// export const API_URL = 'http://192.168.1.18:8000/api/v1';

//college
export const BACKEND_URL = 'http://192.168.20.52:8000';
// export const BACKEND_URL = 'http://192.168.1.18:8000';

// Axios instance without authentication
export const axios_no_auth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance with authentication
export const axios_auth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for axios_auth
axios_auth.interceptors.request.use(
  async config => {
    // Retrieve the token from Keychain
    const token = await getTokenKeyChain();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

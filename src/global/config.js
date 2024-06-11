import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.18.206:8000/api/v1';

export const BACKEND_URL = 'http://192.168.18.206:8000';

export const axios_auth = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${AsyncStorage.getItem('currentUser')}`,
  },
});

// auth interceptors for axios
axios_auth.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('currentUser');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const axios_no_auth = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

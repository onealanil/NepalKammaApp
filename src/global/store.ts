/**
 * @file store.ts
 * @description This file contains the global store for the application using Zustand.
 * @author Anil Bhandari
 */

import { create } from 'zustand';
import { axios_auth } from './config';
import { GlobalStoreState } from '../types/interfaces/IGlobalStoreState';

/**
 * @description This is the global store for the application using Zustand.
 * @property {any} user - The user object.
 * @property {Function} checkAuth - Function to check if the user is authenticated.
 * @property {Function} setUser - Function to set the user object.
 * @returns {GlobalStoreState} - The global store state.
 * 
 */
export const useGlobalStore = create<GlobalStoreState>(set => ({
  user: null,
  checkAuth: async () => {
    try {
      const res = await axios_auth.get('auth/check-auth');
      if (res.data?.status === 'success') {
        set(() => ({ user: res?.data?.user }));
        return true;
      }
      return false;
    } catch (error) {
      set(() => ({ user: null }));
      return false;
    }
  },
  setUser: (user: any) => set(() => ({ user })),
}));

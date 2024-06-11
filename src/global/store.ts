import {create} from 'zustand';
import {axios_auth} from './config';

interface GlobalStoreState {
  user: any;
  checkAuth: () => Promise<boolean>;
  setUser: (user: any) => void;
}

export const useGlobalStore = create<GlobalStoreState>(set => ({
  user: null,
  checkAuth: async () => {
    try {
      const res = await axios_auth.get('auth/check-auth');
      if (res.data?.status === 'success') {
        set(() => ({user: res?.data?.user}));
        return true;
      }
      return false;
    } catch (error) {
      set(() => ({user: null}));
      return false;
    }
  },
  setUser: (user: any) => set(() => ({user})),
}));

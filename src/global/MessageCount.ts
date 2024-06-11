import {create} from 'zustand';
import {axios_auth} from './config';

interface MessageStoreState {
  messageCount: number;
  setMessageCount: (count: number) => void;
}

export const useMessageStore = create<MessageStoreState>(set => ({
  messageCount: 0,
  setMessageCount: count => set({messageCount: count}),
  unreadMessageCount: async () => {
    try {
      const response = await axios_auth.get('/message/unreadMessage');
      if (response.status === 200) {
        set({messageCount: response.data.result});
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
}));

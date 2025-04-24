/**
 * @file MessageCount.ts
 * @description This file contains the Zustand store for managing the message count in the application.
 * @author Anil Bhandari
 */

import { create } from 'zustand';
import { axios_auth } from './config';
import { MessageStoreState } from '../types/interfaces/IMessageStoreState';

/**
 * @description useMessageStore is a Zustand store that manages the message count in the application.
 * It provides a way to get and set the message count, and to fetch the unread message count from the server.
 * @returns {MessageStoreState} The message store state and actions.
 * @typedef {Object} MessageStoreState
 * @property {number} messageCount - The current message count.
 * @property {function} setMessageCount - A function to set the message count.
 * @property {function} unreadMessageCount - A function to fetch the unread message count from the server.
 * 
 */
export const useMessageStore = create<MessageStoreState>(set => ({
  messageCount: 0,
  setMessageCount: count => set({ messageCount: count }),
  unreadMessageCount: async () => {
    try {
      const response = await axios_auth.get('/message/unreadMessage');
      if (response.status === 200) {
        set({ messageCount: response.data.result });
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

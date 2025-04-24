/**
 * @file NotificationCount.ts
 * @description This file contains the Zustand store for managing notification count in the application.
 * @author Anil Bhandari
 */

import { create } from 'zustand';
import { axios_auth } from './config';
import { notficationState } from '../types/interfaces/INotificationState';

/**
 * @description This is the Zustand store for managing notification count in the application.
 * @property {number} notificationCount - The count of unread notifications.
 * @property {Function} setNotificationCount - Function to set the notification count.
 * @property {Function} unreadNotification - Function to fetch the unread notification count from the server.
 * @returns {notficationState} - The Zustand store state for notification count.
 */

export const useNotificationCount = create<notficationState>(set => ({
  notificationCount: 0,
  setNotificationCount: count => set({ notificationCount: count }),
  unreadNotification: async () => {
    try {
      const response = await axios_auth.get('/notification/unreadNotification');
      if (response.status === 200) {
        set({ notificationCount: response.data.result });
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

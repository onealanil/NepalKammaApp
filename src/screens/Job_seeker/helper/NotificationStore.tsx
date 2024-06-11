import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const NotificationStore = create(set => ({
  createReview: async (
    senderId: string,
    recipientId: string,
    jobId: string | null,
    gigId: string | null,
    notification: string,
    type: string,
  ) => {
    try {
      const response = await axios_auth.post(
        `/notification/createNotification`,
        {
          senderId,
          recipientId,
          jobId,
          gigId,
          notification,
          type,
        },
      );
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
  getNotificationById: async (id: string) => {
    try {
      const response = await axios_auth.get(
        `/notification/getNotificationByReceiver/${id}`,
      );
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
  readAllNotifications: async (id: string) => {
    //id --> conversation id
    try {
      const response = await axios_auth.put(`/notification/readAllNotifications`);
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
  }
}));

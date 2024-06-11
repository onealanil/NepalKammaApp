import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const MessageStore = create(set => ({
  createConversation: async (data: any) => {
    try {
      const response = await axios_auth.post(`/message/conversation`, data);
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
  getAllConversation: async () => {
    try {
      const response = await axios_auth.get(`/message/getConversation`);
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
  createMessage: async (data: any) => {
    try {
      const response = await axios_auth.post(`/message/createMessage`, data);
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
  getAllMessages: async (id: string) => {
    //id --> conversation id
    try {
      const response = await axios_auth.get(`/message/messagesCombo/${id}`);
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
  getLastMessage: async (id: string) => {
    //id --> conversation id
    try {
      const response = await axios_auth.get(`/message/lastMessages/${id}`);
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
  readAllMessage: async (id: string) => {
    //id --> conversation id
    try {
      const response = await axios_auth.put(`/message/readAllMessage/${id}`);
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

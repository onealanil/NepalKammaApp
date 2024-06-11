import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const UserStore = create(set => ({
  editProfile: async (id: string, data: any) => {
    try {
      const response = await axios_auth.put(`/user/edit-profile/${id}`, data);
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
  updatePhoneNumber: async (phone: any) => {
    try {
      const response = await axios_auth.put(`/user/update-phone`, {
        phone: phone,
      });
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
  getSingleUser: async (id: string) => {
    try {
      const response = await axios_auth.get(`/user/user/${id}`);
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
  getSingleUserProvider: async (id: string) => {
    try {
      const response = await axios_auth.get(`/user/user/provider/${id}`);
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

  saveJob: async (id: string) => {
    try {
      const response = await axios_auth.put(`/user/save-job/${id}`);
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
  unsaveJob: async (id: string) => {
    try {
      const response = await axios_auth.put(`/user/unsave-job/${id}`);
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

  getSavejob: async () => {
    try {
      const response = await axios_auth.get(`/user/saved-jobs`);
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
  getTopJobProvider: async () => {
    try {
      const response = await axios_auth.get(`/user/top-rated-job-provider`);
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
  logOut: async () => {
    try {
      await axios_auth.get(`/user/logout`);
      return true;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message);
      }
    }
  },
}));

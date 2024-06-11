import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const UserStore = create(set => ({
  users: [],
  getJobSeekers: async (text: string) => {
    try {
      const response = await axios_auth.get(`/user/job-seeker?search=${text}`);
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
  getNearByJobSeekers: async (latitude: number, longitude: number) => {
    try {
      const response = await axios_auth.get(
        `/user/getNearbyJobSeeker/${latitude}/${longitude}`,
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
  getTotaljobsJobProvider: async (jobProviderId: string) => {
    try {
      const response = await axios_auth.get(
        `/user/count-job-posted/${jobProviderId}`,
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
}));

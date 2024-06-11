import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const FetchJobStore = create(set => ({
  jobDetails: [],
  getJob: async (page: number, limit: number) => {
    try {
      const response = await axios_auth.get(`/job?page=${page}&limit=${limit}`);
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
  getNearbyJob: async (latitude: number, longitude: number) => {
    try {
      const response = await axios_auth.get(
        `/job/getNearbyJob/${latitude}/${longitude}`,
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
  getJobRecommendation: async () => {
    try {
      const response = await axios_auth.get(`/job/getRecommendedJob`);
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
  searchJob: async (
    searchText: string,
    category: string,
    selectedDistance: number | null,
    lowToHigh: boolean,
    highToLow: boolean,
    sortByRating: boolean,
    page: number,
    limit: number,
    lat: any | null,
    long: any | null,
  ) => {
    try {
      const response = await axios_auth.get(
        `/job/searchjob?text=${searchText}&category=${category}&sortByRating=${sortByRating}&sortByPriceHighToLow=${highToLow}&sortByPriceLowToHigh=${lowToHigh}&lng=${long}&lat=${lat}&distance=${selectedDistance}&page=${page}&limit=${limit}`,
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
  setJobDetails: (jobDetails: any) => set(() => ({jobDetails})),
}));

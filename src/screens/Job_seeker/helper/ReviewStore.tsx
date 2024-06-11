import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const ReviewStore = create(set => ({
  createReview: async (
    reviewedBy: string,
    reviewedTo: string,
    review: string,
    rating: number,
  ) => {
    try {
      const response = await axios_auth.post(`/review/createReview`, {
        reviewedBy,
        reviewedTo,
        review,
        rating,
      });
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

  getReview: async (id: string) => {
    try {
      const response = await axios_auth.get(
        `/review/getReviewByProvider/${id}`,
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
  getAverageRating: async (id: string) => {
    try {
      const response = await axios_auth.get(`/review/getAverageRating/${id}`);
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

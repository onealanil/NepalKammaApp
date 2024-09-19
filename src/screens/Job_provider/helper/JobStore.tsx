import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const JobStore = create(set => ({
  jobDetails: [],
  createJob: async (data: any) => {
    try {
      const response = await axios_auth.post('/job/createJob', data);
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
  deleteJob: async (id: string) => {
    try {
      const response = await axios_auth.delete(`/job/deleteJob/${id}`);
      if (response.status == 200) {
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
  EditJobStatus: async (id: string, job_status: string, assignedTo: string) => {
    try {                                              
      const response = await axios_auth.put(`/job/updateJobStatus/${id}`, {
        job_status,
        assignedTo,
      });
      if (response.status == 200) {
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
  GetCompletedJobs: async () => {
    try {
      const response = await axios_auth.get('/job/completedJobs');
      if (response.status == 200) {
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

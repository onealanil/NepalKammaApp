import {create} from 'zustand';
import {axios_auth} from '../../../global/config';

export const ReportStore = create(set => ({
  createReport: async (
    reportedBy: string,
    reportedTo: string,
    report: string,
  ) => {
    try {
      const response = await axios_auth.post(`/report/createReport/`, {
        reportedBy,
        reportedTo,
        report,
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
}));

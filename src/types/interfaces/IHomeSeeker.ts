import { DrawerNavigationProp } from '@react-navigation/drawer';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerStackParamsListSeeker } from "../../navigation/DrawerStackSeeker";
import { BottomStackParamsList } from "../../navigation/ButtonNavigatorSeeker";

export interface profileProps {
    navigation: DrawerNavigationProp<DrawerStackParamsListSeeker>;
    bottomNavigation: BottomTabNavigationProp<BottomStackParamsList>;
}

export interface JobDetails {
    _id: string;
    category: string;
    createdAt: string;
    job_description: string;
    location: string;
    payment_method: any[];
    phoneNumber: string;
    postedBy: any;
    price: number;
    skills_required: any[];
    title: string;
    updatedAt: string;
    latitude: number;
    longitude: number;
}

export interface JobData {
    job: JobDetails[];
    totalJobs?: number;
    totalPages?: number;
    currentPage?: number;
    nearBy: JobDetails[];
    recommendJobsList?: JobDetails[];
}

export interface getJobProps {
    getJob: (page: number, limit: number) => Promise<JobData>;
    getNearbyJob: (latitude: number, longitude: number) => Promise<JobData>;
    getJobRecommendation: () => Promise<JobData>;
}

export const initialJobData: JobData = {
    job: [],
    totalPages: 1,
    currentPage: 1,
    nearBy: [],
    recommendJobsList: [],
};

export interface myLocationProps {
    latitude: number;
    longitude: number;
}
/**
 * @file Cards.tsx
 * @description This file contains the Cards component which is used to display job cards in the application.
 * It includes the job title, description, location, and other details. It also includes functionality to update job status, delete job, and pay for the job.
 * It uses various libraries such as react-native-vector-icons, react-native-responsive-dimensions, and react-native-render-html.
 * It also uses the JobStore and ReviewStore for managing job and review data respectively.
 * It uses the Khalti component for payment processing and PayModal for offline payment processing.
 */

import {View, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import ModalBoxJob from '../../components/ModalBoxJob';
import {JobStore} from '../Job_provider/helper/JobStore';
import {ErrorToast} from '../../components/ErrorToast';
import {SuccessToast} from '../../components/SuccessToast';
import Khalti from './Khalti';
import {ReviewStore} from '../Job_seeker/helper/ReviewStore';
import FastImage from 'react-native-fast-image';
import PayModal from '../../components/PayModal';
export const systemFonts = [
  ...defaultSystemFonts,
  'Montserrat-Regular',
  'Montserrat-SemiBold',
  'Montserrat-Bold',
  'Montserrat-Medium',
];

/**
 * @function Cards
 * @param data - The data object containing job details.
 * @param user - The user object containing user details.
 * @param useCase - The use case for the component (e.g., 'myProfile').
 * @param getButton - The button type to be displayed (e.g., 'getPayment').
 * @param getSingleUser - Function to get single user details.
 * @param getCompletedJob - Function to get completed job details.
 * @description This component renders a card with job details and provides functionality to update job status, delete job, and pay for the job. * @returns JSX.Element - Renders the Cards component.
 */
const Cards = ({
  data,
  user,
  useCase,
  getButton,
  getSingleUser,
  getCompletedJob,
}: any) => {
  const {width} = useWindowDimensions();

  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] =
    React.useState<string>('In_Progress');
  const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
  const [paymentOpen, setPaymentOpen] = React.useState<boolean>(false);
  const [offlinePaymentOpen, setOfflinePaymentOpen] =
    React.useState<boolean>(false);
  const [isVisibleOffline, setIsVisibleOffline] =
    React.useState<boolean>(false);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [averageRating, setAverageRating] = React.useState<number>(0);
  const [isFetchAverageRating, setIsFetchAverageRating] =
    React.useState<boolean>(false);
  const [isPostSaved, setIsPostSaved] = React.useState<boolean>(false);
  const [isDeletedLoading, setIsDeletedLoading] =
    React.useState<boolean>(false);

  /**
   * @function generateHtmlPreview
   * @description Generates HTML preview of the job description based on the use case and user role.
   */
  const generateHtmlPreview = useCallback(() => {
    if (useCase === 'myProfile') {
      let html = `<p style="color: black;">${
        user && user?.role === 'job_seeker'
          ? data?.gig_description
          : data?.job_description
      }</p>`;
      html = html.replace(/\n/g, '<br/>');
      return html;
    } else {
      let html = `<p style="color: black;">${
        user && user?.role === 'job_seeker'
          ? data?.job_description
          : data?.gig_description
      }</p>`;
      html = html.replace(/\n/g, '<br/>');
      return html;
    }
  }, [useCase, user, data]);

  useEffect(() => {
    if (user && user?.savedPostJob.includes(data?._id)) {
      setIsPostSaved(true);
    }
  }, [user, data?._id]);

  /**
   * * @function updateJobStatus
   * * @description Updates the job status and fetches the single user details.
   * * @param {string} id - The job ID.
   * * @param {string} job_status - The new job status.
   * * @param {string} selectedUserId - The selected user ID.
   */
  const updateJobStatus = useCallback(
    async (id: string, job_status: string, selectedUserId: string) => {
      try {
        await (JobStore.getState() as any).EditJobStatus(
          id,
          job_status,
          selectedUserId ? selectedUserId : null,
        );
        getSingleUser(user?._id);
        SuccessToast('Job status updated successfully');
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    },
    [getSingleUser, user],
  );

  /**
   * * @function handleOkFunction
   * * @description Handles the OK button click in the modal and updates the job status.
   * * @returns {void}
   */
  const handleOkFunction = useCallback(() => {
    updateJobStatus(data?._id, selectedStatus, selectedUsers[0]?._id);
    setIsModalVisible(false);
  }, [updateJobStatus, data, selectedStatus, selectedUsers]);

  const fetchAverageRating = useCallback(async (id: string) => {
    setIsFetchAverageRating(true);
    try {
      const response = await (ReviewStore.getState() as any).getAverageRating(
        id,
      );
      setAverageRating(response);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsFetchAverageRating(false);
  }, []);

  /**
   * * @function renderStars
   * * @description Renders the star rating based on the average rating.
   * * @returns {JSX.Element[]}
   */
  const renderStars = useCallback(() => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starColor = i <= averageRating ? '#E2EA3B' : 'gray';
      stars.push(
        <View key={i} className="ml-1">
          <IonIcons name="star" size={15} color={starColor} />
        </View>,
      );
    }

    return stars;
  }, [averageRating]);

  useEffect(() => {
    if (data && data?.postedBy?._id) {
      fetchAverageRating(data?.postedBy?._id);
    }
  }, [data, fetchAverageRating]);

  /**
   * @function deleteJobHandler
   * @param jobId - The ID of the job to be deleted.
   * @description Deletes the job and fetches the single user details.
   * @returns {Promise<void>}
   */
  const deleteJobHandler = async (jobId: string) => {
    setIsDeletedLoading(true);
    try {
      const response = await (JobStore.getState() as any).deleteJob(jobId);
      getSingleUser(user?._id);
      SuccessToast(response.message);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsDeletedLoading(false);
  };

  return (
    <View className="p-4 shadow-2xl flex flex-col bg-white">
      <View className="flex flex-row gap-x-4">
        {/* image  */}
        <View>
          {data && data?.postedBy?.profilePic?.url && (
            <View className="relative">
              <FastImage
                source={{
                  uri:
                    typeof data.postedBy.profilePic.url === 'string'
                      ? data.postedBy.profilePic.url
                      : data.postedBy.profilePic,
                }}
                style={{height: 40, width: 40, borderRadius: 40}}
                className="relative"
              />
              <View
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border border-white ${
                  data?.postedBy?.onlineStatus ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </View>
          )}
        </View>
        {/* text  */}
        <View className="flex flex-col gap-y-1 w-[100%]">
          <Text
            className="text-black"
            numberOfLines={3}
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            {data?.title}
          </Text>

          <Text
            className="text-black ml-1"
            style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: responsiveFontSize(1.5),
            }}>
            {data?.postedBy?.username}
          </Text>
          {useCase === 'myProfile' ? (
            user && user?.role === 'job_seeker' ? (
              <View className="flex flex-row gap-x-2">
                <FontAwesome name="star" size={15} color="#E2EA3B" />
                <FontAwesome name="star" size={15} color="#E2EA3B" />
                <FontAwesome name="star" size={15} color="#E2EA3B" />
                <FontAwesome name="star" size={15} color="gray" />
                <FontAwesome name="star" size={15} color="gray" />
              </View>
            ) : (
              <View className="flex flex-row items-center gap-x-1 mt-2 w-[100%]">
                <View className="flex flex-row gap-x-1 w-[70%]">
                  <IonIcons name="location-outline" size={15} color="#79AC78" />
                  <Text
                    className="text-color2"
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: responsiveFontSize(1.5),
                    }}>
                    {data?.location}
                  </Text>
                </View>
              </View>
            )
          ) : user && user?.role === 'job_seeker' ? (
            <View className="flex flex-row items-center gap-x-1 mt-2 w-[100%]">
              <View className="flex flex-row gap-x-1 w-[70%]">
                <IonIcons name="location-outline" size={15} color="#79AC78" />
                <Text
                  className="text-color2"
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: responsiveFontSize(1.5),
                  }}>
                  {data?.location}
                </Text>
              </View>
              {isPostSaved ? (
                <MaterialCommunityIcons
                  className="w-[30%] mt-2"
                  name="content-save-all"
                  size={20}
                  color="#79AC78"
                />
              ) : (
                <MaterialCommunityIcons
                  className="w-[30%] mt-2"
                  name="content-save-all-outline"
                  size={20}
                  color="#79AC78"
                />
              )}
              {/* <IonIcons className="w-[30%]" name="heart-sharp" size={20} color="#79AC78" /> */}
            </View>
          ) : (
            <View className="flex flex-row gap-x-2">
              <View style={{flexDirection: 'row'}}>
                {isFetchAverageRating ? (
                  <Text className="text-color2">Loading...</Text>
                ) : (
                  renderStars()
                )}
              </View>
            </View>
          )}
        </View>
      </View>
      <View
        className=""
        style={{
          width: responsiveWidth(82.75),
          height:
            user?.role === 'job_provider'
              ? responsiveHeight(15.3)
              : responsiveHeight(21.85),
        }}>
        <RenderHtml
          contentWidth={width}
          source={{html: generateHtmlPreview()}}
          baseStyle={{
            color: 'black',
            fontFamily: 'Montserrat-Regular',
            fontSize: responsiveFontSize(1.5),
            lineHeight: 18.5,

            // height: responsiveHeight(21.85),
          }}
          // tagsStyles={{
          //   p: {color: 'red', fontFamily: 'Montserrat-Bold'},
          // }}
          systemFonts={systemFonts}
        />
      </View>
      {/* payment button  */}
      {getButton === 'getPayment' && user && user?.role === 'job_provider' && (
        <React.Fragment>
          {data && data?.assignedTo && (
            <View className="py-2 px-4 my-2 bg-color1 rounded-md flex flex-row items-center gap-x-1 w-[90%]">
              <MaterialIcons name="currency-bitcoin" size={17} color="white" />
              <Text
                className="text-white"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.5),
                }}>
                Pay to {data?.assignedTo?.username}
              </Text>
            </View>
          )}
          {/* pay online  */}
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
              setPaymentOpen(true);
            }}>
            <View className="py-2 px-4 bg-color2 rounded-md flex flex-row justify-center items-center gap-x-1">
              <MaterialIcons name="payment" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.5),
                  color: 'white',
                }}>
                Pay Online
              </Text>
            </View>
          </TouchableOpacity>

          {/* pay offline  */}
          <TouchableOpacity
            onPress={() => {
              setIsVisibleOffline(true);
              setOfflinePaymentOpen(true);
            }}>
            <View className="py-2 px-4 bg-color2 rounded-md flex flex-row justify-center items-center gap-x-1 mt-1">
              <MaterialIcons name="offline-bolt" size={17} color="white" />
              <Text
                className=""
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.5),
                  color: 'white',
                }}>
                Pay Offline
              </Text>
            </View>
          </TouchableOpacity>
        </React.Fragment>
      )}
      {/* use case my_profile  */}
      {getButton === 'getButton' && user && user?.role === 'job_provider' && (
        <React.Fragment>
          {data &&
            data?.assignedTo &&
            (data?.job_status === 'Completed' ||
              data?.job_status === 'In_Progress') && (
              <View className="py-2 px-4 my-2 bg-gray-100 rounded-md flex flex-row items-center gap-x-1 w-[90%]">
                <MaterialIcons name="assignment-add" size={17} color="black" />
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveHeight(1.5),
                  }}>
                  Assigned to {data?.assignedTo?.username}
                </Text>
              </View>
            )}

          {data && data?.visibility === 'private' && (
            <View className="py-2 px-4 my-2 bg-gray-100 rounded-md flex flex-row items-center gap-x-1 w-[90%]">
              <MaterialIcons name="lock" size={17} color="black" />
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveHeight(1.5),
                }}>
                Expired
              </Text>
            </View>
          )}
          <View className="flex flex-row justify-between gap-x-3 items-center w-[90%]">
            {data && data?.visibility === 'public' && (
              <TouchableOpacity>
                <View className="py-2 px-4 bg-color2 rounded-md flex flex-row items-center gap-x-1">
                  <FontAwesome name="edit" size={17} color="white" />
                  <Text
                    className=""
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveHeight(1.5),
                      color: 'white',
                    }}>
                    Edit
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* set job done */}
            {data && data?.job_status === 'In_Progress' && (
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <View className="py-2 px-3 bg-[#25258f] w-[120px] rounded-md flex flex-row items-center gap-x-1">
                  <FontAwesome6 name="bars-progress" size={17} color="white" />
                  <Text
                    className=""
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      fontSize: responsiveHeight(1.5),
                      color: 'white',
                    }}>
                    {data?.job_status}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {data &&
              data?.job_status === 'Completed' &&
              data?.visibility === 'public' && (
                <TouchableOpacity>
                  <View className="py-2 px-3 w-[120px] bg-[#589458] rounded-md flex flex-row items-center gap-x-1">
                    <MaterialIcons name="check" size={17} color="white" />
                    <Text
                      className=""
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveHeight(1.5),
                        color: 'white',
                      }}>
                      {data?.job_status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

            {/* paid  */}
            {data &&
              data?.job_status === 'Paid' &&
              data?.visibility === 'public' && (
                <TouchableOpacity>
                  <View className="py-2 px-3 w-[120px] bg-[#589458] rounded-md flex flex-row items-center gap-x-1">
                    <MaterialIcons name="paid" size={17} color="white" />
                    <Text
                      className=""
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveHeight(1.5),
                        color: 'white',
                      }}>
                      {data?.job_status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

            {data &&
              data?.job_status === 'Cancelled' &&
              data?.visibility === 'public' && (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <View className="py-2 px-3 w-[120px] bg-[#FF0000] rounded-md flex flex-row items-center gap-x-1">
                    <Entypo name="cross" size={17} color="white" />
                    <Text
                      className=""
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveHeight(1.5),
                        color: 'white',
                      }}>
                      {data?.job_status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            {data &&
              data?.job_status === 'Pending' &&
              data?.visibility === 'public' && (
                <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                  <View className="py-2 px-3 w-[120px] bg-yellow-600 rounded-md flex flex-row items-center gap-x-1">
                    <MaterialIcons
                      name="pending-actions"
                      size={17}
                      color="white"
                    />
                    <Text
                      className=""
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveHeight(1.5),
                        color: 'white',
                      }}>
                      {data?.job_status}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

            {/* delte  */}
            <TouchableOpacity onPress={() => deleteJobHandler(data?._id)}>
              <View className="py-2 px-4 bg-red-500 rounded-md flex flex-row items-center gap-x-1">
                <MaterialCommunityIcons name="delete" size={17} color="white" />
                {isDeletedLoading ? (
                  <ActivityIndicator size="small" color="#00ff00" />
                ) : (
                <Text
                  className=""
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveHeight(1.5),
                    color: 'white',
                  }}>
                  Delete
                </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )}
      {/* 9826399170 */}

      {paymentOpen && (
        <>
          <Khalti
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            job_data={data}
            getCompletedJob={getCompletedJob}
          />
        </>
      )}

      {offlinePaymentOpen && (
        <>
          <PayModal
            isModalVisible={isVisibleOffline}
            setIsVisible={setIsVisibleOffline}
            getCompletedJob={getCompletedJob}
            job_data={data}
          />
        </>
      )}

      <ModalBoxJob
        isModalVisible={isModalVisible}
        handleOkFunction={handleOkFunction}
        setSelectedStatus={setSelectedStatus}
        selectedStatus={selectedStatus}
        setIsModalVisible={setIsModalVisible}
        setSelectedUsers={setSelectedUsers}
        selectedUsers={selectedUsers}
      />
    </View>
  );
};

export default React.memo(Cards);

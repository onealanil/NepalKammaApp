import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {JobProvider, JobSeeker} from './SvgComponents';

const Who = ({setWho}: any) => {
  return (
    <>
      <View className="w-[100%] h-[100%] flex items-center justify-center">
        <View className="w-[90%]">
          <View className="w-full flex flex-row gap-x-3 items-center justify-center">
            <Text
              className="text-black"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(5),
              }}>
              I
            </Text>
            <Text
              className="text-color2"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(5),
              }}>
              AM
            </Text>
          </View>
          {/* main view  */}
          <View className="w-[100%] flex flex-row items-center justify-center  gap-y-10">
            {/* view for job seeker  */}
            <View className="w-[50%] flex items-center justify-center p-5 gap-y-2">
              <TouchableOpacity
                onPress={() => {
                  setWho('job_seeker');
                }}>
                <JobSeeker />
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveFontSize(2),
                  }}>
                  Job Seeker
                </Text>
              </TouchableOpacity>
            </View>
            {/* view for job provider  */}
            <View className="w-[50%] flex items-center justify-center p-5 gap-y-2">
              <TouchableOpacity
                onPress={() => {
                  setWho('job_provider');
                }}>
                <JobProvider />
                <Text
                  className="text-black"
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: responsiveFontSize(2),
                  }}>
                  Job Provider
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Who;

import {View, Text, Image} from 'react-native';
import React, {memo, useCallback} from 'react';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {formatDistanceToNow} from 'date-fns';

const Review = ({data}: any) => {
  const renderStars = useCallback(() => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const starColor = i <= data?.rating ? '#E2EA3B' : 'gray';
      stars.push(<IonIcons key={i} name="star" size={15} color={starColor} />);
    }

    return stars;
  }, [data?.rating]);

  return (
    <>
      {/* for one card start  */}
      <View className="flex flex-row gap-x-3">
        {/* profile  */}
        <View>
          {data?.reviewedBy?.profilePic?.url && (
            <Image
              source={{uri: data?.reviewedBy?.profilePic.url}}
              style={{height: 40, width: 40, borderRadius: 40}}
            />
          )}
        </View>
        {/* detials */}
        <View className="flex flex-col gap-y-1 pr-10">
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: responsiveFontSize(1.75),
            }}>
            {data?.reviewedBy?.username}
          </Text>
          <Text
            className="text-black"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.75),
            }}>
            {data?.reviewedBy?.location}
          </Text>
          <View className="flex flex-row gap-x-1">
            <View style={{flexDirection: 'row'}}>{renderStars()}</View>
            <Text className="text-black pl-2 font-bold">({data?.rating})</Text>
            <Text
              className="text-color2 pl-4"
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: responsiveFontSize(1.75),
              }}>
              {formatDistanceToNow(new Date(data?.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </View>
          <Text
            className="text-black tracking-wider leading-4"
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: responsiveFontSize(1.65),
            }}>
            {data?.review}
          </Text>
        </View>
      </View>
      {/* for one card end  */}
      {/* make a line */}
      <View
        className="my-3"
        style={{
          borderBottomColor: 'gray',
          borderBottomWidth: 1,
        }}
      />
    </>
  );
};

export default React.memo(Review);

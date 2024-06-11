import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ErrorToast} from '../../components/ErrorToast';
import {SuccessToast} from '../../components/SuccessToast';
import {axios_auth} from '../../global/config';

const PaymentSlipRenderer = ({
  data,
  getCompletedJob,
  bottomSheetModalRef,
}: any) => {
  const [images, setImages] = React.useState<any>([] || null);
  const [khaltiNumber, setKhaltiNumber] = React.useState<string>('');
  const [isRequested, setIsRequested] = React.useState<boolean>(false);

  const handleImagePicker = () => {
    const options: any = {
      title: 'Select Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
      selectionLimit: 2,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        ErrorToast('User cancelled image picker');
      } else if (response.errorCode) {
        ErrorToast('ImagePicker Error: ' + response.errorMessage);
      } else if (response.assets && Array.isArray(response.assets)) {
        const twoImages = response.assets.slice(0, 2);
        setImages(twoImages);
      }
    });
  };

  const updateKhaltiNumber = async () => {
    try {
      const response = await axios_auth.put(
        `/payment/updateKhalitNumber/${data?._id}`,
        {
          recieverNumber: khaltiNumber,
        },
      );
      if (response.status !== 200) {
        throw new Error('Failed to update khalti number');
      }
      SuccessToast('Khalti Number added successfully');
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

  const requestPaymentHandler = async () => {
    setIsRequested(true);
    try {
      if (!data?._id) {
        setIsRequested(false);
        return ErrorToast('Something went wrong, Please try again later');
      }
      if (
        data?.paymentType === 'online' &&
        (!khaltiNumber || khaltiNumber === '')
      ) {
        setIsRequested(false);
        return ErrorToast('Please Add your Khalti Number');
      }

      if (!Array.isArray(images) || images.length === 0) {
        setIsRequested(false);
        return ErrorToast('Please add images');
      }

      if (images.length < 2 || images.length > 2) {
        setIsRequested(false);
        return ErrorToast('Upload Front side and Back side of document');
      }

      const formData = new FormData();

      for (let i = 0; i < images.length; i++) {
        // Append each image with the key "files"
        formData.append(`files`, {
          uri: images[i].uri,
          type: images[i].type,
          name: images[i].fileName,
        });
      }

      const response = await axios_auth.put(
        `/payment/requestPayment/${data?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status !== 200) {
        setIsRequested(false);
        ErrorToast('Failed to update profile picture');
        // throw new Error('Failed to update profile picture');
      }
      updateKhaltiNumber();
      getCompletedJob();
      SuccessToast('Photos updated successfully');
      bottomSheetModalRef.current?.close();
      setIsRequested(false);
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
    setIsRequested(false);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <React.Fragment>
        {data?.paymentType !== 'cash' && (
          <>
            <View className="my-3">
              <Text
                className="text-black"
                style={{
                  fontSize: responsiveScreenFontSize(1.5),
                  fontWeight: 'bold',
                }}>
                Payment You will recieved after 5% deduction
              </Text>
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: responsiveFontSize(2),
                }}>
                Rs.{data?.amount - (data?.amount * 5) / 100}/-{' '}
              </Text>
            </View>
            <View className="gap-y-1">
              <Text
                className="text-red-500"
                style={{
                  fontSize: responsiveScreenFontSize(1.5),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: responsiveHeight(2),
                }}>
                Note: Enter your khalti number correctly. Payment will be sent
                to the provided khalti number.
              </Text>
              <Text
                className="text-black"
                style={{
                  fontFamily: 'Montserrat-Medium',
                }}>
                Enter your Khalti Number
              </Text>
              <TextInput
                className="bg-[#effff8] rounded-md text-black px-2"
                style={{fontFamily: 'Montserrat-SemiBold'}}
                placeholder="Enter your khalti number"
                placeholderTextColor="#bdbebf"
                onChangeText={text => setKhaltiNumber(text)}
                value={khaltiNumber}
              />
            </View>
          </>
        )}

        {/* citizen ship photos start  */}
        <View style={{marginBottom: responsiveHeight(4)}}>
          {/* image picker  */}
          <View className="gap-y-2">
            <Text
              className="text-red-500"
              style={{
                fontSize: responsiveScreenFontSize(1.5),
                fontWeight: 'bold',
                textAlign: 'center',
                padding: responsiveHeight(2),
              }}>
              {data?.paymentType !== 'cash'
                ? 'Note: Upload the Screenshot of confirmation message between you and job provider.'
                : 'Note: Upload some proof of payment.'}{' '}
              Note: Upload the Screenshot of confirmation message between you
              and job provider.
            </Text>
            <Text
              className="text-black"
              style={{fontFamily: 'Montserrat-Medium'}}>
              Add Images
            </Text>
            <TouchableOpacity onPress={() => handleImagePicker()}>
              <View className="bg-[#effff8] rounded-md text-black px-1 py-3">
                <Text
                  style={{fontFamily: 'Montserrat-SemiBold'}}
                  className="text-black">
                  {images === undefined || images.length === 0
                    ? 'Click to add images'
                    : 'Images added'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {Array.isArray(images) && images.length > 0 && (
            <View className="gap-y-2">
              <View className="flex flex-row items-center gap-x-3">
                <Text
                  className="text-black"
                  style={{fontFamily: 'Montserrat-Medium'}}>
                  Preview
                </Text>
                <Text
                  className="text-red-500"
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: responsiveFontSize(1.35),
                  }}>
                  Only First 2 images will be selected
                </Text>
              </View>
              <ScrollView className="flex flex-row gap-x-2" horizontal>
                {images.map((image: any) => (
                  <Image
                    key={image.uri}
                    source={{uri: image.uri}}
                    style={{
                      width: responsiveWidth(25),
                      height: responsiveHeight(25),
                      borderRadius: 10,
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* citizen ship photos end  */}
        <TouchableOpacity
          onPress={() => {
            requestPaymentHandler();
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
              {isRequested ? 'Requesting...' : 'Request Payment'}
            </Text>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    </ScrollView>
  );
};

const PaymentSlip = ({bottomSheetModalRef, data, getCompletedJob}: any) => {
  return (
    <React.Fragment>
      <View className="w-[100%] flex flex-row justify-between px-8 pb-2">
        <View className="flex flex-row items-center justify-center gap-x-2">
          <Text
            className="text-black"
            style={{
              fontSize: responsiveScreenFontSize(2),
              fontWeight: 'bold',
            }}>
            Request Payment
          </Text>
          <Text
            className="text-black"
            style={{
              fontSize: responsiveScreenFontSize(1),
              fontWeight: 'bold',
            }}>
            Payment Confirmation slip
          </Text>
        </View>
        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
          <AntDesign name="closecircle" size={20} color="red" className="p-5" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={[
          {
            key: 'form-key',
            component: (
              <PaymentSlipRenderer
                data={data}
                bottomSheetModalRef={bottomSheetModalRef}
                getCompletedJob={getCompletedJob}
              />
            ),
          },
        ]}
        renderItem={({item}) => item.component}
        contentContainerStyle={{
          padding: responsiveHeight(2),
          paddingBottom: responsiveHeight(10),
        }}></FlatList>
    </React.Fragment>
  );
};

export default PaymentSlip;

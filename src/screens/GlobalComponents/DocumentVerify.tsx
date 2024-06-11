import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ToastAndroid,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  ImagePickerResponse,
} from 'react-native-image-picker';
import RNTextDetector from 'rn-text-detector';
import {FlatList} from 'react-native-gesture-handler';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {userStateProps} from '../Job_seeker/Home';
import {useGlobalStore} from '../../global/store';
import {ErrorToast} from '../../components/ErrorToast';
import {SuccessToast} from '../../components/SuccessToast';
import {axios_auth} from '../../global/config';
import FastImage from 'react-native-fast-image';

// const DocumentVerifyRender = () => {
//   const [state, setState] = useState<{
//     loading: boolean;
//     image: string | null;
//     toast: {
//       message: string;
//       isVisible: boolean;
//     };
//     textRecognition: [] | null;
//   }>({
//     loading: false,
//     image: null,
//     textRecognition: null,
//     toast: {
//       message: '',
//       isVisible: false,
//     },
//   });

//   const requestCamera = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Truventorm Camera Permission',
//           message:
//             'Truventorm needs access to your camera ' +
//             'to set profile picture.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('You can use the camera');
//         launchCamera({mediaType: 'photo'}, onImageSelect);
//       } else {
//         console.log('Camera permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   function onPress(type: 'capture' | 'library') {
//     setState({...state, loading: true});
//     type === 'capture'
//       ? requestCamera()
//       : launchImageLibrary({mediaType: 'photo'}, onImageSelect);
//   }

//   async function onImageSelect(response: ImagePickerResponse) {
//     console.log('pressed');

//     if (
//       !response.assets ||
//       response.assets.length === 0 ||
//       !response.assets[0].uri
//     ) {
//       setState({...state, loading: false});
//       return;
//     }
//     const file = response.assets[0].uri;
//     const textRecognition = await RNTextDetector.detectFromUri(file);
//     const INFLIGHT_IT = 'Inflight IT';
//     const matchText = textRecognition.findIndex((item: {text: string}) =>
//       item.text.match(INFLIGHT_IT),
//     );
//     setState({
//       ...state,
//       textRecognition,
//       image: file,
//       toast: {
//         message: matchText > -1 ? 'Good!!' : '',
//         isVisible: matchText > -1,
//       },
//       loading: false,
//     });
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Verify Your Document</Text>
//         <View>
//           <TouchableOpacity
//             style={[styles.button, styles.shadow]}
//             onPress={() => onPress('capture')}>
//             <Text className="text-black">Take Photo</Text>
//           </TouchableOpacity>
//           <View>
//             <TouchableOpacity
//               style={[styles.button, styles.shadow]}
//               onPress={() => onPress('library')}>
//               <Text className="text-black">Pick a Photo</Text>
//             </TouchableOpacity>
//           </View>
//           <View>
//             <View style={{alignItems: 'center'}}>
//               <Image
//                 style={[styles.image, styles.shadow]}
//                 source={{uri: state.image || undefined}}
//               />
//             </View>
//             {!!state.textRecognition &&
//               state.textRecognition.map((item: {text: string}, i: number) => (
//                 <Text key={i} className="text-black">
//                   {item.text}
//                 </Text>
//               ))}
//           </View>
//         </View>
//         {/* {state.toast.isVisible &&
//             ToastAndroid.showWithGravityAndOffset(
//               state.toast.message,
//               ToastAndroid.LONG,
//               ToastAndroid.BOTTOM,
//               25,
//               50,
//             )} */}
//       </View>
//     </SafeAreaView>
//   );
// };

const DocumentVerifyRender = ({navigation}: any) => {
  const {user, checkAuth} = useGlobalStore();

  //images
  const [images, setImages] = React.useState<any>([] || null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const handleImagePicker = React.useCallback(() => {
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
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && Array.isArray(response.assets)) {
        const twoImages = response.assets.slice(0, 2);
        setImages(twoImages);
      }
    });
  }, [setImages]);

  const verifyDocumentHandler = async () => {
    setIsSubmitting(true);
    try {
      if (!user?.phoneNumber) {
        setIsSubmitting(false);
        return ErrorToast('Please Verify your phone number first');
      }

      if (!Array.isArray(images) || images.length === 0) {
        setIsSubmitting(false);
        return ErrorToast('Please add images');
      }

      if (images.length < 2 || images.length > 2) {
        setIsSubmitting(false);
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

      const response = await axios_auth.post(
        '/user/upload-document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status !== 201) {
        setIsSubmitting(false);
        ErrorToast('Failed to update profile picture');
        // throw new Error('Failed to update profile picture');
      }
      checkAuth();
      SuccessToast('Photos updated successfully');
      setIsSubmitting(false);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

  return (
    <React.Fragment>
      <View>
        <Text
          className="text-red-500"
          style={{
            fontSize: responsiveScreenFontSize(1.5),
            fontWeight: 'bold',
            textAlign: 'center',
            padding: responsiveHeight(2),
          }}>
          Note: You can't create a gig without verifying your document. This is
          to ensure that you are a real person and not a bot.
        </Text>
        <View className="flex flex-row justify-between w-[95%]">
          <View
            className="flex flex-col gap-y-2"
            style={{
              padding: responsiveHeight(2),
            }}>
            <Text
              className="text-black"
              style={{
                fontSize: responsiveScreenFontSize(2),
                fontWeight: 'bold',
              }}>
              Phone Number
            </Text>
            <Text
              className="text-color2"
              style={{
                fontSize: responsiveScreenFontSize(1.5),
                fontWeight: 'bold',
              }}>
              {user?.phoneNumber}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Phone_Verify', {
                id: '2323dfdf',
              })
            }>
            <Text
              className="text-color2"
              style={{
                fontSize: responsiveScreenFontSize(2),
                fontWeight: 'bold',
                padding: responsiveHeight(2),
              }}>
              {user?.phoneNumber === '' ? 'Add' : 'Change'}
            </Text>
          </TouchableOpacity>
        </View>

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
              Note: You can upload your citizenship card or passport or driving
              license. Please make sure the document is clear and visible.
            </Text>
            <Text
              className="text-black"
              style={{fontFamily: 'Montserrat-Medium'}}>
              Add Images
            </Text>
            <TouchableOpacity onPress={() => handleImagePicker()}>
              <View className="bg-[#effff8] rounded-md text-black px-2 py-4">
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
                      height: responsiveHeight(15),
                      borderRadius: 10,
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* citizen ship photos end  */}
        <View className="w-[100%] bg-color2 flex items-center justify-center rounded-md">
          {isSubmitting ? (
            <Text
              className="text-white tracking-widest"
              style={{
                paddingVertical: responsiveHeight(1.75),
                paddingHorizontal: responsiveWidth(2),
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2.25),
              }}>
              Requesting...
            </Text>
          ) : (
            <TouchableOpacity onPress={verifyDocumentHandler}>
              <Text
                className="text-white tracking-widest"
                style={{
                  paddingVertical: responsiveHeight(1.75),
                  paddingHorizontal: responsiveWidth(2),
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2.25),
                }}>
                {isSubmitting ? 'Requesting...' : 'Request'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    color: 'black',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
  },
});

const DocumentVerify = ({bottomSheetModalRef, navigation}: any) => {
  const user: userStateProps = useGlobalStore(state => state.user);

  return (
    <>
      <View className="w-[100%] flex flex-row justify-between px-8 pb-2">
        <View className="flex flex-row items-center justify-center gap-x-2">
          <Text
            className="text-black"
            style={{fontSize: responsiveScreenFontSize(2), fontWeight: 'bold'}}>
            Verify Document
          </Text>
        </View>
        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
          <AntDesign name="closecircle" size={20} color="red" className="p-5" />
        </TouchableOpacity>
      </View>
      {user && user?.isDocumentVerified === 'verified' && (
        <View>
          <Text
            className="text-green-500"
            style={{
              fontSize: responsiveScreenFontSize(1.5),
              fontWeight: 'bold',
              textAlign: 'center',
              padding: responsiveHeight(2),
            }}>
            Your documents are verified. You can now create a gig.
          </Text>
          <View className="w-[100%] flex items-center justify-center rounded-md">
            <View className="flex flex-row justify-between w-[95%]">
              <View
                className="flex flex-col gap-y-2"
                style={{
                  padding: responsiveHeight(2),
                }}>
                <Text
                  className="text-black"
                  style={{
                    fontSize: responsiveScreenFontSize(2),
                    fontWeight: 'bold',
                  }}>
                  Phone Number
                </Text>
                <Text
                  className="text-color2"
                  style={{
                    fontSize: responsiveScreenFontSize(1.5),
                    fontWeight: 'bold',
                  }}>
                  {user?.phoneNumber}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Phone_Verify', {
                    id: '2323dfdf',
                  })
                }>
                <Text
                  className="text-color2"
                  style={{
                    fontSize: responsiveScreenFontSize(2),
                    fontWeight: 'bold',
                    padding: responsiveHeight(2),
                  }}>
                  {user?.phoneNumber === '' ? 'Add' : 'Change'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* citizenship started */}
            <ScrollView className="flex flex-row gap-x-2" horizontal>
              {user?.documents.map((image: any) => (
                <FastImage
                  key={image.url}
                  source={{uri: image.url}}
                  style={{
                    width: responsiveWidth(40),
                    height: responsiveHeight(20),
                    borderRadius: 10,
                  }}
                />
              ))}
            </ScrollView>
            {/* citizenship end  */}
          </View>
        </View>
      )}
      {user && user?.isDocumentVerified === 'Pending' && (
        <View>
          <Text
            className="text-red-500"
            style={{
              fontSize: responsiveScreenFontSize(1.5),
              fontWeight: 'bold',
              textAlign: 'center',
              padding: responsiveHeight(2),
            }}>
            Your documents are pending. NepalKamma is currently reviewing them.
            We will email you once your documents have been verified. Thank you
            for your patience.
          </Text>
          <View className="w-[100%] flex items-center justify-center rounded-md">
            <TouchableOpacity
              className="bg-color2 w-[85%] flex items-center justify-center rounded-md"
              onPress={() => bottomSheetModalRef.current?.close()}>
              <Text
                className="text-white tracking-widest"
                style={{
                  paddingVertical: responsiveHeight(1.75),
                  paddingHorizontal: responsiveWidth(2),
                  fontFamily: 'Montserrat-Bold',
                  fontSize: responsiveFontSize(2.25),
                }}>
                Go to Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {user && user?.isDocumentVerified === 'is_not_verified' && (
        <FlatList
          data={[
            {
              key: 'form-key',
              component: <DocumentVerifyRender navigation={navigation} />,
            },
          ]}
          renderItem={({item}) => item.component}
          contentContainerStyle={{
            padding: responsiveHeight(2),
            paddingBottom: responsiveHeight(10),
          }}></FlatList>
      )}
    </>
  );
};

export default React.memo(DocumentVerify);

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {Formik} from 'formik';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {category} from '../GlobalComponents/SkillsData';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import BottonSheetEditorSeeker from './BottonSheetEditorSeeker';
import {SuccessToast} from '../../components/SuccessToast';
import {CreateGigStore} from './helper/CreateGigStore';
import {ErrorToast} from '../../components/ErrorToast';
import {launchImageLibrary} from 'react-native-image-picker';
import {axios_auth} from '../../global/config';
import {useGlobalStore} from '../../global/store';

interface CreateGigsProps {
  title: string;
  price: number;
}

const initialValues: CreateGigsProps = {
  title: '',
  price: 500,
};

interface createJobProps {
  createGig: (values: any) => Promise<any>;
}

function CreateForm() {
  const user: any = useGlobalStore((state: any) => state.user);

  // category
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  // job description
  const [gig_description, setGigDescription] = React.useState<string>('');

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  //images
  const [images, setImages] = React.useState<any>([] || null);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleCreateJob = async (values: any) => {
    if (user?.isDocumentVerified !== 'verified') {
      ErrorToast('Please verify your document first');
      return;
    }
    setIsSubmitting(true);
    try {
      if (!Array.isArray(images) || images.length === 0) {
        setIsSubmitting(false);
        return ErrorToast('Please add images');
      }

      if (
        values.title === '' ||
        values.price === 0 ||
        selectedCategory === '' ||
        gig_description === ''
      ) {
        setIsSubmitting(false);
        return ErrorToast('All fields are required');
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

      const response = await axios_auth.post('/gig/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status !== 201) {
        setIsSubmitting(false);
        ErrorToast('Failed to update profile picture');
        // throw new Error('Failed to update profile picture');
      }
      SuccessToast('Photos updated successfully');
      const newValues = {
        ...values,
        category: selectedCategory,
        gig_description: gig_description,
      };

      const response1 = await (CreateGigStore.getState() as any).createGig(
        newValues,
        response?.data?.imagesData._id,
      );
      if (response1) {
        SuccessToast('Gig Created Successfully');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      const errorMessage = error
        .toString()
        .replace('[Error: ', '')
        .replace(']', '');
      ErrorToast(errorMessage);
    }
  };

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
      selectionLimit: 3,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        ErrorToast('User cancelled image picker');
      } else if (response.errorCode) {
        ErrorToast('Something went wrong: selecting image');
      } else if (response.assets && Array.isArray(response.assets)) {
        const threeImages = response.assets.slice(0, 3);
        setImages(threeImages);
      }
    });
  };

  return (
    <View className="w-[100%] py-5 h-[100%] bg-white flex items-center justify-center">
      <View className="w-[85%] flex flex-row gap-x-2 pb-4">
        <Text
          className="text-black"
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: responsiveFontSize(3),
          }}>
          Create a
        </Text>
        <Text
          className="text-color2"
          style={{
            fontFamily: 'Montserrat-Bold',
            fontSize: responsiveFontSize(3),
          }}>
          Gig
        </Text>
      </View>
      <View className="w-[85%]">
        <Formik
          initialValues={initialValues}
          onSubmit={(values: CreateGigsProps) => {
            handleCreateJob(values);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View>
              <View className="gap-y-2">
                {/* gig_title */}
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Title
                  </Text>
                  <TextInput
                    className="bg-[#effff8] rounded-md text-black px-2"
                    style={{fontFamily: 'Montserrat-SemiBold'}}
                    placeholder="Gig Title"
                    placeholderTextColor="#bdbebf"
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    value={values.title}
                  />
                  {errors.title && (
                    <Text
                      className="text-red-500"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      {errors.title}
                    </Text>
                  )}
                </View>

                {/* Gig Description */}
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    About the Gig
                  </Text>
                  <TouchableOpacity onPress={() => handlePresentModalPress()}>
                    <Text
                      className="bg-[#effff8] rounded-md text-[#bdbebf] px-2 py-4"
                      style={{fontFamily: 'Montserrat-SemiBold'}}>
                      {gig_description === ''
                        ? 'Enter gig description...'
                        : 'Gig Description added'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <BottomSheetModal
                  ref={bottomSheetModalRef}
                  index={1}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 24,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 20,
                    },
                    shadowOpacity: 0.8,
                    shadowRadius: 24,
                    elevation: 30,
                    flex: 1,
                    overflow: 'scroll',
                  }}
                  snapPoints={snapPoints}
                  onChange={handleSheetChanges}>
                  <View className="flex flex-1 items-center rounded-t-2xl">
                    <BottonSheetEditorSeeker
                      bottomSheetModalRef={bottomSheetModalRef}
                      setGigDescription={setGigDescription}
                      gig_description={gig_description}
                    />
                  </View>
                </BottomSheetModal>

                {/* Price */}
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Pricing
                  </Text>
                  <TextInput
                    keyboardType="number-pad"
                    className="bg-[#effff8] rounded-md text-black px-2"
                    style={{fontFamily: 'Montserrat-SemiBold'}}
                    placeholder="Enter price"
                    placeholderTextColor="#bdbebf"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    value={values.price.toString()}
                  />
                  {errors.price && (
                    <Text
                      className="text-red-500"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      {errors.price}
                    </Text>
                  )}
                </View>

                {/* image picker  */}
                <View className="gap-y-2">
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
                        Only First 3 images will be selected
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

                {/* Category */}
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Category
                  </Text>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={itemValue => setSelectedCategory(itemValue)}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      height: 40,
                      backgroundColor: '#effff8',
                      borderRadius: 20,
                      width: '100%',
                      color: 'black',
                      marginBottom: responsiveHeight(4),
                    }}>
                    {category.map(item => (
                      <Picker.Item
                        key={item.id}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                </View>

                {/* Add a submit button */}
                <View>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    activeOpacity={0.8}>
                    <View className="w-[100%] bg-color2 flex items-center justify-center rounded-md">
                      <Text
                        className="text-white"
                        style={{
                          paddingVertical: responsiveHeight(1.75),
                          paddingHorizontal: responsiveWidth(2),
                          fontFamily: 'Montserrat-Bold',
                          fontSize: responsiveFontSize(2.25),
                        }}>
                        {isSubmitting ? 'Creating...' : 'Create Gig'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const CreateGigs = () => {
  return (
    // <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>
    <BottomSheetModalProvider>
      <FlatList
        data={[{key: 'form-key', component: <CreateForm />}]}
        renderItem={({item}) => item.component}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: responsiveHeight(5),
        }}
        ListFooterComponent={
          <View style={{height: 100, backgroundColor: 'white'}} />
        }
      />
    </BottomSheetModalProvider>
    // </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    color: 'black',
    fontFamily: 'Montserrat-Medium',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CreateGigs;

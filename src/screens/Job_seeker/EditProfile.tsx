import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FlatList} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import MultiSelect from 'react-native-multiple-select';
import {Skills_data} from '../GlobalComponents/SkillsData';
import {SuccessToast} from '../../components/SuccessToast';
import {ErrorToast} from '../../components/ErrorToast';
import {UserStore} from './helper/UserStore';
import {useGlobalStore} from '../../global/store';
import GeoLocation from '../GlobalComponents/GeoLocation';

interface editProfileProps {
  username: string;
  title: string;
  bio: string;
  about_me: string;
}

interface editProfileApiProps {
  editProfile: (id: string, values: any) => Promise<any>;
}

const RenderItem = () => {
  const {user, checkAuth} = useGlobalStore();
  const [selectedItem, setSelectedItem] = React.useState<any>([]);
  //location name
  const [locationName, setLocationName] = React.useState<string>('');

  //geometry
  const [geometry, setGeometry] = React.useState<any>({});

  const initialValues = useMemo(
    () => ({
      username: user.username,
      title: user.title,
      bio: user.bio,
      about_me: user.about_me,
    }),
    [user],
  );

  const handleEditProfile = useCallback(
    async (values: editProfileProps) => {
      try {
        const skillsRequired = selectedItem.map(
          (index: any) => Skills_data[index - 1],
        );

        const newValues = {
          ...values,
          skills: skillsRequired?.map((skill: any) => skill.name),
          location: locationName,
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0],
        };

        const response = await (
          UserStore.getState() as editProfileApiProps
        ).editProfile(user._id, newValues);

        if (response) {
          checkAuth();
          SuccessToast('Profile Updated Successfully');
        }
      } catch (error: any) {
        const errorMessage = error
          .toString()
          .replace('[Error: ', '')
          .replace(']', '');
        ErrorToast(errorMessage);
      }
    },
    [checkAuth, geometry.coordinates, locationName, selectedItem, user._id],
  );

  return (
    <View className="flex flex-col items-center ">
      <Text>EditProfile</Text>
      <View className="w-[85%]">
        <Formik
          initialValues={initialValues}
          onSubmit={(values: editProfileProps) => {
            handleEditProfile(values);
          }}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View>
              <View className="gap-y-2">
                {/* Username */}
                <View className="gap-y-2">
                  <Text
                    className="text-black"
                    style={{fontFamily: 'Montserrat-Medium'}}>
                    Username
                  </Text>
                  <TextInput
                    className="bg-[#effff8] rounded-md text-black px-2"
                    style={{fontFamily: 'Montserrat-SemiBold'}}
                    placeholder="Username"
                    placeholderTextColor="#bdbebf"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                  {errors.username && (
                    <Text
                      className="text-red-500"
                      style={{fontFamily: 'Montserrat-Regular'}}>
                      {errors.username}
                    </Text>
                  )}

                  {/* title */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Title
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}
                      placeholder="You are a ..."
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

                  {/* Bio */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Bio
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}
                      placeholder="Bio"
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange('bio')}
                      onBlur={handleBlur('bio')}
                      value={values.bio}
                    />
                    {errors.bio && (
                      <Text
                        className="text-red-500"
                        style={{fontFamily: 'Montserrat-Regular'}}>
                        {errors.bio}
                      </Text>
                    )}
                  </View>

                  {/* Location */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      Location
                    </Text>
                    <GeoLocation
                      setGeometry={setGeometry}
                      setLocationName={setLocationName}
                    />
                  </View>

                  {/* About Me */}
                  <View className="gap-y-2">
                    <Text
                      className="text-black"
                      style={{fontFamily: 'Montserrat-Medium'}}>
                      About Me
                    </Text>
                    <TextInput
                      className="bg-[#effff8] rounded-md text-black px-2"
                      style={{fontFamily: 'Montserrat-SemiBold'}}
                      placeholder="About Me"
                      placeholderTextColor="#bdbebf"
                      onChangeText={handleChange('about_me')}
                      onBlur={handleBlur('about_me')}
                      value={values.about_me}
                    />
                    {errors.about_me && (
                      <Text
                        className="text-red-500"
                        style={{fontFamily: 'Montserrat-Regular'}}>
                        {errors.about_me}
                      </Text>
                    )}
                  </View>

                  {/* Skills required */}
                  {user && user?.role === 'job_seeker' && (
                    <View className="gap-y-2">
                      <Text
                        className="text-black"
                        style={{fontFamily: 'Montserrat-Medium'}}>
                        Add Skills
                      </Text>
                      <MultiSelect
                        hideTags={true}
                        items={Skills_data}
                        hideSubmitButton={true}
                        uniqueKey="id"
                        onSelectedItemsChange={(selectedItems): any => {
                          setSelectedItem(selectedItems);
                        }}
                        selectedItems={selectedItem}
                        selectText="Pick Skills"
                        searchInputPlaceholderText="Search Items..."
                        altFontFamily="Montserrat-Medium"
                        itemFontFamily="Montserrat-Regular"
                        itemFontSize={responsiveFontSize(1.75)}
                        selectedItemFontFamily="Montserrat-Regular"
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#79AC78"
                        selectedItemIconColor="#79AC78"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{color: '#CCC'}}
                      />
                      <View className="flex flex-row">
                        <FlatList
                          horizontal={true}
                          data={selectedItem}
                          renderItem={({item}) => {
                            return (
                              <View
                                style={{marginBottom: responsiveHeight(1)}}
                                className="bg-gray-300 mr-2 py-1 px-2 rounded-md">
                                <Text
                                  className="text-black"
                                  style={{
                                    fontSize: responsiveFontSize(1.75),
                                    fontFamily: 'Montserrat-Regular',
                                  }}>
                                  {Skills_data[item - 1].name}
                                </Text>
                              </View>
                            );
                          }}
                        />
                      </View>
                    </View>
                  )}

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
                          Done
                          {/* {isSubmitting ? 'Creating ...' : 'Create Gig'} */}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const EditProfile = ({bottomSheetModalRef}: any) => {
  return (
    <>
      <View className="w-[100%] flex flex-row justify-between px-8 pb-2">
        <View className="flex flex-row items-center justify-center gap-x-2">
          <Text
            className="text-black"
            style={{fontSize: responsiveScreenFontSize(2), fontWeight: 'bold'}}>
            Edit Profile
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
            component: <RenderItem />,
          },
        ]}
        renderItem={({item}) => item.component}
        contentContainerStyle={{
          paddingBottom: responsiveHeight(10),
        }}></FlatList>
    </>
  );
};

export default React.memo(EditProfile);

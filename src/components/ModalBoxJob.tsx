/**
 * @file ModalBox.tsx
 * @description This file contains a modal component that displays a message and an OK button.
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {axios_auth} from '../global/config';
import {ErrorToast} from './ErrorToast';
import UserItem from './UserItem';

/**
 *
 * @param isModalVisible - A boolean indicating whether the modal is visible or not.
 * @param handleOkFunction - A function to be called when the OK button is pressed.
 * @param setSelectedStatus - A function to set the selected status.
 * @param selectedStatus - The currently selected status.
 * @param setIsModalVisible - A function to set the modal visibility.
 * @param setSelectedUsers - A function to set the selected users.
 * @param selectedUsers - The currently selected users.
 * @description ModalBoxJob component is used to display a modal for selecting the status of a job and searching for users.
 * @component
 * @returns {JSX.Element} - Returns a modal component with job status selection and user search functionality.
 */
const ModalBoxJob = ({
  isModalVisible,
  handleOkFunction,
  setSelectedStatus,
  selectedStatus,
  setIsModalVisible,
  setSelectedUsers,
  selectedUsers,
}: any) => {
  const [searchText, setSearchText] = React.useState<string>('');
  const [searchedUser, setSearchedUser] = React.useState<any>(null);
  const [isLoadingSearch, setIsLoadingSearch] = React.useState<boolean>(false);

  const status = [
    {id: 1, name: 'In_Progress'},
    {id: 2, name: 'Pending'},
    {id: 3, name: 'Completed'},
    {id: 4, name: 'Cancelled'},
  ];

  /**
   *
   * @returns {Promise<void>} - A promise that resolves when the user search is complete.
   * @description This function handles the user search functionality. It sends a request to the server to search for users based on the entered username.
   * @async
   * @function searchUserHandler
   *
   */
  const searchUserHandler = async () => {
    if (searchText === '') return ErrorToast('Please enter a username');
    setIsLoadingSearch(true);
    try {
      const response = await axios_auth.get(`/user/search-user/${searchText}`);
      if (response.status === 200) {
        setSearchedUser(response.data?.user);
      }
    } catch (error) {
      ErrorToast('User not found');
    }
    setIsLoadingSearch(false);
  };

  /**
   *
   * @param user - The user object to be selected or deselected.
   * @description This function handles the selection and deselection of users in the modal.
   * @function handleSelect
   *
   */
  const handleSelect = (user: any) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u: any) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <Modal isVisible={isModalVisible}>
      <View style={{flex: 1}} className="flex items-center justify-center">
        <View
          style={{width: responsiveWidth(85)}}
          className="bg-white rounded-lg py-8">
          <View className="w-[100%] flex items-end justify-end px-4">
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Entypo name="circle-with-cross" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-col items-center justify-center">
            <FontAwesome5 name="user-tie" size={60} color="#79AC78" />
            <Text
              className="text-color2 mb-3"
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: responsiveFontSize(2.5),
              }}>
              Got a Freelancer?
            </Text>
            <Text
              className="text-black mb-4"
              style={{
                fontFamily: 'Montserrat-SemiBold',
                fontSize: responsiveFontSize(2),
              }}>
              Select the Status of the Job
            </Text>
            <View
              style={{
                height: 40,
                backgroundColor: '#effff8',
                borderRadius: 20,
                marginBottom: responsiveHeight(4),
                width: '90%',
              }}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={itemValue => setSelectedStatus(itemValue)}
                dropdownIconColor="black"
                dropdownIconRippleColor="white"
                mode="dropdown"
                style={{width: '90%'}}>
                {status.map(item => (
                  <Picker.Item
                    key={item.id}
                    label={item.name}
                    value={item.name}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      color: '#79AC78',
                    }}
                  />
                ))}
              </Picker>
            </View>
            <View style={{marginVertical: responsiveHeight(2)}}>
              {selectedStatus !== 'Pending' &&
                selectedStatus !== 'Cancelled' && (
                  <>
                    <View style={styles.container}>
                      <TextInput
                        style={styles.input}
                        placeholder="Paste username.."
                        placeholderTextColor="#8D8D8D"
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                      />
                      <TouchableOpacity
                        style={styles.searchButton}
                        onPress={searchUserHandler}>
                        <Text style={styles.searchButtonText}>
                          {isLoadingSearch ? 'Searching...' : 'Search'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              {selectedStatus !== 'Pending' &&
                selectedStatus !== 'Cancelled' &&
                searchedUser &&
                Array.isArray(searchedUser) &&
                searchedUser.length > 0 &&
                searchedUser.map((user, index) => (
                  <UserItem
                    key={index}
                    profilePic={user?.profilePic?.url}
                    username={user?.username}
                    selected={selectedUsers.includes(user)}
                    onSelect={() => handleSelect(user)}
                  />
                ))}
            </View>

            {selectedStatus === 'Pending' || selectedStatus === 'Cancelled' ? (
              <View className="w-[100%] justify-start items-center mb-4">
                <TouchableOpacity onPress={() => handleOkFunction()}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '25%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : selectedStatus !== 'Pending' &&
              selectedStatus !== 'Cancelled' &&
              selectedUsers &&
              Array.isArray(selectedUsers) &&
              selectedUsers.length > 0 ? (
              <View className="w-[100%] justify-start items-center mb-4">
                <TouchableOpacity onPress={() => handleOkFunction()}>
                  <View
                    className="bg-color2 flex items-center justify-center py-2 px-5 rounded-md"
                    style={{width: '25%'}}>
                    <Text
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: responsiveFontSize(2),
                      }}>
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: responsiveFontSize(1.75),
    color: '#333333',
    fontFamily: 'Montserrat-SemiBold',
  },
  searchButton: {
    backgroundColor: '#79AC78',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(ModalBoxJob);

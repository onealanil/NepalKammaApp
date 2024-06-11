import React, {memo} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import ModalBoxFilter from '../../components/ModalBoxFiter';

const Search = ({
  text,
  user,
  setSelectedDistance,
  setLowToHigh,
  setHighToLow,
  setSortByRating,
  isModalVisible,
  setModalVisible,
  handleOkFunction,
  selectedDistance,
  setSearchText,
  resetSearch,
}: any) => {
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    const timeoutId = setTimeout(focusInput, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <IonIcons name="search" color="gray" size={25} />
        </View>
        {user?.role === 'job_seeker' ? (
          <TextInput
            style={styles.input}
            placeholder="Search for job..."
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
            onChangeText={(value: any) => setSearchText(value)}
            onSubmitEditing={handleOkFunction}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder={
              text && text === 'Home'
                ? 'Search Gigs ...'
                : 'Search Freelancers ...'
            }
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
            onChangeText={(value: any) => setSearchText(value)}
            onSubmitEditing={handleOkFunction}
          />
        )}
      </View>
      {text === 'freelancers' ? (
        <TouchableOpacity style={styles.button}>
          <View>
            <View style={styles.iconContainer}>
              <IonIcons name="options-outline" color="black" size={25} />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <View>
            <View style={styles.iconContainer}>
              <IonIcons name="options-outline" color="black" size={25} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      <ModalBoxFilter
        isModalVisible={isModalVisible}
        setSelectedDistance={setSelectedDistance}
        setHighToLow={setHighToLow}
        setLowToHigh={setLowToHigh}
        setSortByRating={setSortByRating}
        handleOkFunction={handleOkFunction}
        selectedDistance={selectedDistance}
        resetSearch={resetSearch}
        setModalVisible={setModalVisible}
        modalMessage={`${
          user?.role === 'job_seeker' ? 'Filter Jobs' : 'Filter Gigs'
        }`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginLeft: 5,
  },
  iconContainer: {
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 3,
    fontSize: 14,
    color: '#111827',
    fontFamily: 'Montserrat-SemiBold',
  },
  button: {
    padding: 5,
    marginLeft: 1,
  },
});

export default memo(Search);
